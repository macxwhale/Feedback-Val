
# Coding Standards

This document outlines the coding standards and conventions used throughout the application.

## TypeScript Guidelines

### Strict Type Checking
- Always use strict TypeScript settings
- Prefer interfaces for object shapes
- Always specify return types for functions
- Avoid `any` - use proper types instead

```typescript
// Good
interface UserData {
  id: string;
  name: string;
  email: string;
}

function fetchUser(id: string): Promise<UserData> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// Bad
function fetchUser(id: any): any {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
```

## React Guidelines

### Component Structure
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Always define props interfaces
- Implement error boundaries for robust UX

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Hooks Guidelines
- Custom hooks should start with `use`
- Extract complex logic into custom hooks
- Use proper dependency arrays for useEffect
- Memoize expensive computations

## Naming Conventions

### Files and Directories
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` (prefixed with `use`)
- Services: `camelCase.ts`
- Types: `camelCase.ts`
- Utils: `camelCase.ts`

### Variables and Functions
- Variables: `camelCase`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### Components
- Component names: `PascalCase`
- Props interfaces: `ComponentNameProps`
- Event handlers: `handle` prefix (e.g., `handleClick`)

## CSS/Styling Guidelines

### Tailwind First
- Use Tailwind CSS for styling
- Use semantic tokens from design system
- Avoid hardcoded colors - use CSS variables
- Component variants using class variance authority

```typescript
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground"
    },
    size: {
      sm: "px-3 py-1 text-sm",
      lg: "px-6 py-3 text-lg"
    }
  }
});
```

### Responsive Design
- Mobile-first approach
- Use Tailwind responsive prefixes
- Test on multiple screen sizes
- Consider touch targets for mobile

### Accessibility
- Include focus states and ARIA labels
- Use semantic HTML elements
- Maintain proper color contrast ratios
- Ensure keyboard navigation works

## Performance Guidelines

### React Performance
- Use React.memo for expensive components
- Memoize expensive computations with useMemo
- Use useCallback for event handlers in memoized components
- Implement code splitting for large components

### Bundle Optimization
- Import only what you need (tree shaking)
- Use dynamic imports for large dependencies
- Optimize images and use modern formats

## Error Handling

### Component Error Boundaries
- Implement error boundaries for graceful failures
- Show helpful error messages to users
- Log errors for debugging and monitoring
- Provide fallback UI for error states

### Async Error Handling
- Use proper error handling in async functions
- Don't catch errors unless you can handle them meaningfully
- Let errors bubble up to error boundaries when appropriate

## Security Guidelines

### Input Validation
- Always validate user inputs
- Use proper escaping for dynamic content
- Implement proper authentication flows
- Check permissions before sensitive operations

## Testing Guidelines

### Test Structure
- Use Arrange-Act-Assert pattern
- Test behavior, not implementation
- Use descriptive test names
- Mock external dependencies

### Component Testing
- Test user interactions
- Verify rendered output
- Test accessibility features
- Test error states

## Git Workflow

### Commit Messages
Follow Conventional Commits:
```
type(scope): description

feat(auth): add OAuth login support
fix(ui): resolve button alignment issue
docs(api): update service documentation
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Individual features
- `hotfix/*` - Emergency fixes
