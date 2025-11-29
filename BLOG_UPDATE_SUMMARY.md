# Blog System Update Summary

## Overview

Updated the blog system to use Novel.sh editor with auto-generated slugs and new field structure.

## Changes Made

### 1. **Installed Novel.sh Editor**

```bash
pnpm add novel
```

- Novel.sh is a modern WYSIWYG rich text editor built on TipTap
- Provides a clean, Notion-like editing experience

### 2. **Updated BlogPost Model** (`lib/models/BlogPost.ts`)

#### Removed Fields:

- ❌ `excerpt` - No longer needed, content is managed by Novel editor
- ❌ `readingTime` - Can be calculated client-side if needed
- ❌ `coverImage` - Renamed to `thumbnail` for clarity

#### Added Fields:

- ✅ `thumbnail` - Optional string for main preview image
- ✅ `images` - Array of strings for additional images

#### Updated Fields:

- ✅ `slug` - Now auto-generated from title (not required on input)
- ✅ `content` - Now stored as an HTML string (converted from Novel/Tiptap JSON or HTML input)

#### Final Schema:

```typescript
{
  title: string (required)
  slug: string (auto-generated, unique)
  content: string (HTML string, required)
  tags: string[]
  thumbnail?: string
  images: string[]
  category: string (required)
  author: { name: string, avatar?: string }
  published: boolean
  featured: boolean
  views: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### 3. **Updated API Routes**

#### `app/api/blogs/route.ts` (Create):

- Slug is auto-generated from title using `slugify`
- If slug already exists, appends timestamp for uniqueness
- Removed excerpt validation and reading time calculation
- Validates only `title` and `content` as required fields

#### `app/api/blogs/[slug]/route.ts` (Update):

- Maintains slug auto-generation on title change
- Handles unique slug conflicts with timestamp fallback
- Preserves manual slug overrides

### 4. **Updated Admin Blog Form** (`components/admin/blog-form-modal.tsx`)

#### Novel Editor Integration:

- Dynamically imports `EditorRoot` and `EditorContent` to avoid SSR issues
- Added `isMounted` state to prevent hydration errors
- Editor only renders on client-side after component mounts
- Loading states for better UX

#### Form Fields:

- Removed: `excerpt`, `readingTime`
- Added: `thumbnail` (single URL), `images` (comma-separated URLs)
- Updated: Content field now uses Novel rich text editor

#### Hydration Fix:

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// In render:
{
  isMounted ? <EditorRoot>...</EditorRoot> : <LoadingState />;
}
```

### 5. **Updated Admin Dashboard** (`app/(admin)/dashboard/blogs/page.tsx`)

- Changed `coverImage` references to `thumbnail`
- Removed `excerpt` display
- Shows category and tags instead
- Updated filter to search by tags instead of excerpt

### 6. **Updated User-Facing Blog Pages**

- Updated `app/(user)/blogs/page.tsx` to handle both old and new formats
- Made fields backwards compatible for static demo data
- Removed `readingTime` display
- Updated image handling to use `thumbnail` or fallback to `coverImage`

## How It Works

### Creating a Blog Post:

1. User fills in the title
2. Uses Novel editor for rich content
3. Adds category, tags, thumbnail, and additional images
4. Slug is automatically generated from title
5. If slug exists, timestamp is appended (e.g., `my-post-1732377600000`)

### Editing a Blog Post:

1. Modal loads existing content into Novel editor
2. If title changes, slug updates automatically (unless manually overridden)
3. All fields can be updated
4. Content state is managed separately for optimal performance

## Hydration Error Fix

The hydration error was caused by Novel editor trying to render on the server. Fixed by:

1. **Dynamic Imports with SSR disabled**:

```typescript
const EditorRoot = dynamic(
  () => import("novel").then((mod) => mod.EditorRoot),
  { ssr: false, loading: () => <LoadingState /> }
);
```

2. **Client-side Mount Check**:

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);
```

3. **Conditional Rendering**:
   Only render the editor after component has mounted on client-side.

## Testing Checklist

- [ ] Create a new blog post with Novel editor
- [ ] Verify slug auto-generation
- [ ] Test slug uniqueness (create posts with same title)
- [ ] Edit existing blog post
- [ ] Upload thumbnail and multiple images
- [ ] Verify published/featured toggles
- [ ] Test search functionality in admin dashboard
- [ ] View blog posts in user-facing pages
- [ ] Verify no hydration errors in console

## Notes

- The static demo data in `lib/content.ts` still uses old schema (for demo purposes)
- Real blog posts from MongoDB will use the new schema
- Editor content is stored on the client as TipTap JSON; the server stores HTML strings converted from that format.
- Images are stored as URLs (consider adding upload functionality later)
- Slug generation uses lowercase and hyphens only (`^[a-z0-9-]+$`)

## Future Enhancements

1. **Image Upload**: Implement direct image upload to storage service
2. **Reading Time**: Calculate from Novel content on frontend
3. **Excerpt Generation**: Auto-generate from first paragraph of content
4. **Rich Metadata**: Extract headings, images for better SEO
5. **Content Versioning**: Track changes to blog posts
6. **Draft Auto-save**: Periodically save drafts while editing
