
import { useContext } from 'react';
import { AuthContext } from '@/components/auth/AuthWrapper';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthWrapper');
  }
  return context;
};
