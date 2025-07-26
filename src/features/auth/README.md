
# Authentication Feature

## Overview
Handles user authentication, registration, password management, and session management.

## Key Components
- `AuthService`: Core authentication logic
- `useAuth`: Hook for accessing auth state
- Authentication forms and guards

## Usage
```typescript
import { useAuth, AuthService } from '@/features/auth';

const { user, isAuthenticated, login, logout } = useAuth();
```

## Responsibilities
- User login/logout
- Registration and email verification
- Password reset functionality
- Session management
- Authentication guards for protected routes
