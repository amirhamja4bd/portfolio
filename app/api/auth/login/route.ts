import {
  apiError,
  apiResponse,
  parseBody,
  withErrorHandling,
} from "@/lib/api-helpers";
import { generateToken, setTokenCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { comparePassword } from "@/lib/password";
import { NextRequest } from "next/server";

interface LoginBody {
  email: string;
  password: string;
}

async function loginHandler(request: NextRequest) {
  await connectDB();

  const body = await parseBody<LoginBody>(request);
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    return apiError("Email and password are required", 400);
  }

  // Find admin user
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!admin) {
    return apiError("Invalid email or password", 401);
  }

  // Check if admin is active
  if (!admin.isActive) {
    return apiError("Account is deactivated. Please contact support.", 403);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    return apiError("Invalid email or password", 401);
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Generate JWT token
  const token = await generateToken({
    userId: String(admin._id),
    email: admin.email,
    role: admin.role,
  });

  // Set token in cookie
  await setTokenCookie(token);

  // Return user data (password is already excluded by toJSON)
  return apiResponse(
    {
      user: admin,
      token,
    },
    200,
    "Login successful"
  );
}

export const POST = withErrorHandling(loginHandler);
