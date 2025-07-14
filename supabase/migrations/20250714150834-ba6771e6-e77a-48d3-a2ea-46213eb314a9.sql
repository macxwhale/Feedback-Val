
-- Update RLS policies to use enhanced_role instead of legacy role column

-- Update organization_users policies
DROP POLICY IF EXISTS "Org admins can manage their org members" ON public.organization_users;
CREATE POLICY "Org admins can manage their org members" ON public.organization_users
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM public.organization_users ou_check
    WHERE ou_check.user_id = auth.uid() 
    AND ou_check.organization_id = organization_users.organization_id 
    AND ou_check.enhanced_role IN ('admin', 'owner')
    AND ou_check.status = 'active'
  )) OR (get_current_user_admin_status() = true)
);

-- Update questions policies
DROP POLICY IF EXISTS "Organization admins can create questions" ON public.questions;
CREATE POLICY "Organization admins can create questions" ON public.questions
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid() 
    AND enhanced_role IN ('admin', 'owner', 'manager') 
    AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Organization admins can update their questions" ON public.questions;
CREATE POLICY "Organization admins can update their questions" ON public.questions
FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid() 
    AND enhanced_role IN ('admin', 'owner', 'manager') 
    AND status = 'active'
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid() 
    AND enhanced_role IN ('admin', 'owner', 'manager') 
    AND status = 'active'
  )
);

DROP POLICY IF EXISTS "Organization admins can delete their questions" ON public.questions;
CREATE POLICY "Organization admins can delete their questions" ON public.questions
FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_users 
    WHERE user_id = auth.uid() 
    AND enhanced_role IN ('admin', 'owner', 'manager') 
    AND status = 'active'
  )
);

-- Update question_options policies
DROP POLICY IF EXISTS "Organization admins can manage question options" ON public.question_options;
CREATE POLICY "Organization admins can manage question options" ON public.question_options
FOR ALL
USING (
  question_id IN (
    SELECT q.id
    FROM questions q
    WHERE q.organization_id IN (
      SELECT organization_id
      FROM organization_users
      WHERE user_id = auth.uid() 
      AND enhanced_role IN ('admin', 'owner', 'manager') 
      AND status = 'active'
    )
  )
)
WITH CHECK (
  question_id IN (
    SELECT q.id
    FROM questions q
    WHERE q.organization_id IN (
      SELECT organization_id
      FROM organization_users
      WHERE user_id = auth.uid() 
      AND enhanced_role IN ('admin', 'owner', 'manager') 
      AND status = 'active'
    )
  )
);

-- Update question_scale_config policies
DROP POLICY IF EXISTS "Organization admins can manage question scale config" ON public.question_scale_config;
CREATE POLICY "Organization admins can manage question scale config" ON public.question_scale_config
FOR ALL
USING (
  question_id IN (
    SELECT q.id
    FROM questions q
    WHERE q.organization_id IN (
      SELECT organization_id
      FROM organization_users
      WHERE user_id = auth.uid() 
      AND enhanced_role IN ('admin', 'owner', 'manager') 
      AND status = 'active'
    )
  )
)
WITH CHECK (
  question_id IN (
    SELECT q.id
    FROM questions q
    WHERE q.organization_id IN (
      SELECT organization_id
      FROM organization_users
      WHERE user_id = auth.uid() 
      AND enhanced_role IN ('admin', 'owner', 'manager') 
      AND status = 'active'
    )
  )
);

-- Update admin_audit_log policy
DROP POLICY IF EXISTS "Organization admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Organization admins can view audit logs" ON public.admin_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM organization_users
    WHERE user_id = auth.uid() 
    AND organization_id = admin_audit_log.organization_id 
    AND enhanced_role IN ('admin', 'owner') 
    AND status = 'active'
  )
);

-- Update user_invitations policy
DROP POLICY IF EXISTS "Org admins can manage invitations for their org" ON public.user_invitations;
CREATE POLICY "Org admins can manage invitations for their org" ON public.user_invitations
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM organization_users
    WHERE user_id = auth.uid() 
    AND organization_id = user_invitations.organization_id 
    AND enhanced_role IN ('admin', 'owner', 'manager') 
    AND status = 'active'
  )
);

-- Update invitation_events policy
DROP POLICY IF EXISTS "Org admins can view invitation events" ON public.invitation_events;
CREATE POLICY "Org admins can view invitation events" ON public.invitation_events
FOR SELECT
USING (
  invitation_id IN (
    SELECT user_invitations.id
    FROM user_invitations
    WHERE user_invitations.organization_id IN (
      SELECT organization_id
      FROM organization_users
      WHERE user_id = auth.uid() 
      AND enhanced_role IN ('admin', 'owner', 'manager') 
      AND status = 'active'
    )
  )
);

