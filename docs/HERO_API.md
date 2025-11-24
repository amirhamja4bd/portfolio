# Hero Section API Documentation

## Overview

This API provides CRUD operations for managing the hero section of your portfolio. The hero section typically contains your introduction, bio, skills, and social links.

## Base URL

```
/api/hero
```

## Endpoints

### 1. Get Published Hero Section

Retrieves the currently published hero section.

**Endpoint:** `GET /api/hero`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "badge": {
      "text": "WELCOME TO MY WORLD"
    },
    "techStack": [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js"
    ],
    "heading": {
      "name": "I'm Amir Hamza",
      "title": "Software Engineer (Frontend)"
    },
    "bio": "Architecting scalable systems...",
    "cta": {
      "primary": {
        "text": "View Projects",
        "href": "#projects"
      },
      "secondary": {
        "text": "Get in Touch",
        "href": "#contact"
      }
    },
    "stats": [
      {
        "label": "Years Experience",
        "value": "6+"
      }
    ],
    "expertise": [
      "Platform Engineering",
      "Distributed Systems"
    ],
    "socialLinks": [
      {
        "icon": "Github",
        "href": "https://github.com/amirhamja4bd",
        "label": "GitHub"
      }
    ],
    "published": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Hero section not found"
}
```

---

### 2. Get All Hero Sections

Retrieves all hero sections (for admin panel).

**Endpoint:** `GET /api/hero/all`

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "badge": { "text": "WELCOME TO MY WORLD" },
      "published": true,
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "badge": { "text": "DRAFT VERSION" },
      "published": false,
      ...
    }
  ]
}
```

---

### 3. Get Hero Section by ID

Retrieves a specific hero section by its ID.

**Endpoint:** `GET /api/hero/[id]`

**Parameters:**
- `id` (path parameter): MongoDB ObjectId of the hero section

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

**Error Response (404):**

```json
{
  "error": "Hero section not found"
}
```

---

### 4. Create New Hero Section

Creates a new hero section.

**Endpoint:** `POST /api/hero`

**Request Body:**

```json
{
  "badge": {
    "text": "WELCOME TO MY WORLD"
  },
  "techStack": ["Next.js", "React", "TypeScript"],
  "heading": {
    "name": "I'm Amir Hamza",
    "title": "Software Engineer (Frontend)"
  },
  "bio": "Your bio text here...",
  "cta": {
    "primary": {
      "text": "View Projects",
      "href": "#projects"
    },
    "secondary": {
      "text": "Get in Touch",
      "href": "#contact"
    }
  },
  "stats": [
    {
      "label": "Years Experience",
      "value": "6+"
    }
  ],
  "expertise": ["Platform Engineering", "Cloud Architecture"],
  "socialLinks": [
    {
      "icon": "Github",
      "href": "https://github.com/username",
      "label": "GitHub"
    }
  ],
  "published": true
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Hero section created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

**Error Response (400):**

```json
{
  "error": "Validation error",
  "details": "Badge text is required"
}
```

**Notes:**
- If `published` is set to `true`, all other hero sections will be automatically unpublished
- All required fields must be provided

---

### 5. Update Hero Section

Updates an existing hero section.

**Endpoint:** `PUT /api/hero`

**Request Body:**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "badge": {
    "text": "UPDATED TEXT"
  },
  "published": true
  // ... other fields to update
}
```

**Response:**

```json
{
  "success": true,
  "message": "Hero section updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

**Error Response (404):**

```json
{
  "error": "Hero section not found"
}
```

**Error Response (400):**

```json
{
  "error": "Hero ID is required"
}
```

**Notes:**
- The `id` field is required in the request body
- If `published` is set to `true`, all other hero sections will be automatically unpublished
- Partial updates are supported (you don't need to send all fields)

---

### 6. Delete Hero Section

Deletes a hero section by ID.

**Endpoint:** `DELETE /api/hero?id=[id]`

**Query Parameters:**
- `id`: MongoDB ObjectId of the hero section to delete

**Response:**

```json
{
  "success": true,
  "message": "Hero section deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

**Error Response (400):**

```json
{
  "error": "Hero ID is required"
}
```

**Error Response (404):**

```json
{
  "error": "Hero section not found"
}
```

---

## Data Model

### Hero Schema

```typescript
interface Hero {
  _id: string;
  badge: {
    text: string; // max 100 characters
  };
  techStack: string[]; // 1-30 items
  heading: {
    name: string; // max 100 characters
    title: string; // max 200 characters
  };
  bio: string; // max 1000 characters
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  expertise: string[]; // 1-20 items
  socialLinks: Array<{
    icon: string; // e.g., "Github", "Linkedin", "Mail"
    href: string; // must be valid URL
    label: string;
  }>;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Usage Examples

### Fetch Hero Data (Client-Side)

```typescript
async function fetchHeroData() {
  const response = await fetch('/api/hero');
  const result = await response.json();

  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
}
```

### Create Hero Section

```typescript
async function createHero(heroData) {
  const response = await fetch('/api/hero', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(heroData),
  });

  const result = await response.json();
  return result;
}
```

### Update Hero Section

```typescript
async function updateHero(id: string, updates: Partial<Hero>) {
  const response = await fetch('/api/hero', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updates }),
  });

  const result = await response.json();
  return result;
}
```

### Delete Hero Section

```typescript
async function deleteHero(id: string) {
  const response = await fetch(`/api/hero?id=${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  return result;
}
```

---

## Seeding Initial Data

To seed the hero data with initial values, run:

```bash
npm run seed:hero
```

Or using pnpm:

```bash
pnpm seed:hero
```

This will create the initial hero section based on your current data if one doesn't already exist.

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "details": "Optional detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

- Only one hero section should be published at a time
- When creating or updating a hero section with `published: true`, all other sections are automatically unpublished
- The API uses MongoDB for data persistence
- All endpoints require a valid MongoDB connection
