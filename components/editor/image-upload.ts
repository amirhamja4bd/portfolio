import { toast } from "sonner";

// Simple upload function that matches the expected signature for novel plugins
export const uploadFn = (file: File, view: any, pos: number) => {
  // Basic validation
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return;
  }
  if (file.size / 1024 / 1024 > 20) {
    toast.error("File size too big (max 20MB).");
    return;
  }

  console.log("Starting image upload for file:", file.name, "size:", file.size);

  const formData = new FormData();
  formData.append("file", file);

  const promise = fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include", // Include cookies for authentication
  });

  promise
    .then(async (res) => {
      console.log("Upload response status:", res.status);
      if (res.status === 200 || res.status === 201) {
        const data = await res.json();
        console.log("Upload success:", data);
        const { url } = data;
        // Insert the image into the editor
        view.dispatch(
          view.state.tr.insert(
            pos,
            view.state.schema.nodes.image.create({ src: url })
          )
        );
        toast.success("Image uploaded successfully.");
      } else {
        const errorText = await res.text();
        console.error("Upload failed:", res.status, errorText);
        toast.error(`Error uploading image: ${res.status}`);
      }
    })
    .catch((error) => {
      console.error("Upload error:", error);
      toast.error("Error uploading image. Please try again.");
    });
};
