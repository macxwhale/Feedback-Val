
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';

interface SecurityEvent {
  eventType: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
  eventData?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  const logSecurityEvent = useMutation({
    mutationFn: async (event: SecurityEvent) => {
      const { data, error } = await supabase.rpc('log_security_event', {
        p_event_type: event.eventType,
        p_user_id: user?.id || null,
        p_organization_id: event.organizationId || null,
        p_ip_address: event.ipAddress || null,
        p_user_agent: event.userAgent || navigator.userAgent,
        p_event_data: event.eventData || {},
        p_severity: event.severity || 'medium'
      });

      if (error) throw error;
      return data;
    }
  });

  const logFailedLogin = (email: string, reason: string) => {
    logSecurityEvent.mutate({
      eventType: 'failed_login',
      eventData: { email, reason, timestamp: new Date().toISOString() },
      severity: 'medium'
    });
  };

  const logSuccessfulLogin = (email: string) => {
    logSecurityEvent.mutate({
      eventType: 'successful_login',
      eventData: { email, timestamp: new Date().toISOString() },
      severity: 'low'
    });
  };

  const logPasswordChange = (organizationId?: string) => {
    logSecurityEvent.mutate({
      eventType: 'password_change',
      organizationId,
      eventData: { timestamp: new Date().toISOString() },
      severity: 'medium'
    });
  };

  const logSuspiciousActivity = (activity: string, organizationId?: string) => {
    logSecurityEvent.mutate({
      eventType: 'suspicious_activity',
      organizationId,
      eventData: { activity, timestamp: new Date().toISOString() },
      severity: 'high'
    });
  };

  const logPermissionDenied = (resource: string, organizationId?: string) => {
    logSecurityEvent.mutate({
      eventType: 'permission_denied',
      organizationId,
      eventData: { resource, timestamp: new Date().toISOString() },
      severity: 'medium'
    });
  };

  const logDataAccess = (resource: string, organizationId?: string) => {
    logSecurityEvent.mutate({
      eventType: 'data_access',
      organizationId,
      eventData: { resource, timestamp: new Date().toISOString() },
      severity: 'low'
    });
  };

  return {
    logSecurityEvent: logSecurityEvent.mutate,
    logFailedLogin,
    logSuccessfulLogin,
    logPasswordChange,
    logSuspiciousActivity,
    logPermissionDenied,
    logDataAccess,
    isLogging: logSecurityEvent.isPending
  };
};
