
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastCheck: string;
  issues?: string[];
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  lastActive: string;
  organizationCount: number;
}
