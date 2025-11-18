# 🔐 Authentication UI & API Integration - Complete Guide

## ✅ What's Been Created

### 1. **Authentication Context** (`contexts/auth-context.tsx`)

- Global auth state management
- Custom hooks: `useAuth()`, `useRequireAuth()`
- Login, logout, and user refresh functions
- Automatic redirect handling

### 2. **Login Page** (`app/(admin)/login/page.tsx`)

- Beautiful animated UI with Framer Motion
- Form validation with Zod
- Show/hide password toggle
- Error handling and display
- Mobile responsive

### 3. **Registration Page** (`app/(admin)/register/page.tsx`)

- Secure admin registration with secret key
- Password strength validation
- Success animation and auto-redirect
- Full form validation

### 4. **Admin Dashboard Layout** (`components/dashboard-layout.tsx`)

- Responsive sidebar navigation
- User dropdown menu
- Mobile-friendly with hamburger menu
- Quick access to all admin features

### 5. **Dashboard Home Page** (`app/(admin)/dashboard/page.tsx`)

- Real-time statistics display
- Quick action cards
- Recent activity feed
- Protected with auth check

## 🚀 How to Use

### Step 1: Start Your Development Server

```bash
# Make sure MongoDB is running and .env.local is configured
pnpm dev
```

### Step 2: Access the Admin Login

Navigate to: **http://localhost:3000/login**

**Default Credentials** (from database seed):

- Email: `admin@portfolio.com`
- Password: `Admin@123`

### Step 3: Explore the Dashboard

After logging in, you'll be redirected to: **http://localhost:3000/dashboard**

You'll see:

- ✅ Statistics for blogs, projects, and messages
- ✅ Quick action cards
- ✅ Navigation sidebar
- ✅ User menu with logout

### Step 4: Register New Admin (Optional)

Navigate to: **http://localhost:3000/register**

**Requirements:**

- Name, email, strong password
- **Registration Secret Key** (set in `.env.local` as `REGISTRATION_SECRET`)

## 🎨 Features

### Authentication

- ✅ **JWT-based auth** - Secure token management
- ✅ **HTTP-only cookies** - XSS protection
- ✅ **Auto-redirect** - Unauthorized users sent to login
- ✅ **Persistent sessions** - Stay logged in across page refreshes
- ✅ **Logout** - Clean session termination

### UI/UX

- ✅ **Smooth animations** - Framer Motion transitions
- ✅ **Form validation** - Real-time error feedback
- ✅ **Loading states** - Visual feedback during API calls
- ✅ **Error handling** - Clear error messages
- ✅ **Mobile responsive** - Works on all devices

### Security

- ✅ **Password visibility toggle**
- ✅ **Strong password requirements**
- ✅ **Secret key protection** for registration
- ✅ **Protected routes** - Auth required for dashboard
- ✅ **Secure API integration**

## 📁 File Structure

```
├── app/(admin)/
│   ├── layout.tsx                    # Wraps admin routes with AuthProvider
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   └── dashboard/
│       └── page.tsx                  # Dashboard home
│
├── contexts/
│   └── auth-context.tsx              # Auth state management
│
├── components/
│   ├──
│   │   └── dashboard-layout.tsx      # Admin layout with sidebar
│   └── ui/
│       └── dropdown-menu.tsx         # Dropdown menu component
│
└── lib/
    └── api-client.ts                 # API integration (already created)
```

## 🔌 How Authentication Works

### 1. **Login Flow**

```tsx
// User enters credentials
↓
// authApi.login() called → POST /api/auth/login
↓
// Server validates credentials
↓
// JWT token generated and stored in HTTP-only cookie
↓
// User data returned and stored in context
↓
// Redirect to /dashboard
```

### 2. **Protected Routes**

```tsx
// User visits /dashboard
↓
// useRequireAuth() hook checks authentication
↓
// If not authenticated → redirect to /login
↓
// If authenticated → render dashboard
```

### 3. **Session Persistence**

```tsx
// Page refreshes
↓
// AuthProvider calls authApi.me() on mount
↓
// Server verifies JWT from cookie
↓
// User data restored to context
↓
// User stays logged in
```

## 💻 Usage Examples

### Using Auth in Components

```tsx
import { useAuth } from "@/contexts/auth-context";

export function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting a Page

```tsx
import { useRequireAuth } from "@/contexts/auth-context";

