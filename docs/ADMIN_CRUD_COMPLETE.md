# Admin CRUD System - Complete Documentation

## Overview

Complete CRUD (Create, Read, Update, Delete) implementation for the portfolio admin dashboard using **shadcn/ui** components, **react-hook-form**, and **zod** validation.

## Features Implemented

### ✅ Entities with Full CRUD

1. **Blog Posts** - `/dashboard/blogs`
2. **Projects** - `/dashboard/projects`
3. **Skills** - `/dashboard/skills`
4. **Experience** - `/dashboard/experience`
5. **Contact Messages** - `/dashboard/contact` (Read & Delete only)

### ✅ UI Components

- Modal-based forms using shadcn Dialog
- Form validation with react-hook-form + zod
- Responsive grid/list layouts
- Search functionality
- Status badges (Published, Draft, Featured, etc.)
- Loading states and error handling
- Confirmation dialogs for delete operations

## File Structure

```
app/(admin)/dashboard/
├── page.tsx                    # Dashboard overview with stats
├── blogs/
│   └── page.tsx               # Blog posts management
├── projects/
│   └── page.tsx               # Projects management
├── skills/
│   └── page.tsx               # Skills management (grouped by category)
├── experience/
│   └── page.tsx               # Work experience management
└── contact/
    └── page.tsx               # Contact messages (read-only)

components/admin/
├── blog-form-modal.tsx        # Blog create/edit modal
├── project-form-modal.tsx     # Project create/edit modal
├── skill-form-modal.tsx       # Skill create/edit modal
├── experience-form-modal.tsx  # Experience create/edit modal
├── admin-sidebar.tsx          # Sidebar navigation (updated)
└── index.ts                   # Barrel exports
```

## Usage Examples

### 1. Blog Posts Management

**Features:**

- Create/Edit blog posts with title, excerpt, content, category, tags
- Upload cover images (URL input)
- Toggle published/featured status
- Search by title, excerpt, or category
- Display views count and creation date

**Form Fields:**

```typescript
{
  title: string;          // Required, max 200 chars
  excerpt: string;        // Required, max 500 chars
  content: EditorJS JSON; // Optional (defaults to excerpt)
  coverImage: string;     // Optional URL
  tags: string[];         // Comma-separated
  category: string;       // Required
  published: boolean;     // Toggle
  featured: boolean;      // Toggle
}
```

### 2. Projects Management

**Features:**

- Create/Edit projects with detailed information
- Add technologies (comma-separated)
- Category selection (Web App, Mobile, API, etc.)
- GitHub and Demo URLs
- Featured projects highlighting

**Form Fields:**

```typescript
{
  title: string;           // Required, max 200 chars
  summary: string;         // Required, max 300 chars
  description: string;     // Required
  technologies: string[];  // Comma-separated, 1-20 items
  category: enum;          // Required dropdown
  image: string;           // Required URL
  githubUrl: string;       // Optional URL
  demoUrl: string;         // Optional URL
  featured: boolean;       // Toggle
  published: boolean;      // Toggle
}
```

### 3. Skills Management

**Features:**

- Create/Edit skills with proficiency levels
- Category-based grouping (Frontend, Backend, DevOps, etc.)
- Icon/emoji support
- Proficiency percentage (0-100)
- Active/Inactive toggle

**Form Fields:**

```typescript
{
  name: string;           // Required
  category: enum;         // Required: frontend, backend, devops, etc.
  proficiency: number;    // Required: 0-100
  description: string;    // Required, max 300 chars
  icon: string;           // Required (emoji or icon character)
  isActive: boolean;      // Toggle
}
```

### 4. Experience Management

**Features:**

- Add/Edit work experience entries
- Current position toggle (auto-disables end date)
- Multiple responsibilities and achievements (line-separated)
- Technologies used
- Date range validation

**Form Fields:**

```typescript
{
  company: string;            // Required
  companyUrl: string;         // Optional URL
  position: string;           // Required
  location: string;           // Required
  startDate: Date;            // Required
  endDate: Date;              // Optional (disabled if current)
  current: boolean;           // Toggle
  description: string;        // Required
  responsibilities: string[]; // Line-separated
  achievements: string[];     // Line-separated
  technologies: string[];     // Comma-separated
  isActive: boolean;          // Toggle
}
```

### 5. Contact Messages

**Features:**

- View all contact form submissions
- Mark as read (automatic on view)
- Reply via email (mailto link)
- Delete messages
- Unread count indicator

**Display:**

- Name, email, message preview
- New badge for unread messages
- Timestamp
- Full message view in modal

## Form Validation Rules

All forms use **zod** schemas with the following validation:

### Common Validations

- **Required fields**: Custom error messages
- **String length**: Min/max character limits
- **URLs**: Valid URL format checking
- **Arrays**: Min/max item counts
- **Numbers**: Range validation (e.g., proficiency 0-100)

### Example Schema (Project)

```typescript
const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().min(1, "Summary is required").max(300),
  description: z.string().min(1, "Description is required"),
  technologies: z.string().min(1, "At least one technology is required"),
  category: z.enum([
    "Web Application",
    "Mobile App",
    "API",
    "Tool",
    "Library",
    "Platform",
    "Other",
  ]),
  image: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Project image is required"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});
```

