# Backend Setup & Integration Guide

## 🎯 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB on your system
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB service
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

**Required variables:**

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/portfolio
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters

# Optional registration protection
REGISTRATION_SECRET=your-registration-secret-key
```

### 4. Seed the Database

```bash
pnpm seed
```

This will create:

- ✅ Admin user (admin@portfolio.com / Admin@123)
- ✅ Sample blog posts
- ✅ Sample projects
- ✅ Sample skills
- ✅ Sample work experience

⚠️ **Important**: Change the admin password after first login!

### 5. Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
/home/amir/Work/amir-hamza/new_portfolio/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── register/
│   │   │   └── me/
│   │   ├── blogs/                # Blog CRUD endpoints
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   ├── projects/             # Project CRUD endpoints
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   ├── skills/               # Skills CRUD endpoints
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   ├── experience/           # Experience CRUD endpoints
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   ├── contact/              # Contact form endpoints
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   └── upload/               # File upload endpoints
│   │       ├── route.ts
│   │       └── editorjs/
│   └── (admin)/                  # Admin dashboard (to be built)
│
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── auth.ts                   # JWT authentication utilities
│   ├── password.ts               # Password hashing utilities
│   ├── api-helpers.ts            # API helper functions
│   ├── api-client.ts             # Frontend API client
│   ├── seed.ts                   # Database seeding script
│   └── models/                   # Mongoose models
│       ├── Admin.ts
│       ├── BlogPost.ts
│       ├── Project.ts
│       ├── Skill.ts
│       ├── Experience.ts
│       └── Contact.ts
│
├── public/
│   └── uploads/                  # Uploaded images (created automatically)
│       ├── blog/
│       ├── projects/
│       └── general/
│
└── docs/
    └── API.md                    # Complete API documentation
```

## 🔧 API Testing

### Using cURL

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"Admin@123"}'
```

**Get Blog Posts:**

```bash
curl http://localhost:3000/api/blogs
```

**Create Blog Post (requires authentication):**

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Post",
    "excerpt": "Short description",
    "content": {"blocks":[]},
    "tags": ["test"],
    "category": "Tutorial",
    "published": true
  }'
```

### Using Thunder Client / Postman

1. Import the API collection (see docs/API.md)
2. Set base URL: `http://localhost:3000`
3. Login to get JWT token
4. Add token to Authorization header

## 🎨 Frontend Integration

### Example: Fetch Blog Posts

```tsx
"use client";

import { useEffect, useState } from "react";
import { blogApi } from "@/lib/api-client";

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await blogApi.getAll({ limit: 10 });
        setPosts(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map((post: any) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Example: Submit Contact Form

```tsx
"use client";

import { useState } from "react";
import { contactApi } from "@/lib/api-client";

export function ContactForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      await contactApi.submit(data.name, data.email, data.message);
      setStatus("success");
      e.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      console.error("Failed to submit:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && <p>Message sent successfully!</p>}
      {status === "error" && <p>Failed to send message. Try again.</p>}
    </form>
  );
}
```

## 🔐 Authentication in Frontend

### Login Component Example

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authApi.login(email, password);
      // Token is automatically stored in cookies
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button>Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Protected Page Example

```tsx
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

## 📊 Database Management

### View Database Contents

**Using MongoDB Compass (GUI):**

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MONGODB_URI
3. Browse collections and documents

**Using MongoDB Shell:**

```bash
# Connect to local MongoDB
mongosh

# OR connect to Atlas
mongosh "mongodb+srv://cluster.mongodb.net/portfolio" --username <username>

# View collections
show collections

# View blog posts
db.blogposts.find().pretty()

# View admin users
db.admins.find().pretty()
```

### Backup & Restore

**Backup:**

```bash
mongodump --uri="mongodb://localhost:27017/portfolio" --out=./backup
```

**Restore:**

```bash
mongorestore --uri="mongodb://localhost:27017/portfolio" ./backup/portfolio
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Add backend implementation"
git push origin main
```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`
     - `NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app`

3. **Deploy!**

### MongoDB Atlas Configuration

1. **Whitelist Vercel IPs**

   - In Atlas, go to Network Access
   - Add IP: `0.0.0.0/0` (allow all) or specific Vercel IPs

2. **Database User**
   - Create a user with read/write permissions
   - Use this in your MONGODB_URI

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**

- Check MongoDB is running: `sudo systemctl status mongodb`
- Verify MONGODB_URI in .env.local
- Check firewall settings

**Error: "Authentication failed"**

- Verify username/password in connection string
- Check database user permissions in Atlas

### JWT Token Issues

**Error: "Unauthorized"**

- Ensure JWT_SECRET is set and consistent
- Check token expiration (default 7 days)
- Verify cookie settings in production (httpOnly, secure)

### File Upload Issues

**Error: "File too large"**

- Default max size is 5MB
- Check client-side validation
- Adjust MAX_FILE_SIZE in upload route

**Error: "Permission denied"**

```bash
# Create upload directory with correct permissions
mkdir -p public/uploads/{blog,projects,general}
chmod 755 public/uploads
```

## 📚 Additional Resources

- [Complete API Documentation](./API.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🤝 Need Help?

- Check API documentation: `docs/API.md`
- Review error logs in terminal
- Test endpoints with Thunder Client/Postman
- Verify environment variables

---

Happy coding! 🎉
