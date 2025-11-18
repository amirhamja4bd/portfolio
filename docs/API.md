# Portfolio Backend API Documentation

## Overview

This is a professional full-stack portfolio application with MongoDB backend, JWT authentication, and comprehensive REST APIs.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Blog Management**: Full CRUD operations with Editor.js support
- **Project Management**: Portfolio project CRUD with image uploads
- **Skills & Experience**: Manage technical skills and work experience
- **Contact Form**: Contact message handling with spam protection
- **Image Upload**: Secure image upload with validation
- **Admin Dashboard**: Protected admin routes for content management

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MongoDB (local or Atlas cloud)

## 🛠️ Installation

1. **Clone and install dependencies**:

```bash
pnpm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string and JWT secret:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
```

3. **Seed the database** (creates admin user and sample data):

```bash
pnpm seed
```

Default admin credentials:

- Email: `admin@portfolio.com`
- Password: `Admin@123`

⚠️ **Change the password after first login!**

4. **Start the development server**:

```bash
pnpm dev
```

## 📚 API Endpoints

### Authentication

#### POST `/api/auth/register`

Register a new admin user (protected with secret key)

```json
{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "name": "Your Name",
  "secretKey": "your-registration-secret"
}
```

#### POST `/api/auth/login`

Login with email and password

```json
{
  "email": "admin@portfolio.com",
  "password": "Admin@123"
}
```

#### GET `/api/auth/me`

Get current authenticated user (requires authentication)

#### POST `/api/auth/logout`

Logout current user

---

### Blog Posts

#### GET `/api/blogs`

Get all blog posts (public - only published posts)

- Query params: `page`, `limit`, `search`, `category`, `tag`, `featured`
- Admin: Add `?all=true` to see unpublished posts (requires auth)

#### GET `/api/blogs/[slug]`

Get single blog post by slug

#### POST `/api/blogs` 🔒

Create new blog post (requires authentication)

```json
{
  "title": "My Blog Post",
  "excerpt": "Short description",
  "content": {
    /* Editor.js JSON */
  },
  "tags": ["react", "nextjs"],
  "category": "Web Development",
  "published": true,
  "featured": false
}
```

#### PUT `/api/blogs/[slug]` 🔒

Update blog post (requires authentication)

#### DELETE `/api/blogs/[slug]` 🔒

Delete blog post (requires authentication)

---

### Projects

#### GET `/api/projects`

Get all projects (public - only published)

- Query params: `page`, `limit`, `search`, `category`, `featured`

#### GET `/api/projects/[slug]`

Get single project by slug

#### POST `/api/projects` 🔒

Create new project (requires authentication)

```json
{
  "title": "Project Name",
  "summary": "Brief description",
  "description": "Full description",
  "technologies": ["React", "Node.js"],
  "category": "Web Application",
  "image": "/uploads/projects/image.jpg",
  "githubUrl": "https://github.com/...",
  "demoUrl": "https://demo.com",
  "published": true,
  "featured": true
}
```

#### PUT `/api/projects/[slug]` 🔒

Update project (requires authentication)

#### DELETE `/api/projects/[slug]` 🔒

Delete project (requires authentication)

---

### Skills

#### GET `/api/skills`

Get all skills

- Query params: `category`, `all=true` (show inactive)

#### POST `/api/skills` 🔒

Create new skill (requires authentication)

```json
{
  "name": "React",
  "category": "frontend",
  "proficiency": 95,
  "description": "Advanced React development",
  "icon": "Atom",
  "order": 1
}
```

#### GET `/api/skills/[id]`

Get single skill

#### PUT `/api/skills/[id]` 🔒

Update skill (requires authentication)

#### DELETE `/api/skills/[id]` 🔒

Delete skill (requires authentication)

---

### Experience

#### GET `/api/experience`

Get all work experience entries

- Query params: `all=true` (show inactive)

#### POST `/api/experience` 🔒

Create new experience entry (requires authentication)

```json
{
  "company": "Tech Corp",
  "position": "Senior Developer",
  "location": "San Francisco, CA",
  "startDate": "2021-01-01",
  "endDate": "2023-12-31",
  "current": false,
  "description": "Job description",
  "responsibilities": ["Task 1", "Task 2"],
  "achievements": ["Achievement 1"],
  "technologies": ["React", "Node.js"]
}
```

#### GET `/api/experience/[id]`

Get single experience entry

#### PUT `/api/experience/[id]` 🔒

Update experience entry (requires authentication)

#### DELETE `/api/experience/[id]` 🔒

Delete experience entry (requires authentication)

---

### Contact

#### POST `/api/contact`

Submit contact form (public - rate limited)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

#### GET `/api/contact` 🔒

Get all contact messages (requires authentication)

- Query params: `page`, `limit`, `status`

#### GET `/api/contact/[id]` 🔒

Get single contact message (requires authentication)

#### PUT `/api/contact/[id]` 🔒

Update contact message status (requires authentication)

```json
{
  "status": "read",
  "replyMessage": "Your reply"
}
```

#### DELETE `/api/contact/[id]` 🔒

Delete contact message (requires authentication)

---

### File Upload

#### POST `/api/upload` 🔒

Upload image file (requires authentication)

- Form data: `file` (image file), `type` (folder: blog/projects/general)
- Max size: 5MB
- Allowed: JPEG, PNG, WebP, GIF

#### POST `/api/upload/editorjs` 🔒

Upload image for Editor.js (requires authentication)

- Form data: `image` (image file)
- Returns Editor.js compatible response

---

## 🔐 Authentication

All protected routes (🔒) require authentication. Include the JWT token in requests:

### Cookie (automatic after login):

```
Cookie: auth-token=<your-jwt-token>
```

### OR Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Database Models

### Admin

- email, password, name, role, isActive, lastLogin

### BlogPost

- title, slug, excerpt, content (Editor.js), tags, category, published, featured, views

### Project

- title, slug, summary, description, technologies, category, image, githubUrl, demoUrl, featured, published

### Skill

- name, category, proficiency, description, icon, order, isActive

### Experience

- company, position, location, startDate, endDate, current, description, responsibilities, achievements, technologies

### Contact

- name, email, message, status, replied, replyMessage

## 🎯 Rate Limiting

- Contact form: 3 messages per hour per email

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Protected admin routes
- File upload validation
- Input sanitization
- MongoDB injection prevention

## 📝 Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Seed database
pnpm seed

# Lint code
pnpm lint
```

## 🌐 Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret-min-32-chars>
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

Built with ❤️ using Next.js 16, MongoDB, and TypeScript
