# UI Libraries & Tools Setup Guide

## Overview
This guide documents the UI libraries and tools configured for the Ann Pale platform frontend.

## Installed Libraries

### Core UI Components
- **shadcn/ui**: Primary component library (already configured)
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Zustand**: Lightweight state management (`lib/stores/useAppStore.ts`)
- **React Query (TanStack Query)**: Server state management (`lib/providers/query-provider.tsx`)

### Animation & Motion
- **Framer Motion**: Production-ready animations (`lib/animations/variants.ts`)
- **tailwindcss-animate**: CSS animation utilities

### Data Fetching
- **SWR**: Data fetching with caching
- **Axios**: HTTP client
- **Supabase Client**: Backend integration (`lib/supabase/`)

### Forms & Validation
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **@hookform/resolvers**: Integration between RHF and Zod

### Data Visualization
- **Recharts**: Charting library
- **@tremor/react**: Dashboard components

### Development Tools
- **Storybook**: Component documentation (`.storybook/`)
- **Jest**: Testing framework (`jest.config.js`)
- **Testing Library**: React testing utilities
- **Prettier**: Code formatting (`.prettierrc.json`)
- **ESLint**: Code linting (`.eslintrc.json`)

## Getting Started

### Installation
```bash
cd homepage
pnpm install
```

### Development Commands
```bash
# Start development server
pnpm dev

# Run Storybook
pnpm storybook

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check types
pnpm typecheck

# Format code
pnpm format

# Lint code
pnpm lint
```

## Usage Examples

### 1. Using Framer Motion
```tsx
import { motion } from 'framer-motion'
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations/variants'

function AnimatedPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={staggerContainer}>
        {items.map(item => (
          <motion.div key={item.id} variants={staggerItem}>
            {item.content}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
```

### 2. Using Zustand Store
```tsx
import { useAppStore } from '@/lib/stores/useAppStore'

function Component() {
  const { user, setUser, theme, setTheme } = useAppStore()
  
  // Use the store state and actions
  return <div>Welcome {user?.name}</div>
}
```

### 3. Using React Query
```tsx
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

function CreatorsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('creators')
        .select('*')
      if (error) throw error
      return data
    },
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading creators</div>
  
  return <div>{/* Render creators */}</div>
}
```

### 4. Using Custom Hooks
```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/use-media-query'

function ResponsiveComponent() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  
  if (isMobile) return <MobileView />
  if (isTablet) return <TabletView />
  return <DesktopView />
}
```

## Project Structure
```
homepage/
├── .storybook/          # Storybook configuration
├── app/                 # Next.js app directory
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── animations/     # Framer Motion variants
│   ├── providers/      # React providers
│   ├── stores/         # Zustand stores
│   └── supabase/       # Supabase clients
├── public/             # Static assets
└── styles/             # Global styles
```

## Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

## Testing
- Unit tests are configured with Jest and Testing Library
- Write tests alongside components with `.test.tsx` extension
- Run `pnpm test` to execute tests

## Storybook
- Component stories are in `.stories.tsx` files
- Run `pnpm storybook` to view component documentation
- Stories are automatically generated from components in `components/` and `app/`

## Best Practices
1. Use shadcn/ui components as the primary choice
2. Implement animations with Framer Motion for complex interactions
3. Manage global state with Zustand
4. Handle server state with React Query
5. Write tests for critical components
6. Document components with Storybook stories
7. Follow the established design system (Phase 0)

## Troubleshooting
- If styles are not loading, ensure `globals.css` is imported in your layout
- For Storybook issues, delete `.storybook/` cache and rebuild
- For TypeScript errors, run `pnpm typecheck` to identify issues
- For test failures, check Jest configuration and setup files

## Next Steps
1. Install dependencies: `pnpm install`
2. Set up environment variables
3. Start development server: `pnpm dev`
4. Open Storybook: `pnpm storybook`
5. Begin implementing components following the design system