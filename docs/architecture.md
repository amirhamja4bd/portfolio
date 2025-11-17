# Architecture Overview

## Stack Summary

- **Framework**: Next.js 16 App Router with TypeScript
- **Styling/UI**: Tailwind CSS (v4), shadcn/ui primitives, Framer Motion animations
- **State & Data**: Server Components for public site, TanStack Query + React Hook Form in admin dashboard
- **Auth**: Custom email/password flow with bcrypt-hashed credentials and JWT session cookies via `jose`
- **Database**: MongoDB via Mongoose models
- **Content Editing**: Editor.js with custom uploader tools for images and tables
- **Storage**: Local `public/uploads` in development; abstracted storage adapter ready for S3/Vercel Blob

## Data Domain

### User (Admin)

- `email`: string (unique)
- `passwordHash`: string
- `name`: string
- Used for dashboard authentication and personalization.

### Profile

- `name`: string
- `title`: string
- `bio`: string (markdown-lite)
- `summary`: string
- `location`: string
- `yearsOfExperience`: number
- `resumeUrl`: string
- `heroImage`: string (URL to asset)
- `socialLinks`: array of `{ label, url, icon }`
- `highlights`: array of short bullet strings

### Skills

- `category`: enum (`frontend`, `backend`, `database`, `tools`, `devops`, etc.)
- `name`: string
- `icon`: string (Lucide icon key)
- `proficiency`: number (0-100)
- `description`: string

### Projects

- `title`: string
- `slug`: string (unique)
- `summary`: string
- `description`: Editor.js JSON payload
- `technologies`: array of strings
- `githubUrl`, `demoUrl`: optional strings
- `images`: array of `{ url, alt }`
- `featured`: boolean
- `category`: string
- `timeline`: `{ start: Date, end?: Date }`

### Experience

- `company`: string
- `role`: string
- `location`: string
- `startDate`, `endDate?`: Date
- `achievements`: string[]
- `technologies`: string[]
- `logo`: string (asset URL)

### Blog Posts

- `title`: string
- `slug`: string
- `excerpt`: string
- `content`: Editor.js JSON payload
- `coverImage`: string
- `tags`: string[]
- `readingTime`: number (minutes)
- `publishedAt`: Date
- `status`: enum (`draft`, `published`)

### Contact Submissions

- `name`: string
- `email`: string
- `message`: string
- `createdAt`: Date
- `status`: enum (`new`, `handled`)
- `source`: string (`portfolio-form`, `calendar`, etc.)

### Analytics Snapshot

Derived from data endpoints:

- Total visits (placeholder chart from analytics provider or stub)
- Counts of blog posts, projects, skills, contact submissions

## Services & Utilities

- `lib/mongodb.ts`: Lazy Mongo connection cache
- `lib/auth.ts`: Password hashing, JWT signing/verification, cookie helpers
- `lib/storage.ts`: Storage adapter (local FS + extension hooks)
- `lib/editor.ts`: Editor.js tool configuration and serializers
- `lib/validators.ts`: Zod schemas for API validation
- `lib/queries.ts`: Shared queries for server components

## API Routes (App Router Route Handlers)

```
app/api/auth/login           POST    -> authenticate admin, set session cookie
app/api/auth/logout          POST    -> clear session cookie
app/api/profile              GET     -> public profile data
                            PUT     -> update profile (admin)
app/api/skills               GET     -> list skills
                            POST    -> create skill
app/api/skills/[id]          PUT     -> update skill
                            DELETE  -> delete skill
app/api/projects             GET/POST
app/api/projects/[id]        GET/PUT/DELETE
app/api/posts                GET/POST
app/api/posts/[slug]         GET/PUT/DELETE
app/api/experience           GET/POST
app/api/experience/[id]      PUT/DELETE
app/api/contact              POST    -> submit message (public)
                            GET     -> list submissions (admin)
app/api/contact/[id]         PATCH   -> update status
app/api/uploads              POST    -> image/file upload endpoint for Editor.js
app/api/analytics            GET     -> aggregated stats for dashboard cards
```

Authorization middleware will guard admin routes by verifying JWT cookie.

## Routing Structure

```
app/
  layout.tsx                // Theme providers, animations, nav
  page.tsx                  // Public portfolio landing page (server component)
  blog/
    page.tsx                // Blog index
    [slug]/page.tsx         // Individual article renderer
  projects/
    page.tsx                // Project grid with filters
    [slug]/page.tsx         // Case study page
  api/...
  (admin)/
    layout.tsx              // Auth guard + dashboard shell
    login/page.tsx          // Admin login form (client)
    dashboard/page.tsx      // Overview cards
    posts/page.tsx
    posts/[id]/edit/page.tsx
    projects/page.tsx
    skills/page.tsx
    experience/page.tsx
    profile/page.tsx
    contact/page.tsx
```

## Theming & Animation

- `providers/theme-provider.tsx` wraps `ThemeProvider` from `next-themes`
- Background animation built with `framer-motion` and `three`-less blob animation using SVG filters
- Section entrance animations via `viewport` `whileInView`
- Cursor-following highlight and parallax on hero graphics

## State Management

- Public pages rely on server-side data fetching via async server components.
- Admin uses TanStack Query with fetch wrappers hitting API routes; mutations invalidate caches.
- React Hook Form + Zod resolvers for form validation.

## Authentication Flow

1. Admin submits credentials to `/api/auth/login`.
2. Credentials verified, hashed with bcrypt, JWT signed with secret.
3. HTTP-only cookie `admin_session` set.
4. Admin routes use middleware (Server Actions or layout) to require valid token; invalid tokens redirect to login.
5. Logout clears cookie.

## Deployment Notes

- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL`.
- For production uploads, switch `lib/storage.ts` to use S3 or Vercel Blob.
- Vercel Edge caching disabled on admin API routes.

## Future Enhancements

- Integrate analytics provider (Plausible or Vercel Analytics)
- Email notifications on contact submission (Resend)
- Multi-admin support
- Scheduling social posts from dashboard
