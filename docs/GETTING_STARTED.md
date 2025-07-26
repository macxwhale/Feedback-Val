
# Getting Started

Welcome to the development team! This guide will help you quickly get up and running with the project.

## Prerequisites

- Node.js 18+ and npm/yarn
- Basic knowledge of React, TypeScript, and Tailwind CSS
- Familiarity with Supabase for backend operations

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Environment

- **IDE**: VS Code recommended with extensions:
  - TypeScript Hero
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag

## Project Structure Overview

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   └── common/         # Shared components
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── infrastructure/     # Infrastructure layer
├── domain/            # Domain interfaces and types
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

## First Steps

1. **Explore the codebase**: Start with `src/components/` to understand the component structure
2. **Review the architecture**: Check `docs/ARCHITECTURE.md` for detailed architectural decisions
3. **Understand the coding standards**: See `docs/CODING_STANDARDS.md` for our conventions
4. **Set up your first feature**: Follow the patterns in existing components

## Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Getting Help

- **Team Chat**: Use team Slack/Discord for quick questions
- **Documentation**: Check documentation before asking questions
- **Code Reviews**: Request code reviews for complex changes
