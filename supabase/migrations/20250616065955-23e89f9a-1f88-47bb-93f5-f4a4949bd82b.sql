
-- Create a function to invite users to an organization
CREATE OR REPLACE FUNCTION public.invite_user_to_organization(
  p_email TEXT,
  p_organization_id UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_id UUID;
  v_existing_user_id UUID;
  v_inviter_id UUID := auth.uid();
BEGIN
  -- Check if current user is org admin
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = v_inviter_id 
    AND organization_id = p_organization_id 
    AND role = 'admin'
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
      invited_by_user_id,
      accepted_at
    ) VALUES (
      v_existing_user_id,
      p_organization_id,
      p_email,
      p_role,
      v_inviter_id,
      now()
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
      invited_by_user_id
    ) VALUES (
      p_email,
      p_organization_id,
      p_role,
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

-- Create a function to cancel invitations
CREATE OR REPLACE FUNCTION public.cancel_invitation(p_invitation_id UUID)
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
  
  -- Check if current user is org admin for this invitation's organization
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = auth.uid() 
    AND organization_id = v_invitation_record.organization_id 
    AND role = 'admin'
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

-- Create a function to remove users from organization
CREATE OR REPLACE FUNCTION public.remove_user_from_organization(
  p_user_id UUID,
  p_organization_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is org admin
  IF NOT EXISTS (
    SELECT 1 FROM public.organization_users 
    WHERE user_id = auth.uid() 
    AND organization_id = p_organization_id 
    AND role = 'admin'
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
