
# Feedback Platform

## Feature-Based Architecture

This application is organized around features rather than technical layers, making it easier to navigate and maintain.

### Features

- **[Auth](src/features/auth/)** - User authentication and session management
- **[Organizations](src/features/organizations/)** - Organization management and settings
- **[Feedback](src/features/feedback/)** - Feedback collection and management
- **[Admin](src/features/admin/)** - System administration and monitoring
- **[Analytics](src/features/analytics/)** - Data analytics and reporting

### Shared Resources

- **[Components](src/shared/components/)** - Reusable UI components
- **[Hooks](src/shared/hooks/)** - Common React hooks
- **[Utils](src/shared/utils/)** - Utility functions and constants
- **[Types](src/shared/types/)** - Shared TypeScript definitions

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Navigate to a specific feature folder to understand its functionality

## Development Guidelines

- Each feature is self-contained with its own services, hooks, and types
- Use barrel exports (`index.ts`) for clean imports
- Keep components small and focused
- Follow the established patterns in each feature
