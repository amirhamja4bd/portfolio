import {
  apiError,
  apiResponse,
  parseBody,
  withAuth,
  withErrorHandling,
} from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { NextRequest } from "next/server";

// GET /api/contact/[id] - Get a single contact message (Protected)
async function getContactHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;

  const contact = await Contact.findById(id);

  if (!contact) {
    return apiError("Contact message not found", 404);
  }

  // Mark as read when viewed
  if (contact.status === "unread") {
    contact.status = "read";
    await contact.save();
  }

  return apiResponse(contact, 200);
}

// PUT /api/contact/[id] - Update contact message status (Protected)
async function updateContactHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;
  const body = await parseBody(request);

  const contact = await Contact.findById(id);

  if (!contact) {
    return apiError("Contact message not found", 404);
  }

  // Update allowed fields
  if (body.status) {
    contact.status = body.status;
  }

  if (body.replyMessage) {
    contact.replyMessage = body.replyMessage;
    contact.replied = true;
    contact.repliedAt = new Date();
    contact.status = "replied";
  }

  await contact.save();

  return apiResponse(contact, 200, "Contact message updated successfully");
}

// DELETE /api/contact/[id] - Delete a contact message (Protected)
async function deleteContactHandler(
  request: NextRequest,
  { params, user }: { params: Promise<{ id: string }>; user: any }
) {
  await connectDB();
  const { id } = await params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    return apiError("Contact message not found", 404);
  }

  return apiResponse(null, 200, "Contact message deleted successfully");
}

export const GET = withAuth(withErrorHandling(getContactHandler));
export const PUT = withAuth(withErrorHandling(updateContactHandler));
export const DELETE = withAuth(withErrorHandling(deleteContactHandler));
