"use client";

import Editor from "@/components/editor/editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { blogApi } from "@/lib/api-client";
import docToHtml from "@/lib/doc-to-html";
import htmlToDoc from "@/lib/html-to-doc";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/core";
import {
  Frown,
  Heart,
  Loader2,
  Plus,
  Star,
  ThumbsUp,
  X,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().optional(),
  // Allow relative upload paths (e.g., /uploads/abc.jpg) as well as empty string
  thumbnail: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string().min(1)).optional(),
  category: z.string().min(1, "Category is required"),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export default function BlogFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const isEditing = !!slug;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState<string>("");
  const [stats, setStats] = useState({
    views: 0,
    reactionsCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // Default empty document for Novel editor
  const defaultDoc: JSONContent = {
    type: "doc",
    content: [],
  };

  // Store editor content in state
  // Keep editor JSON for initial rendering; content string is canonical in DB
  const [editorJson, setEditorJson] = useState<JSONContent>(defaultDoc);
  const [currentTag, setCurrentTag] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const [deletingImageIndexes, setDeletingImageIndexes] = useState<number[]>(
    []
  );
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      images: [],
      tags: [],
      category: "",
      published: false,
      featured: false,
    },
  });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control as any,
    name: "tags",
  });
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control as any,
    name: "images",
  });

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    const url = data?.data?.url || data?.url;
    if (!url) throw new Error("Upload failed: no url returned");
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
        form.setValue("thumbnail", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.trigger("thumbnail");
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadFile(files[i]);
          urls.push(url);
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
      urls.forEach((u) => appendImage(u as any));
      setImagesUrls((prev) => [...prev, ...urls]);
      form.trigger("images");
      setIsUploading(false);
    }
  };

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

  const handleAddTag = () => {
    if (currentTag.trim()) {
      appendTag(currentTag.trim());
      setCurrentTag("");
    }
  };

  // Mount check for client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load existing blog when editing
  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setEditorJson(defaultDoc);
        return;
      }

      try {
        setIsLoading(true);
        const response = await blogApi.getBySlug(slug);
        const blog = response.data;

        if (blog) {
          // Accept both legacy doc JSON and new HTML string content
          let contentString: string = "";
          let initialDoc: any = defaultDoc;
          if (typeof blog.content === "string") {
            contentString = blog.content;
            try {
              initialDoc = htmlToDoc(blog.content);
            } catch (e) {
              initialDoc = defaultDoc;
            }
          } else if (blog.content && blog.content.type === "doc") {
            // Convert doc JSON to HTML string for form storage
            contentString = docToHtml(blog.content as any);
            initialDoc = blog.content;
          }

          form.reset({
            title: blog.title || "",
            content: contentString,
            thumbnail: blog.thumbnail || "",
            images: blog.images || [],
            tags: blog.tags || [],
            category: blog.category || "",
            published: blog.published || false,
            featured: blog.featured || false,
          });
          setThumbnailUrl(blog.thumbnail || "");
          setImagesUrls(blog.images || []);

          setStats({
            views: blog.views || blog.viewsCount || 0,
            reactionsCount: blog.reactionsCount || {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            },
          });

          setContent(contentString);
          setEditorJson(initialDoc);
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        toast.error("Failed to load blog post");
        router.push("/dashboard/blogs");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [slug, router]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        // Ensure we always send a string HTML payload
        content:
          typeof data.content === "string" ? data.content : content || "",
        tags: data.tags || [],
        images: data.images || [],
      };

      if (isEditing) {
        await blogApi.update(slug!, payload);
      } else {
        await blogApi.create(payload);
      }

      router.push("/dashboard/blogs");
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error(error.message || "Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>
        {isEditing && (
          <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
            <div className="rounded-md border px-3 py-2">
              Views: <span className="font-semibold">{stats.views || 0}</span>
            </div>
            <div className="rounded-md border px-3 py-2">
              Reactions:
              <div className="ml-2 flex items-center gap-2">
                <span className="text-xs flex items-center gap-2">
                  <ThumbsUp width={14} height={14} color="#1877f2" />{" "}
                  {stats.reactionsCount?.[1] || 0}
                </span>
                <span className="text-xs flex items-center gap-2">
                  <Heart width={14} height={14} color="#ef4444" />{" "}
                  {stats.reactionsCount?.[2] || 0}
                </span>
                <span className="text-xs flex items-center gap-2">
                  <Star width={14} height={14} color="#f59e0b" />{" "}
                  {stats.reactionsCount?.[3] || 0}
                </span>
                <span className="text-xs flex items-center gap-2">
                  <Frown width={14} height={14} color="#6b7280" />{" "}
                  {stats.reactionsCount?.[4] || 0}
                </span>
                <span className="text-xs flex items-center gap-2">
                  <Zap width={14} height={14} color="#ff8a00" />{" "}
                  {stats.reactionsCount?.[5] || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter an engaging blog title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content *</FormLabel>
                  <FormControl>
                    <Editor
                      initialValue={
                        field.value
                          ? typeof field.value === "string"
                            ? htmlToDoc(field.value)
                            : (field.value as any)
                          : undefined
                      }
                      onChange={(html: string) => {
                        setContent(html);
                        form.setValue("content", html, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Next.js, AI, Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., React"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagFields.map((t, idx) => (
                      <Badge
                        key={t.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {form.watch(`tags.${idx}`)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(idx)}
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

            {/* Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {/* Upload control */}
                      <div className="w-36">
                        <input
                          id="thumbnail-input"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                        {thumbnailUrl ? (
                          <div className="relative rounded overflow-hidden border">
                            <img
                              src={thumbnailUrl}
                              alt="Thumbnail"
                              className="h-24 w-full object-cover"
                            />
                            <button
                              type="button"
                              aria-label="Remove thumbnail"
                              title="Remove thumbnail"
                              className="absolute right-1 top-1 rounded-full bg-white p-1 text-sm shadow"
                              onClick={async () => {
                                setDeletingThumbnail(true);
                                try {
                                  const src =
                                    thumbnailUrl || form.getValues("thumbnail");
                                  if (src && src.includes("/uploads/")) {
                                    const ok = await deleteFileOnServer(
                                      src as string
                                    );
                                    if (!ok) {
                                      toast.error(
                                        "Failed to delete thumbnail on server. Try again."
                                      );
                                      setDeletingThumbnail(false);
                                      return;
                                    }
                                  }
                                } catch (e) {
                                  // ignore
                                }
                                setThumbnailUrl("");
                                setThumbnailFile(null);
                                form.setValue("thumbnail", "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                form.trigger("thumbnail");
                                if (isEditing && slug) {
                                  try {
                                    await blogApi.update(slug, {
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
                              }}
                            >
                              {deletingThumbnail ? (
                                <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                              ) : (
                                <X className="h-4 w-4 text-destructive" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="thumbnail-input"
                            className="relative flex cursor-pointer items-center justify-center h-24 rounded border-dashed border-2 border-muted p-1 text-sm text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Plus className="h-5 w-5" />
                              <span>Upload</span>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a thumbnail image for your blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Images</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <input
                        id="images-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                        {imageFields.map((imageField, idx) => {
                          const src =
                            (imagesUrls[idx] as string) ||
                            (imageField as any).value;
                          return (
                            <div
                              key={imageField.id}
                              className="relative rounded overflow-hidden border"
                            >
                              {src ? (
                                <img
                                  src={src}
                                  className="h-24 w-full object-cover"
                                />
                              ) : (
                                <div className="h-24 w-full bg-gray-100" />
                              )}
                              <button
                                type="button"
                                className="absolute right-1 top-1 rounded-full bg-white p-1 text-sm shadow"
                                onClick={async () => {
                                  setDeletingImageIndexes((prev) => [
                                    ...prev,
                                    idx,
                                  ]);
                                  try {
                                    if (src && src.includes("/uploads/")) {
                                      const ok = await deleteFileOnServer(src);
                                      if (!ok) {
                                        toast.error(
                                          "Failed to delete image on server. Try again."
                                        );
                                        setDeletingImageIndexes((prev) =>
                                          prev.filter((i) => i !== idx)
                                        );
                                        return;
                                      }
                                    }
                                  } catch (e) {
                                    // ignore
                                  }
                                  removeImage(idx);
                                  setImagesUrls((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  );
                                  form.trigger("images");
                                  if (isEditing && slug) {
                                    try {
                                      const updatedImages = (form.getValues(
                                        "images"
                                      ) || []) as string[];
                                      const cleaned = updatedImages.filter(
                                        (u) => u !== src
                                      );
                                      await blogApi.update(slug, {
                                        images: cleaned,
                                      });
                                    } catch (err) {
                                      console.error(
                                        "Failed to persist blog image removal",
                                        err
                                      );
                                    }
                                  }
                                  setDeletingImageIndexes((prev) =>
                                    prev.filter((i) => i !== idx)
                                  );
                                }}
                              >
                                {deletingImageIndexes.includes(idx) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 text-destructive" />
                                )}
                              </button>
                            </div>
                          );
                        })}

                        {/* Add placeholder card */}
                        <label
                          htmlFor="images-input"
                          className="flex cursor-pointer items-center justify-center h-24 rounded border-dashed border-2 border-muted p-1 text-sm text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Plus className="h-5 w-5" />
                            <span>Upload</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload image files to attach to the blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggles */}
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Published
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Featured
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/blogs")}
                disabled={isSubmitting}
                className="w-fit"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-fit">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"} Blog Post
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
