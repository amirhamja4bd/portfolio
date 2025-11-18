import {
  apiError,
  apiResponse,
  getPaginationParams,
  paginationResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { NextRequest } from "next/server";

// GET /api/contact - Get all contact messages (Protected - Admin only)
async function getContactsHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  await connectDB();

  const { page, limit, skip } = getPaginationParams(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const query: any = {};

  if (status) {
    query.status = status;
  }

  // Get total count
  const total = await Contact.countDocuments(query);

  // Get contacts with pagination
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return apiResponse(paginationResponse(contacts, total, page, limit), 200);
}

// POST /api/contact - Submit a contact form (Public)
async function createContactHandler(request: NextRequest) {
  await connectDB();

  const body = await parseBody(request);

  // Validate required fields
  if (!body.name || !body.email || !body.message) {
    return apiError("Name, email, and message are required", 400);
  }

  // Get IP address and user agent
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Rate limiting check - prevent spam (optional)
  const recentMessages = await Contact.countDocuments({
    email: body.email.toLowerCase(),
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
  });

  if (recentMessages >= 3) {
    return apiError("Too many messages sent. Please try again later.", 429);
  }

  // Create the contact message
  const contact = await Contact.create({
    name: body.name,
    email: body.email.toLowerCase(),
    message: body.message,
    ipAddress,
    userAgent,
    status: "unread",
  });

  // TODO: Send email notification to admin (optional)
  // await sendEmailNotification(contact);

  return apiResponse(
    { id: contact._id },
    201,
    "Thank you for your message! I'll get back to you soon."
  );
}

export const GET = withAuth(withErrorHandling(getContactsHandler));
export const POST = withErrorHandling(createContactHandler);