export default function ProtectedPage() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only visible to: {user?.email}</p>
    </div>
  );
}
```

### Manual Login

```tsx
import { authApi } from "@/lib/api-client";

async function handleLogin(email: string, password: string) {
  try {
    const response = await authApi.login(email, password);
    console.log("Logged in:", response.data.user);
    // Redirect or update UI
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}
```

## 🎯 API Endpoints Used

### Authentication

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current authenticated user

### Dashboard Stats

- `GET /api/blogs?all=true` - Get all blog posts (admin)
- `GET /api/projects?all=true` - Get all projects (admin)
- `GET /api/contact` - Get all messages (admin)

## ⚙️ Configuration

### Environment Variables

```env
# .env.local

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Registration Secret (optional - for admin registration)
REGISTRATION_SECRET=your-registration-secret-key
```

### Default Admin Credentials

After running `pnpm seed`:

- **Email**: admin@portfolio.com
- **Password**: Admin@123

⚠️ **IMPORTANT:** Change the password after first login!

## 🎨 Customization

### Changing Colors

Edit `components/dashboard-layout.tsx`:

```tsx
// Change primary color
className = "bg-primary text-primary-foreground";

// Change sidebar color
className = "bg-card border-r";
```

### Adding Navigation Items

Edit `components/dashboard-layout.tsx`:

```tsx
const navigation = [
  {
    name: "My New Page",
    href: "/my-page",
    icon: MyIcon,
  },
  // ... existing items
];
```

### Customizing Login Page

Edit `app/(admin)/login/page.tsx`:

```tsx
// Change title
<h1 className="text-3xl font-bold">Your Custom Title</h1>

// Add custom fields
<Input
  id="customField"
  placeholder="Custom field"
  {...register("customField")}
/>
```

## 🐛 Troubleshooting

### "Unauthorized" Error

**Problem**: Can't access dashboard after login
**Solution**:

- Check JWT_SECRET in `.env.local`
- Clear browser cookies
- Verify MongoDB is running
- Check server logs for errors

### Login Redirect Loop

**Problem**: Keeps redirecting to login
**Solution**:

- Verify `/api/auth/me` endpoint works
- Check browser cookies are enabled
- Clear browser cache

### Can't Register

**Problem**: Registration secret key invalid
**Solution**:

- Set `REGISTRATION_SECRET` in `.env.local`
- Use same secret key in registration form
- Or remove secret key check from API

### Styles Not Applied

**Problem**: UI looks broken
**Solution**:

- Run `pnpm dev` to restart server
- Check Tailwind CSS is configured
- Verify all UI components are installed

## 📊 Dashboard Features

### Statistics Cards

- **Total Blogs**: Shows blog count with published status
- **Projects**: Total portfolio projects
- **Messages**: Contact form submissions with unread count
- **Site Activity**: System status

### Quick Actions

- **New Blog Post**: Create blog article
- **Add Project**: Add portfolio project
- **View Messages**: Check contact submissions

### Sidebar Navigation

- Dashboard (home)
- Blog Posts management
- Projects management
- Skills management
- Experience management
- Messages inbox
- Media library

## 🚀 Next Steps

1. **Create CRUD Pages**: Build blog, project, and other management pages
2. **Add Form Editors**: Implement Editor.js for blog content
3. **Build Media Library**: File upload and management UI
4. **Add Analytics**: Track views, visits, and engagement
5. **Email Notifications**: Alert on new messages
6. **User Management**: Multi-admin support

## 📚 Related Documentation

- **Backend API**: `docs/API.md`
- **Setup Guide**: `docs/BACKEND_SETUP.md`
- **API Client**: `lib/api-client.ts`

## 🎉 Test Your Auth System

### Test Login

1. Go to http://localhost:3000/login
2. Use: admin@portfolio.com / Admin@123
3. Should redirect to dashboard

### Test Logout

1. Click user menu in dashboard
2. Click "Logout"
3. Should redirect to login page

### Test Protected Route

1. Logout if logged in
2. Try to visit http://localhost:3000/dashboard
3. Should redirect to login page

### Test Session Persistence

1. Login to dashboard
2. Refresh the page (F5)
3. Should stay logged in

---

**Authentication system is now fully functional!** 🎉

You can now login, access the dashboard, and start building the CRUD interfaces for managing your portfolio content.

**Admin Login**: http://localhost:3000/login
**Dashboard**: http://localhost:3000/dashboard

Happy coding! 🚀
