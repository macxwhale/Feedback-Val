
-- Phase 3.1: Enhance Database Schema for Invitation Token System
-- Add unique invitation URLs with secure tokens and more granular status tracking

-- First, add new columns to user_invitations table
ALTER TABLE public.user_invitations 
ADD COLUMN IF NOT EXISTS invitation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS resend_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_resent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Update status enum to include more granular statuses
-- Note: We'll handle this with check constraints instead of enum to avoid migration issues
ALTER TABLE public.user_invitations 
DROP CONSTRAINT IF EXISTS user_invitations_status_check;

ALTER TABLE public.user_invitations 
ADD CONSTRAINT user_invitations_status_check 
CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'accepted', 'expired', 'cancelled', 'failed', 'resent'));

-- Create invitation_events table for comprehensive audit trail
CREATE TABLE IF NOT EXISTS public.invitation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.user_invitations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'sent', 'delivered', 'opened', 'clicked', 'accepted', 'expired', 'cancelled', 'failed', 'resent')),
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on invitation_events
ALTER TABLE public.invitation_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for invitation_events
CREATE POLICY "Org admins can view invitation events" ON public.invitation_events
FOR SELECT TO authenticated
USING (
  invitation_id IN (
    SELECT id FROM public.user_invitations 
    WHERE organization_id IN (
      SELECT organization_id FROM public.organization_users 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON public.user_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_invitation_events_invitation_id ON public.invitation_events(invitation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_events_created_at ON public.invitation_events(created_at);

-- Create function to log invitation events
CREATE OR REPLACE FUNCTION public.log_invitation_event(
  p_invitation_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.invitation_events (
    invitation_id, event_type, event_data, ip_address, user_agent
  ) VALUES (
    p_invitation_id, p_event_type, p_event_data, p_ip_address, p_user_agent
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create function to validate invitation tokens
CREATE OR REPLACE FUNCTION public.validate_invitation_token(p_token UUID)
RETURNS TABLE(
  invitation_id UUID,
  email TEXT,
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  role TEXT,
  enhanced_role enhanced_org_role,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_valid BOOLEAN,
  error_message TEXT
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT 
    ui.id,
    ui.email,
    ui.organization_id,
    ui.role,
    ui.enhanced_role,
    ui.expires_at,
    ui.status,
    o.name as org_name,
    o.slug as org_slug
  INTO invitation_record
  FROM public.user_invitations ui
  JOIN public.organizations o ON o.id = ui.organization_id
  WHERE ui.invitation_token = p_token;
  
  -- Check if invitation exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, NULL::TEXT, 
      NULL::TEXT, NULL::enhanced_org_role, NULL::TIMESTAMP WITH TIME ZONE,
      FALSE, 'Invalid invitation token';
    RETURN;
  END IF;
  
  -- Check if invitation has expired
  IF invitation_record.expires_at < now() THEN
    RETURN QUERY SELECT 
      invitation_record.id, invitation_record.email, invitation_record.organization_id,
      invitation_record.org_name, invitation_record.org_slug,
      invitation_record.role, invitation_record.enhanced_role, invitation_record.expires_at,
      FALSE, 'Invitation has expired';
    RETURN;
  END IF;
  
  -- Check if invitation is in valid status
  IF invitation_record.status NOT IN ('pending', 'sent', 'delivered', 'opened', 'resent') THEN
    RETURN QUERY SELECT 
      invitation_record.id, invitation_record.email, invitation_record.organization_id,
      invitation_record.org_name, invitation_record.org_slug,
      invitation_record.role, invitation_record.enhanced_role, invitation_record.expires_at,
      FALSE, 'Invitation is no longer valid';
    RETURN;
  END IF;
  
  -- Invitation is valid
  RETURN QUERY SELECT 
    invitation_record.id, invitation_record.email, invitation_record.organization_id,
    invitation_record.org_name, invitation_record.org_slug,
    invitation_record.role, invitation_record.enhanced_role, invitation_record.expires_at,
    TRUE, NULL::TEXT;
END;
$$;
