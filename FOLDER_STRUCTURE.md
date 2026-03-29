# Project Folder Structure Guide

## Server Structure (`server/src/`)

### `config/`
Configuration files and constants.
- `constants.ts` - Application-wide constants (error messages, file paths, prefixes)
- `index.ts` - Config exports

### `constants/`
Specific constants organized by domain.
- `timeouts.ts` - Timeout values for async operations

### `types/`
TypeScript interfaces and type definitions.
- `post.types.ts` - Post-related types (NormalizedPost, NormalizedVideo, NormalizedPicture)
- `file.types.ts` - File upload types (FileRecord, UploadedPictureData, UploadedVideoData)
- `index.ts` - Type exports

### `utils/`
Utility functions and helpers.
- `media.utils.ts` - Media handling utilities (normalizeMediaUrl, withTimeout)
- `index.ts` - Utility exports

### `errors/`
Custom error classes for better error handling.
- `AppError.ts` - Base error class and domain-specific errors (ValidationError, NotFoundError, UnauthorizedError)

### `controllers/`
Request handlers for API endpoints.
- `admin.controller.ts` - Admin post management endpoints
- `auth.controller.ts` - Authentication endpoints
- `public.controller.ts` - Public post endpoints

### `services/`
Business logic and external service integrations.
- `dropbox.service.ts` - Dropbox API integration
- `auth.service.ts` - Authentication logic

### `routes/`
API route definitions.
- `admin.routes.ts` - Admin routes
- `auth.routes.ts` - Auth routes
- `public.routes.ts` - Public routes

### `middlewares/`
Express middleware functions.
- `auth.middleware.ts` - Authentication verification

### `lib/`
Library setup and initialization.
- `db.ts` - Prisma client initialization
- `generateToken.ts` - JWT token generation

### Root Files
- `index.ts` - Application entry point
- `seed.ts` - Database seeding script
- `verify-admin.ts` - Admin verification utility

---

## Client Structure (`client/src/`)

### `types/`
TypeScript type definitions organized by domain.
- `post.ts` - Post-related types
- `auth.ts` - Authentication types
- `profile.ts` - User profile types
- `api/` - API response/request types

### `components/`
Reusable React components.
- `common/` - Widely-used UI components
- `ui/` - shadcn/ui components (button, card, dialog, etc.)
- `gallery/` - Gallery-specific components
- `media/` - Media display components
- `protectedRoute/` - Route protection components

### `features/`
Feature-specific components and logic.
- `admin/` - Admin panel feature
- `RageOfTheDay/` - Featured post display feature
  - `subcomponents/` - Feature-specific UI components

### `pages/`
Page-level components for routing.
- `HomePage.tsx`
- `LoginPage.tsx`
- `AdminPage.tsx`
- `admin/` - Admin sub-routes

### `hooks/`
Custom React hooks organized by type.
- `common/` - General-purpose hooks
- `api/` - Data fetching hooks
- `auth/` - Authentication hooks
- `featuredPost/` - Featured post hooks

### `services/`
API integration and external services.
- `admin.service.ts` - Admin API calls
- `auth.service.ts` - Auth API calls
- `public.service.ts` - Public API calls

### `lib/`
Library setup and utilities.
- `axios.ts` - Axios instance configuration
- `utils.ts` - General utilities

### `contexts/`
React Context providers.
- `AuthContext.tsx` - Authentication context
- `AuthContext.context.ts` - Auth context types

### `constants/`
Application constants.
- `rage-of-the-day.constants.ts` - Featured post constants

### `utils/`
Utility functions.
- `rage-of-the-day.utils.ts` - Utility functions

### `assets/`
Static assets (images, icons, etc.)

### Root Files
- `main.tsx` - Application entry point
- `App.tsx` - Root component
- `index.css` - Global styles

---

## Best Practices Applied

### Server
✅ **Separation of Concerns** - Types, utilities, and constants separate from logic  
✅ **DRY Principle** - Extracted repeated code into utilities  
✅ **Error Handling** - Custom error classes for better error management  
✅ **Constants Management** - Centralized configuration and error messages  
✅ **Type Safety** - Strong TypeScript interfaces throughout  

### Client
✅ **Feature-Based Organization** - Components grouped by feature  
✅ **Layered Architecture** - Services, hooks, components separated by responsibility  
✅ **Reusability** - Common components and hooks in dedicated folders  
✅ **Type Safety** - API types separate from domain types  
✅ **Scalability** - Easy to add new features without clutter  

---

## Key Improvements

1. **Type Definitions** - All interfaces organized in `types/` folder with clear exports
2. **Constants** - Error messages, timeouts, and paths centralized for easy maintenance
3. **Utility Functions** - Reusable helpers extracted for better code reuse
4. **Error Classes** - Custom error hierarchy for better error handling
5. **Code Organization** - Clear separation between logic, presentation, and configuration
6. **Maintainability** - Easier to locate, update, and test code
7. **Scalability** - Structure supports growth without becoming unwieldy
