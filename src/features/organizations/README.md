
# Organizations Feature

## Overview
Manages organization data, settings, user management, and organization-level configuration.

## Key Components
- `OrganizationService`: CRUD operations for organizations
- `useOrganization`: Hook for accessing current organization
- Organization settings and user management components

## Usage
```typescript
import { useOrganization, OrganizationService } from '@/features/organizations';

const { organization, updateOrganization } = useOrganization();
```

## Responsibilities
- Organization CRUD operations
- User management within organizations
- Organization settings and configuration
- Billing and subscription management
- Organization assets (logos, themes)
