# 🎨 Professional Portfolio with Full-Stack Backend

A modern, full-stack portfolio application built with Next.js 16, MongoDB, and TypeScript. Features a complete backend API, admin dashboard capabilities, and beautiful UI.

## ✨ Features

### Frontend

- 🎯 **Modern Portfolio Site**: Hero, About, Skills, Projects, Experience, Blog, Contact sections
- 🌓 **Dark/Light Mode**: Seamless theme switching with system preference detection
- 🎬 **Smooth Animations**: Framer Motion animations throughout
- 📱 **Fully Responsive**: Mobile-first design with Tailwind CSS
- ⚡ **Optimized Performance**: Next.js 16 App Router with Server Components

### Backend & APIs

- 🔐 **JWT Authentication**: Secure admin authentication with bcrypt password hashing
- 📝 **Blog Management**: Full CRUD with Editor.js integration
- 🚀 **Project Management**: Portfolio project CRUD operations
- 💡 **Skills & Experience**: Manage technical skills and work history
- 📧 **Contact Form**: Message handling with spam protection
- 🖼️ **Image Upload**: Secure file uploads with validation
- 📊 **MongoDB Database**: Professional data models with Mongoose

### Admin Features

- 👤 **Admin Dashboard**: Protected admin routes (ready for UI)
- 🔒 **Protected APIs**: All management endpoints require authentication
- 📈 **Content Management**: Full control over all portfolio content
- 📊 **Contact Management**: View and respond to messages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB (local or Atlas cloud)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 3. Seed the database (creates admin user and sample data)
pnpm seed

# 4. Start development server
pnpm dev
```

**Default Admin Credentials:**

- Email: `admin@portfolio.com`
- Password: `Admin@123`

⚠️ **Change password after first login!**

Visit: http://localhost:3000

## 📁 Project Structure

```
├── app/
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication (login, logout, register)
│   │   ├── blogs/                # Blog CRUD endpoints
│   │   ├── projects/             # Project CRUD endpoints
│   │   ├── skills/               # Skills management
│   │   ├── experience/           # Work experience management
│   │   ├── contact/              # Contact form & messages
│   │   └── upload/               # File upload endpoints
│   ├── (admin)/                  # Admin dashboard routes
│   ├── blogs/                    # Blog pages
│   └── projects/                 # Project pages
│
├── components/
│   ├── sections/                 # Homepage sections
│   ├── ui/                       # shadcn/ui components
│   └── providers/                # Context providers
│
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── auth.ts                   # JWT authentication
│   ├── api-client.ts             # Frontend API client
│   ├── api-helpers.ts            # Backend API helpers
│   ├── seed.ts                   # Database seeding
│   └── models/                   # Mongoose models
│
├── public/
│   └── uploads/                  # Uploaded images
│
└── docs/
    ├── API.md                    # Complete API documentation
    └── BACKEND_SETUP.md          # Setup & integration guide
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register admin (protected with secret)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Blog Posts

- `GET /api/blogs` - Get all posts (public)
- `GET /api/blogs/[slug]` - Get single post
- `POST /api/blogs` 🔒 - Create post
- `PUT /api/blogs/[slug]` 🔒 - Update post
- `DELETE /api/blogs/[slug]` 🔒 - Delete post

### Projects

- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/[slug]` - Get single project
- `POST /api/projects` 🔒 - Create project
- `PUT /api/projects/[slug]` 🔒 - Update project
- `DELETE /api/projects/[slug]` 🔒 - Delete project

### Skills & Experience

- `GET /api/skills` - Get all skills
- `GET /api/experience` - Get all experience
- Full CRUD operations (protected) 🔒

### Contact

- `POST /api/contact` - Submit message (public)
- `GET /api/contact` 🔒 - Get all messages (admin)
- Message management endpoints (protected) 🔒

### File Upload

- `POST /api/upload` 🔒 - Upload image
- `POST /api/upload/editorjs` 🔒 - Upload for Editor.js

🔒 = Requires authentication

[**Full API Documentation →**](docs/API.md)

## 🎨 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query
- **Theme**: next-themes

### Backend

- **Runtime**: Node.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jose) + bcryptjs
- **File Upload**: Native FormData handling
- **Validation**: Zod + Mongoose schemas

### Development

- **Package Manager**: pnpm
- **Linting**: ESLint
- **Editor**: VS Code recommended

## 📚 Documentation

- [**API Documentation**](docs/API.md) - Complete API reference
- [**Backend Setup Guide**](docs/BACKEND_SETUP.md) - Detailed setup instructions
- [**Environment Variables**](.env.example) - Configuration template

## 🔧 Available Scripts

```bash
# Development
pnpm dev           # Start dev server

# Production
pnpm build         # Build for production
pnpm start         # Start production server

# Database
pnpm seed          # Seed database with sample data

# Code Quality
pnpm lint          # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git push origin main
```

2. **Deploy on Vercel**
   - Import your repository
   - Add environment variables (see .env.example)
   - Deploy!

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

[**Deployment Guide →**](docs/BACKEND_SETUP.md#-deployment)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Protected admin routes
- ✅ File upload validation (size, type)
- ✅ Input sanitization
- ✅ Rate limiting on contact form
- ✅ MongoDB injection prevention
- ✅ HTTP-only cookies
- ✅ CORS configuration

## 🎯 Frontend Integration Examples

### Fetching Blog Posts

```tsx
import { blogApi } from "@/lib/api-client";

const { data } = await blogApi.getAll({ limit: 10 });
```

### Submitting Contact Form

```tsx
import { contactApi } from "@/lib/api-client";

await contactApi.submit(name, email, message);
```

### Authentication

```tsx
import { authApi } from "@/lib/api-client";

await authApi.login(email, password);
```

[**More Examples →**](docs/BACKEND_SETUP.md#-frontend-integration)

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB is running (local)
- Whitelist IP in Atlas (cloud)

### Authentication Issues

- Ensure `JWT_SECRET` is set and consistent
- Check token expiration (default: 7 days)
- Verify cookie settings in production

[**Full Troubleshooting Guide →**](docs/BACKEND_SETUP.md#-troubleshooting)

## 📊 Database Models

- **Admin**: User authentication and management
- **BlogPost**: Blog content with Editor.js support
- **Project**: Portfolio projects
- **Skill**: Technical skills
- **Experience**: Work history
- **Contact**: Contact form submissions

All models include timestamps, validation, and indexes for optimal performance.

## 🤝 Contributing

This is a personal portfolio project, but feel free to:

- Fork for your own use
- Submit bug reports
- Suggest features
- Share improvements

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting

---

**Built with ❤️ by Amir Hamza**

For questions or support, check the [documentation](docs/) or open an issue.

**Happy coding! 🚀**
