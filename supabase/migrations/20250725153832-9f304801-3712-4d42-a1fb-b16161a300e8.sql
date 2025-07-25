
-- Undo Critical Security Fix 1: Disable RLS on organization_users table
ALTER TABLE public.organization_users DISABLE ROW LEVEL SECURITY;

-- Undo Critical Security Fix 2: Remove search_path from database functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_feedback_response_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  question_text_snapshot TEXT;
BEGIN
  question_text_snapshot := NEW.question_snapshot->>'question_text';

  INSERT INTO public.notifications (organization_id, type, title, message, metadata)
  VALUES (
    NEW.organization_id,
    'info',
    'New Feedback Received',
    'For question: ' || COALESCE(question_text_snapshot, 'N/A'),
    jsonb_build_object(
      'response_id', NEW.id,
      'session_id', NEW.session_id,
      'question_id', NEW.question_id,
      'response_value', NEW.response_value
    )
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT email FROM auth.users WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_join_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') OR (TG_OP = 'UPDATE' AND NEW.status = 'active' AND OLD.status != 'active') THEN
    INSERT INTO public.notifications (organization_id, type, title, message, metadata)
    VALUES (
      NEW.organization_id,
      'success',
      'New Member Joined',
      NEW.email || ' has joined your organization.',
      jsonb_build_object(
        'user_id', NEW.user_id,
        'organization_user_id', NEW.id,
        'email', NEW.email,
        'role', NEW.role
      )
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_role_hierarchy_level(user_role enhanced_org_role)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $function$
  SELECT CASE user_role
    WHEN 'owner' THEN 6
    WHEN 'admin' THEN 5
    WHEN 'manager' THEN 4
    WHEN 'analyst' THEN 3
    WHEN 'member' THEN 2
    WHEN 'viewer' THEN 1
    ELSE 0
  END;
$function$;

CREATE OR REPLACE FUNCTION public.can_manage_user_role(manager_role enhanced_org_role, target_role enhanced_org_role)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $function$
  SELECT get_role_hierarchy_level(manager_role) > get_role_hierarchy_level(target_role);
$function$;

CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id uuid, p_org_id uuid, p_permission_key text)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(rp.permission_value, '{"allowed": false}'::jsonb)
  FROM public.organization_users ou
  LEFT JOIN public.role_permissions rp ON rp.role = ou.enhanced_role AND rp.permission_key = p_permission_key
  WHERE ou.user_id = p_user_id AND ou.organization_id = p_org_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_enhanced_role(p_user_id uuid, p_org_id uuid)
RETURNS enhanced_org_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT enhanced_role
  FROM public.organization_users
  WHERE user_id = p_user_id AND organization_id = p_org_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_organization_members(p_org_id uuid)
RETURNS SETOF member_with_inviter
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        ou.id,
        ou.user_id,
        ou.email,
        ou.role,
        ou.status,
        ou.created_at,
        ou.accepted_at,
        CASE
            WHEN ou.invited_by_user_id IS NOT NULL THEN
                (SELECT jsonb_build_object('email', u.email) FROM auth.users u WHERE u.id = ou.invited_by_user_id)
            ELSE
                NULL
        END AS invited_by
    FROM
        organization_users ou
    WHERE
        ou.organization_id = p_org_id
    ORDER BY
        ou.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.safe_delete_question(question_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  response_count INTEGER;
  org_id UUID;
BEGIN
  -- Get the organization_id for the question
  SELECT organization_id INTO org_id FROM questions WHERE id = question_uuid;
  
  -- Check if there are any responses for this question
  SELECT COUNT(*) INTO response_count 
  FROM feedback_responses 
  WHERE question_id = question_uuid;
  
  IF response_count > 0 THEN
    -- If responses exist, mark question as inactive instead of deleting
    UPDATE questions 
    SET is_active = false, 
        updated_at = now(),
        question_text = question_text || ' [ARCHIVED]'
    WHERE id = question_uuid;
    
    -- Log the archival in question snapshot for future responses (if any)
    UPDATE feedback_responses 
    SET question_snapshot = jsonb_set(
      COALESCE(question_snapshot, '{}'::jsonb),
      '{archived_at}',
      to_jsonb(now()::text)
    )
    WHERE question_id = question_uuid;
    
    RETURN false; -- Indicates question was archived, not deleted
  ELSE
    -- Safe to delete if no responses exist
    DELETE FROM question_scale_config WHERE question_id = question_uuid;
    DELETE FROM question_options WHERE question_id = question_uuid;
    DELETE FROM questions WHERE id = question_uuid;
    
    RETURN true; -- Indicates question was actually deleted
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.capture_question_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Capture question snapshot if not already provided
  IF NEW.question_snapshot IS NULL THEN
    SELECT jsonb_build_object(
      'id', q.id,
      'question_text', q.question_text,
      'question_type', q.question_type,
      'category', q.category,
      'is_required', q.is_required,
      'order_index', q.order_index,
      'organization_id', q.organization_id,
      'captured_at', now(),
      'options', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('text', option_text, 'value', option_value) ORDER BY display_order) 
         FROM question_options WHERE question_id = q.id AND is_active = true),
        '[]'::jsonb
      ),
      'scale', COALESCE(
        (SELECT jsonb_build_object('min', min_value, 'max', max_value, 'minLabel', min_label, 'maxLabel', max_label)
         FROM question_scale_config WHERE question_id = q.id LIMIT 1),
        null
      )
    ),
    q.question_text,
    q.question_type
    INTO NEW.question_snapshot, NEW.question_text_snapshot, NEW.question_type_snapshot
    FROM questions q 
    WHERE q.id = NEW.question_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_api_key(p_organization_id uuid, p_key_name text, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_key_prefix TEXT;
  v_key_secret TEXT;
  v_hashed_key TEXT;
  v_full_key TEXT;
BEGIN
  -- Permission check
  IF NOT (is_current_user_org_admin(p_organization_id) OR get_current_user_admin_status()) THEN
    RAISE EXCEPTION 'No permission to create API key for this organization.';
  END IF;

  -- Generate key components
  v_key_prefix := 'sk_org_' || substr(md5(random()::text), 1, 12);
  v_key_secret := replace(gen_random_uuid()::text, '-', '');
  v_hashed_key := encode(digest(v_key_secret, 'sha256'), 'hex');
  v_full_key := v_key_prefix || '_' || v_key_secret;

  -- Store the new key
  INSERT INTO public.api_keys (organization_id, key_name, hashed_key, key_prefix, expires_at, status)
  VALUES (p_organization_id, p_key_name, v_hashed_key, v_key_prefix, p_expires_at, 'active');

  RETURN v_full_key;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_api_key(p_api_key text)
RETURNS TABLE(is_valid boolean, org_id uuid, key_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_key_prefix TEXT;
  v_key_secret TEXT;
  v_api_key_record RECORD;
  last_underscore_pos INT;
BEGIN
  last_underscore_pos := length(p_api_key) - position('_' in reverse(p_api_key)) + 1;

  IF last_underscore_pos <= 1 OR last_underscore_pos >= length(p_api_key) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;

  v_key_prefix := substring(p_api_key from 1 for last_underscore_pos - 1);
  v_key_secret := substring(p_api_key from last_underscore_pos + 1);

  SELECT id, organization_id, hashed_key, status, expires_at
  INTO v_api_key_record
  FROM public.api_keys
  WHERE key_prefix = v_key_prefix;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;

  IF v_api_key_record.status != 'active' OR (v_api_key_record.expires_at IS NOT NULL AND v_api_key_record.expires_at < now()) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID;
    RETURN;
  END IF;

  IF v_api_key_record.hashed_key = encode(digest(v_key_secret, 'sha256'), 'hex') THEN
    UPDATE public.api_keys SET last_used_at = now() WHERE id = v_api_key_record.id;
    RETURN QUERY SELECT true, v_api_key_record.organization_id, v_api_key_record.id;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID;
  END IF;
END;
$function$;

-- Drop security monitoring table and related policies
DROP POLICY IF EXISTS "System admins can view security events" ON public.security_events;
DROP POLICY IF EXISTS "Service role can insert security events" ON public.security_events;
DROP TABLE IF EXISTS public.security_events;

-- Drop the security event logging function
DROP FUNCTION IF EXISTS public.log_security_event(text, uuid, uuid, inet, text, jsonb, text);
