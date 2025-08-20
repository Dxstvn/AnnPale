# Common Components

This directory contains reusable components that are shared across multiple pages and features of the Ann Pale platform.

## Structure

```
/components/common/
├── layout/          # Layout components (Header, Footer, Sidebar)
├── navigation/      # Navigation components (NavBar, Breadcrumbs)
├── feedback/        # User feedback (Loading, Error, Empty states)
├── media/          # Media components (VideoPlayer, ImageGallery)
└── forms/          # Complex form components
```

## Component Guidelines

### When to Add a Component Here

A component belongs in `/components/common/` when:
- It's used in 3 or more different pages
- It contains business logic specific to Ann Pale
- It composes multiple UI components from `/components/ui/`
- It needs to support all three languages (en, fr, ht)

### Component Requirements

All common components must:
1. Be fully responsive (mobile-first)
2. Support dark mode
3. Be accessible (WCAG 2.1 AA)
4. Include TypeScript types
5. Handle loading and error states
6. Support internationalization

### Example Component Structure

```tsx
// components/common/CreatorCard.tsx
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'

interface CreatorCardProps {
  creator: Creator
  featured?: boolean
  onBook?: () => void
}

export function CreatorCard({ creator, featured, onBook }: CreatorCardProps) {
  const { t } = useTranslation()
  
  return (
    <Card variant={featured ? 'gradient' : 'interactive'}>
      {/* Component implementation */}
    </Card>
  )
}
```

## Available Common Components

### Layout Components
- `AppLayout` - Main application layout wrapper
- `DashboardLayout` - Creator dashboard layout
- `AuthLayout` - Authentication pages layout

### Navigation Components
- `AppHeader` - Main application header
- `AppFooter` - Main application footer
- `Breadcrumbs` - Page navigation breadcrumbs
- `MobileNav` - Mobile navigation drawer

### Feedback Components
- `LoadingSpinner` - Consistent loading indicator
- `ErrorBoundary` - Error handling wrapper
- `EmptyState` - Empty data states
- `SuccessMessage` - Success feedback

### Media Components
- `VideoPlayer` - Custom video player
- `VideoThumbnail` - Video preview card
- `ImageUpload` - Image upload with preview
- `AvatarUpload` - Profile picture upload

### Form Components
- `SearchBar` - Global search component
- `PriceInput` - Currency formatted input
- `DateTimePicker` - Date and time selection
- `PhoneInput` - International phone input