-- Update database functions to use enhanced_role
CREATE OR REPLACE FUNCTION public.is_current_user_org_admin(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = auth.uid() 
    AND organization_id = org_id 
    AND enhanced_role IN ('admin', 'owner')
    AND status = 'active'
  );
$$;

-- Update invite_user_to_organization function
CREATE OR REPLACE FUNCTION public.invite_user_to_organization(p_email text, p_organization_id uuid, p_role text DEFAULT 'member'::text, p_enhanced_role enhanced_org_role DEFAULT 'member'::enhanced_org_role)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_id UUID;
  v_existing_user_id UUID;
  v_inviter_id UUID := auth.uid();
BEGIN
  -- Check if current user is org admin (using enhanced_role)
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = v_inviter_id 
    AND organization_id = p_organization_id 
    AND enhanced_role IN ('admin', 'owner', 'manager')
    AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be an organization admin to invite users');
  END IF;

  -- Check if user already exists in auth.users
  SELECT id INTO v_existing_user_id 
  FROM auth.users 
  WHERE email = p_email;

  -- If user exists and is already in the organization
  IF v_existing_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = v_existing_user_id 
    AND organization_id = p_organization_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'User is already a member of this organization');
  END IF;

  -- Check if there's already a pending invitation
  IF EXISTS (
    SELECT 1 FROM public.user_invitations 
    WHERE email = p_email 
    AND organization_id = p_organization_id 
    AND status = 'pending'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'An invitation is already pending for this email');
  END IF;

  -- If user exists in auth but not in org, add them directly
  IF v_existing_user_id IS NOT NULL THEN
    INSERT INTO public.organization_users (
      user_id, 
      organization_id, 
      email, 
      role, 
      enhanced_role,
      invited_by_user_id,
      accepted_at,
      status
    ) VALUES (
      v_existing_user_id,
      p_organization_id,
      p_email,
      CASE WHEN p_enhanced_role IN ('owner', 'admin') THEN 'admin' ELSE 'member' END,
      p_enhanced_role,
      v_inviter_id,
      now(),
      'active'
    );
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'User added to organization successfully',
      'type', 'direct_add'
    );
  ELSE
    -- Create invitation for new user
    INSERT INTO public.user_invitations (
      email,
      organization_id,
      role,
      enhanced_role,
      invited_by_user_id
    ) VALUES (
      p_email,
      p_organization_id,
      CASE WHEN p_enhanced_role IN ('owner', 'admin') THEN 'admin' ELSE 'member' END,
      p_enhanced_role,
      v_inviter_id
    ) RETURNING id INTO v_invitation_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Invitation sent successfully',
      'invitation_id', v_invitation_id,
      'type', 'invitation'
    );
  END IF;
END;
$$;

-- Update remove_user_from_organization function
CREATE OR REPLACE FUNCTION public.remove_user_from_organization(p_user_id uuid, p_organization_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is org admin (using enhanced_role)
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = auth.uid() 
    AND organization_id = p_organization_id 
    AND enhanced_role IN ('admin', 'owner')
    AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be an organization admin to remove users');
  END IF;
  
  -- Prevent removing yourself
  IF auth.uid() = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'You cannot remove yourself from the organization');
  END IF;
  
  -- Remove user from organization
  DELETE FROM public.organization_users 
  WHERE user_id = p_user_id AND organization_id = p_organization_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User is not a member of this organization');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'User removed from organization successfully');
END;
$$;

-- Update cancel_invitation function
CREATE OR REPLACE FUNCTION public.cancel_invitation(p_invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_record public.user_invitations;
BEGIN
  -- Get the invitation
  SELECT * INTO v_invitation_record
  FROM public.user_invitations
  WHERE id = p_invitation_id;
  
  IF v_invitation_record.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation not found');
  END IF;
  
  -- Check if current user is org admin for this invitation's organization (using enhanced_role)
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = auth.uid() 
    AND organization_id = v_invitation_record.organization_id 
    AND enhanced_role IN ('admin', 'owner', 'manager')
    AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be an organization admin to cancel invitations');
  END IF;
  
  -- Update invitation status
  UPDATE public.user_invitations 
  SET status = 'cancelled', updated_at = now()
  WHERE id = p_invitation_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Invitation cancelled successfully');
END;
$$;
