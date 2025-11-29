"use client";

import Editor from "@/components/editor/editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectApi } from "@/lib/api-client";
import htmlToDoc from "@/lib/html-to-doc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  technologies: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required"),
  category: z.enum([
    "Web Application",
    "Mobile App",
    "API",
    "Tool",
    "Library",
    "Platform",
    "Other",
  ]),
  thumbnail: z.string().min(1, "Project thumbnail is required"),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  githubUrls: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().url("Must be a valid URL"),
      })
    )
    .optional(),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
  backUrl?: string; // optional url to return to after success
  onCancel?: () => void; // optional cancel handler for modal
  onSubmit?: (data: ProjectFormValues) => Promise<void> | void; // optional custom submit handler
}

export default function ProjectForm({
  project,
  onSuccess,
  backUrl,
  onCancel,
  onSubmit: onSubmitProp,
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTech, setCurrentTech] = useState("");
  const [currentGithubLabel, setCurrentGithubLabel] = useState("");
  const [currentGithubUrl, setCurrentGithubUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageIndexes, setDeletingImageIndexes] = useState<number[]>(
    []
  );
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);
  const [editorKey, setEditorKey] = useState<string>(
    `editor-new-${Date.now()}`
  );
  const isEditing = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      category: "Web Application",
      thumbnail: "",
      images: [],
      videos: [],
      githubUrls: [],
      demoUrl: "",
      order: 0,
      featured: false,
      published: true,
    },
  });

  const {
    fields: githubFields,
    append: appendGithub,
    remove: removeGithub,
  } = useFieldArray({
    control: form.control,
    name: "githubUrls",
  });

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control: form.control as any,
    name: "technologies",
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control as any,
    name: "images",
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control as any,
    name: "videos",
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title || "",
        description: project.description || "",
        technologies: project.technologies || [],
        category: project.category || "Web Application",
        thumbnail: project.thumbnail || "",
        images: project.images || [],
        videos: project.videos || [],
        githubUrls: project.githubUrls || [],
        demoUrl: project.demoUrl || "",
        order: project.order || 0,
        featured: project.featured || false,
        published: project.published !== false,
      });
      setThumbnailUrl(project.thumbnail || "");
      setImagesUrls(project.images || []);
    } else {
      form.reset({
        title: "",
        description: "",
        technologies: [],
        category: "Web Application",
        thumbnail: "",
        images: [],
        videos: [],
        githubUrls: [],
        demoUrl: "",
        order: 0,
        featured: false,
        published: true,
      });
      setThumbnailUrl("");
      setImagesUrls([]);
    }
    // remount editor when the project prop changes so initialValue is applied
    setEditorKey(`editor-${project?.slug ?? "new"}-${Date.now()}`);
  }, [project, form]);

  const handleAddTech = () => {
    if (currentTech.trim()) {
      (appendTech as any)(currentTech.trim());
      setCurrentTech("");
    }
  };

  const handleAddGithub = () => {
    if (currentGithubLabel.trim() && currentGithubUrl.trim()) {
      appendGithub({
        label: currentGithubLabel.trim(),
        url: currentGithubUrl.trim(),
      });
      setCurrentGithubLabel("");
      setCurrentGithubUrl("");
    }
  };

  const handleAddVideo = () => {
    if (currentVideo.trim()) {
      (appendVideo as any)(currentVideo.trim());
      setCurrentVideo("");
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.debug("uploadFile response", data);
    // API responses use a wrapper: { success, message, data: { url } }
    const url = data?.data?.url || data?.url;
    if (!url) {
      console.error("Upload API did not return url", data);
      throw new Error("Upload failed: no url returned");
    }
    return url;
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setIsUploading(true);
      try {
        const url = await uploadFile(file);
        setThumbnailUrl(url);
        // ensure we set the form value explicitly and mark dirty/validate
        form.setValue("thumbnail", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.trigger("thumbnail");
        console.debug("Thumbnail set on form", form.getValues("thumbnail"));
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Delete file on server (uploads/* only)
  const deleteFileOnServer = async (url: string) => {
    if (!url || typeof url !== "string") return false;
    if (!url.includes("/uploads/")) return false;
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Delete file failed", data);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Failed to delete file on server", err);
      return false;
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      setIsUploading(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadFile(files[i]);
          urls.push(url);
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
      // Append new images to the field array (useFieldArray) and also
      // keep a local preview list in sync with the appended urls.
      urls.forEach((url) => (appendImage as any)(url));
      setImagesUrls((prev) => [...prev, ...urls]);
      // ensure the form validators have a chance to run
      form.trigger("images");
      console.debug("Images set on form", form.getValues("images"));
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    console.debug("ProjectForm submit data (argument)", data);
    console.debug(
      "ProjectForm submit values (form.getValues())",
      form.getValues()
    );
    if (isUploading) {
      toast("Please wait until uploads complete before submitting.");
      console.debug("Submit aborted - uploading in progress", form.getValues());
      return;
    }

    try {
      setIsSubmitting(true);

      const formValues = form.getValues();
      console.debug("ProjectForm final formValues", formValues);
      const payload = {
        ...formValues,
        githubUrls: (formValues.githubUrls as any) || [],
      };
      console.debug(
        "ProjectForm payload",
        payload,
        "thumbnail",
        payload.thumbnail,
        "images",
        payload.images
      );

      if (typeof onSubmitProp === "function") {
        // allow parent to handle submission
        await onSubmitProp(payload as ProjectFormValues);
      } else {
        // fallback to internal API handling
        if (isEditing) {
          await projectApi.update(project.slug, payload);
        } else {
          await projectApi.create(payload);
        }
      }

      onSuccess?.();
      form.reset();
      // clear local preview states after a successful save
      setThumbnailUrl("");
      setImagesUrls([]);
    } catch (error: any) {
      console.error("Failed to save project:", error);
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.debug("ProjectForm submit validation errors", errors);
    console.debug("ProjectForm values at validation error", form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  key={editorKey}
                  initialValue={
                    field.value
                      ? typeof field.value === "string"
                        ? htmlToDoc(field.value)
                        : (field.value as any)
                      : undefined
                  }
                  onChange={(content: any) => field.onChange(content)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Web Application">
                    Web Application
                  </SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Tool">Tool</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Platform">Platform</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Technologies <span className="text-destructive">*</span>
              </FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
                />
                <Button type="button" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {techFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {form.watch(`technologies.${index}`)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTech(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project Thumbnail <span className="text-destructive">*</span>
              </FormLabel>
              {/* Hidden file input triggered by the styled box */}
              <div className="flex items-start gap-4">
                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                {/* Thumbnail preview card */}
                <div className="relative">
                  {thumbnailUrl ? (
                    <div className="w-48 h-28 rounded overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove thumbnail"
                        title="Remove thumbnail"
                        onClick={() => {
                          setDeletingThumbnail(true);
                          (async () => {
                            const src =
                              thumbnailUrl || form.getValues("thumbnail");
                            if (src && src.includes("/uploads/")) {
                              const ok = await deleteFileOnServer(src);
                              if (!ok) {
                                toast.error(
                                  "Failed to delete thumbnail on server. Try again."
                                );
                                setDeletingThumbnail(false);
                                return;
                              }
                            }
                            setThumbnailFile(null);
                            setThumbnailUrl("");
                            form.setValue("thumbnail", "", {
                              shouldDirty: true,
                              shouldValidate: true,
                            });

                            if (isEditing && project?.slug) {
                              try {
                                await projectApi.update(project.slug, {
                                  thumbnail: "",
                                });
                              } catch (err) {
                                console.error(
                                  "Failed to persist thumbnail removal",
                                  err
                                );
                              }
                            }
                            setDeletingThumbnail(false);
                          })();
                        }}
                        disabled={deletingThumbnail}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md"
                      >
                        {deletingThumbnail ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X size={12} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-input"
                      className="w-48 h-28 rounded border-dashed border-2 border-gray-300 flex flex-col items-center justify-center cursor-pointer text-sm text-gray-600"
                    >
                      <Plus />
                      <div className="text-xs mt-1">1280 x 720</div>
                    </label>
                  )}
                </div>
                {/* Hidden helper for spacing or additional notes if desired */}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Additional Images</FormLabel>
          {/* Hidden input for multiple images, triggered by the add box */}
          <input
            id="images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
          />
          <div className="flex flex-wrap gap-4 items-start">
            {imageFields.map((field, index) => (
              <div key={field.id} className="relative">
                {(() => {
                  const src =
                    (imagesUrls[index] as string) || (field as any).value;
                  return src ? (
                    <img
                      src={src}
                      alt={`Image ${index + 1}`}
                      className="w-28 h-28 object-cover rounded"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-100 rounded" />
                  );
                })()}
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove image"
                  onClick={async () => {
                    // determine source for the image to delete
                    const src =
                      (imagesUrls[index] as string) || (field as any).value;
                    setDeletingImageIndexes((prev) => [...prev, index]);
                    // Attempt to delete file on server if uploaded
                    if (src && src.includes("/uploads/")) {
                      const ok = await deleteFileOnServer(src);
                      if (!ok) {
                        // If failing to delete remotely, warn the user and abort
                        toast.error(
                          "Failed to delete image on server. Try again."
                        );
                        return;
                      }
                    }

                    // remove from field array and local previews
                    removeImage(index);
                    setImagesUrls((prev) => prev.filter((_, i) => i !== index));
                    form.trigger("images");

                    // If editing an existing project, persist the removal immediately
                    if (isEditing && project?.slug) {
                      try {
                        const updatedImages = (form.getValues("images") ||
                          []) as string[];
                        // ensure updatedImages no longer contains src
                        const cleaned = updatedImages.filter((u) => u !== src);
                        await projectApi.update(project.slug, {
                          images: cleaned,
                        });
                      } catch (err) {
                        console.error(
                          "Failed to persist project image removal",
                          err
                        );
                      }
                    }
                    setDeletingImageIndexes((prev) =>
                      prev.filter((i) => i !== index)
                    );
                  }}
                  disabled={deletingImageIndexes.includes(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md"
                >
                  {deletingImageIndexes.includes(index) ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X size={12} />
                  )}
                </button>
              </div>
            ))}

            {/* Add images dashed box */}
            <label
              htmlFor="images-input"
              className="flex items-center justify-center w-28 h-28 rounded border-dashed border-2 border-gray-300 text-gray-500 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <Plus />
                <div className="text-xs mt-1">1920 x 560px</div>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>GitHub URLs</FormLabel>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="Label (e.g., Frontend)"
              value={currentGithubLabel}
              onChange={(e) => setCurrentGithubLabel(e.target.value)}
            />
            <Input
              type="url"
              placeholder="https://github.com/..."
              value={currentGithubUrl}
              onChange={(e) => setCurrentGithubUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddGithub()}
            />
            <Button
              type="button"
              onClick={handleAddGithub}
              className="self-start sm:self-center"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {githubFields.map((field, index) => (
              <Badge
                key={field.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {form.watch(`githubUrls.${index}.label`)}:{" "}
                {form.watch(`githubUrls.${index}.url`)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGithub(index)}
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Video Links</FormLabel>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://youtube.com/..."
              value={currentVideo}
              onChange={(e) => setCurrentVideo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddVideo()}
            />
            <Button type="button" onClick={handleAddVideo}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {videoFields.map((field, index) => (
              <Badge
                key={field.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {form.watch(`videos.${index}`)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideo(index)}
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="demoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://demo.example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
                <FormLabel className="mt-0!">Published</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
                <FormLabel className="mt-0!">Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancel()}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          ) : backUrl ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = backUrl)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
