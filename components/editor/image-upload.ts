import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Upload failed: ${res.status} ${txt}`);
    }

    const json = await res.json();
    const url = json?.data?.url || json?.url;
    if (!url) {
      console.error("No URL returned by upload api", json);
      throw new Error("Upload didn't return a valid url.");
    }

    // Return a string URL so createImageUpload receives the final URL string
    return url as string;
  } catch (err: any) {
    console.error("Upload error:", err);
    toast.error(err?.message || "Error uploading image. Please try again.");
    throw err;
  }
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file: File) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
