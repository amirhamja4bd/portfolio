import {
  apiError,
  apiResponse,
  parseBody,
  withErrorHandling,
} from "@/lib/api-helpers";
import { generateToken, setTokenCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { hashPassword, validatePassword } from "@/lib/password";
import { NextRequest } from "next/server";

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  secretKey?: string;
}

async function registerHandler(request: NextRequest) {
  await connectDB();

  const body = await parseBody<RegisterBody>(request);
  const { email, password, name, secretKey } = body;

  // Validate secret key for registration (optional security measure)
  const REGISTRATION_SECRET = process.env.REGISTRATION_SECRET;
  if (REGISTRATION_SECRET && secretKey !== REGISTRATION_SECRET) {
    return apiError("Invalid registration secret key", 403);
  }

  // Validate input
  if (!email || !password || !name) {
    return apiError("Email, password, and name are required", 400);
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return apiError(passwordValidation.message!, 400);
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
  if (existingAdmin) {
    return apiError("An account with this email already exists", 409);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create admin user
  const admin = await Admin.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role: "admin",
    isActive: true,
  });

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
    201,
    "Registration successful"
  );
}

export const POST = withErrorHandling(registerHandler);
