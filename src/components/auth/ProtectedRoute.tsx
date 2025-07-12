
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthWrapper';
import { useRBAC } from '@/hooks/useRBAC';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireOrgAdmin?: boolean;
  requiredPermission?: string;
  organizationId?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireOrgAdmin = false,
  requiredPermission,
  organizationId
}) => {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const { user, isAdmin, isOrgAdmin, loading, currentOrganization } = useAuth();
  const { hasPermission, isLoading: rbacLoading } = useRBAC(organizationId || currentOrganization);

  // Use effect to delay showing access denied to prevent flashing
  useEffect(() => {
    if (!loading && !rbacLoading) {
      // Check basic authentication
      if (!user) {
        return;
      }

      // Check admin requirements
      if (requireAdmin && !isAdmin) {
        const timer = setTimeout(() => setShowAccessDenied(true), 100);
        return () => clearTimeout(timer);
      }

      // Check org admin requirements
      if (requireOrgAdmin && !isOrgAdmin && !isAdmin) {
        const timer = setTimeout(() => setShowAccessDenied(true), 100);
        return () => clearTimeout(timer);
      }

      // Check specific permission requirements
      if (requiredPermission && !hasPermission(requiredPermission) && !isAdmin) {
        const timer = setTimeout(() => setShowAccessDenied(true), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, rbacLoading, user, isAdmin, isOrgAdmin, requireAdmin, requireOrgAdmin, requiredPermission, hasPermission]);

  if (loading || rbacLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    if (showAccessDenied) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (requireOrgAdmin && !isOrgAdmin && !isAdmin) {
    if (showAccessDenied) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission) && !isAdmin) {
    if (showAccessDenied) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
