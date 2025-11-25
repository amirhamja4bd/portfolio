import { apiError, apiResponse, withErrorHandling } from "@/lib/api-helpers";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadHandler(request: NextRequest, { user }: { user: any }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return apiError("No file uploaded", 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        400
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return apiError("File size exceeds 5MB limit", 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Determine upload directory based on type
    const uploadType = (formData.get("type") as string) || "general";
    const uploadDir = path.join(process.cwd(), "public", "uploads", uploadType);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${uploadType}/${filename}`;

    return apiResponse(
      {
        filename,
        url: publicUrl,
        size: file.size,
        type: file.type,
      },
      201,
      "File uploaded successfully"
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return apiError(error.message || "Failed to upload file", 500);
  }
}

// POST /api/upload - Upload an image file (Temporarily removed auth for testing)
// Delete uploaded file by url
async function deleteHandler(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const url = body?.url as string;
    if (!url) return apiError("No url provided", 400);
    // Ensure path is within /uploads
    if (!url.startsWith("/uploads/")) {
      return apiError("Invalid url path", 400);
    }

    const localPath = path.join(
      process.cwd(),
      "public",
      url.replace(/^[\/]+/, "")
    );
    if (!existsSync(localPath)) {
      return apiError("File not found", 404);
    }

    await unlink(localPath);
    return apiResponse({ url }, 200, "File deleted successfully");
  } catch (error: any) {
    console.error("Failed to delete file:", error);
    return apiError(error?.message || "Failed to delete file", 500);
  }
}

export const POST = withErrorHandling(uploadHandler);
export const DELETE = withErrorHandling(deleteHandler);
