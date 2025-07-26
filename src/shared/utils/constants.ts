
export const APP_NAME = 'Feedback Platform';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  FEEDBACK: '/feedback',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const QUERY_KEYS = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  FEEDBACK: 'feedback',
  ANALYTICS: 'analytics',
} as const;
