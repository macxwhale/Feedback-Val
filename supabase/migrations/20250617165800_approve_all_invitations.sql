
-- Function to approve all pending invitations where users already exist
CREATE OR REPLACE FUNCTION public.approve_all_pending_invitations()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record public.user_invitations;
  user_record auth.users;
  approved_count INTEGER := 0;
  failed_count INTEGER := 0;
  result jsonb;
BEGIN
  -- Check if current user is super admin
  IF NOT get_current_user_admin_status() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only super admins can approve all invitations');
  END IF;

  -- Loop through all pending invitations
  FOR invitation_record IN 
    SELECT * FROM public.user_invitations 
    WHERE status = 'pending' AND expires_at > now()
  LOOP
    -- Check if user exists in auth.users
    SELECT * INTO user_record 
    FROM auth.users 
    WHERE email = invitation_record.email;
    
    IF FOUND THEN
      -- Check if user is not already in the organization
      IF NOT EXISTS (
        SELECT 1 FROM public.organization_users 
        WHERE user_id = user_record.id 
        AND organization_id = invitation_record.organization_id
      ) THEN
        BEGIN
          -- Add user to organization
          INSERT INTO public.organization_users (
            user_id, 
            organization_id, 
            email, 
            role, 
            invited_by_user_id,
            accepted_at
          ) VALUES (
            user_record.id,
            invitation_record.organization_id,
            invitation_record.email,
            invitation_record.role,
            invitation_record.invited_by_user_id,
            now()
          );
          
          -- Update invitation status
          UPDATE public.user_invitations 
          SET status = 'accepted', updated_at = now()
          WHERE id = invitation_record.id;
          
          approved_count := approved_count + 1;
        EXCEPTION WHEN OTHERS THEN
          failed_count := failed_count + 1;
        END;
      ELSE
        -- User already in org, mark invitation as accepted
        UPDATE public.user_invitations 
        SET status = 'accepted', updated_at = now()
        WHERE id = invitation_record.id;
        
        approved_count := approved_count + 1;
      END IF;
    ELSE
      failed_count := failed_count + 1;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true, 
    'approvedCount', approved_count,
    'failedCount', failed_count
  );
END;
$$;
