import { apiError, apiResponse } from "@/lib/api-helpers";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

// Allowed file types for resumes
const ALLOWED_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return apiError("No file uploaded", 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError("Invalid file type. Only PDF files are allowed.", 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return apiError("File size exceeds 10MB limit", 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `resume-${timestamp}-${randomString}.pdf`;

    // Upload directory for resumes
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");

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
    const publicUrl = `/uploads/resumes/${filename}`;

    return apiResponse(
      {
        filename,
        url: publicUrl,
        size: file.size,
        type: file.type,
      },
      201,
      "Resume uploaded successfully"
    );
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return apiError(error.message || "Failed to upload resume", 500);
  }
}