## API Integration

All CRUD operations use the centralized API client from `@/lib/api-client`:

```typescript
// Blog API
await blogApi.getAll({ all: true, limit: 100 });
await blogApi.create(data);
await blogApi.update(slug, data);
await blogApi.delete(slug);

// Project API
await projectApi.getAll({ all: true, limit: 100 });
await projectApi.create(data);
await projectApi.update(slug, data);
await projectApi.delete(slug);

// Skill API
await skillApi.getAll({ all: true });
await skillApi.create(data);
await skillApi.update(id, data);
await skillApi.delete(id);

// Experience API
await experienceApi.getAll({ all: true });
await experienceApi.create(data);
await experienceApi.update(id, data);
await experienceApi.delete(id);

// Contact API
await contactApi.getAll({ limit: 100 });
await contactApi.update(id, { status: "read" });
await contactApi.delete(id);
```

## UI Components Used

### shadcn/ui Components

- ✅ **Dialog** - Modal containers
- ✅ **Form** - Form context and field management
- ✅ **Input** - Text inputs
- ✅ **Textarea** - Multi-line text
- ✅ **Button** - Actions
- ✅ **Select** - Dropdown menus
- ✅ **Label** - Form labels
- ✅ **Separator** - Visual dividers
- ✅ **Badge** - Status indicators (via custom spans)

### External Libraries

- **react-hook-form** - Form state management
- **zod** - Schema validation
- **@hookform/resolvers** - Zod integration with react-hook-form
- **framer-motion** - Animations
- **lucide-react** - Icons

## Responsive Design

All pages are fully responsive with:

- Mobile-first design approach
- Flexible grid layouts (1-3 columns based on screen size)
- Touch-friendly buttons (minimum 44px)
- Collapsible sidebar
- Stacked layouts on mobile

### Breakpoints

```css
sm: 640px   - 2 columns for grids
md: 768px   - Enhanced padding
lg: 1024px  - 3 columns for grids
```

## User Experience Features

### Loading States

- Spinner with message during data fetch
- Button loading state during form submission
- Disabled states to prevent double-submission

### Error Handling

- Form validation errors displayed inline
- API error alerts
- Confirmation dialogs for destructive actions

### Search & Filter

- Real-time client-side search
- Filters by title, description, category, tags
- Category-based grouping (Skills)

### Visual Feedback

- Hover effects on cards
- Active state in sidebar
- Status badges (Published, Draft, Featured, Current, New)
- Color-coded categories

## Security

- ✅ Authentication required (via `useRequireAuth`)
- ✅ Protected API routes (via `withAuth` middleware)
- ✅ CSRF protection with cookies
- ✅ Input validation (client + server)

## Future Enhancements

Potential improvements:

1. **Rich Text Editor** - Integrate Editor.js for blog content
2. **Image Upload** - Direct file upload instead of URL input
3. **Drag & Drop** - Reorder items (order field exists in models)
4. **Bulk Actions** - Select multiple items for batch operations
5. **Filters** - Advanced filtering (date range, status, category)
6. **Pagination** - For large datasets (currently showing all)
7. **Export** - Download data as CSV/JSON
8. **Analytics** - View counts, popular posts, etc.

## Customization Guide

### Adding a New Entity

1. **Create API routes** in `app/api/[entity]/route.ts`
2. **Create form modal** in `components/admin/[entity]-form-modal.tsx`
3. **Create page** in `app/(admin)/dashboard/[entity]/page.tsx`
4. **Add to sidebar** in `components/admin/admin-sidebar.tsx`
5. **Export modal** in `components/admin/index.ts`

### Modifying Form Fields

1. Update zod schema in the form modal component
2. Add/remove FormField components
3. Update API payload transformation in `onSubmit`
4. Ensure backend model supports the changes

## Testing Checklist

- [ ] Create new item
- [ ] Edit existing item
- [ ] Delete item (with confirmation)
- [ ] Search/filter functionality
- [ ] Form validation (required fields, formats)
- [ ] Toggle switches (published, featured, etc.)
- [ ] Mobile responsiveness
- [ ] Loading states
- [ ] Error handling
- [ ] Modal open/close
- [ ] Navigation between pages

## Troubleshooting

### Forms not submitting

- Check browser console for errors
- Verify API endpoints are accessible
- Check authentication token
- Validate form data against schema

### TypeScript errors

- Run `pnpm install` to ensure dependencies are installed
- Restart TypeScript server in VS Code
- Check import paths are correct

### Styling issues

- Ensure Tailwind classes are properly applied
- Check responsive breakpoints
- Verify shadcn components are installed

## Dependencies

Required packages (should already be installed):

```json
{
  "react-hook-form": "^7.x.x",
  "zod": "^3.x.x",
  "@hookform/resolvers": "^3.x.x",
  "framer-motion": "^11.x.x",
  "lucide-react": "^0.x.x"
}
```

## Credits

Built with:

- Next.js 14+ (App Router)
- shadcn/ui
- React Hook Form
- Zod
- Tailwind CSS
- TypeScript

---

**Last Updated:** November 19, 2025
**Status:** ✅ Complete - All CRUD operations implemented
