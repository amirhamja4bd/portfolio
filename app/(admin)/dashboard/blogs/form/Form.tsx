"use client";

import Editor from "@/components/editor/editor";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/core";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.any().optional(),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  images: z.string().optional(),
  tags: z.string().optional(),
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

  // Default empty document for Novel editor
  const defaultDoc: JSONContent = {
    type: "doc",
    content: [],
  };

  // Store editor content in state
  const [editorContent, setEditorContent] = useState<JSONContent>(defaultDoc);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: defaultDoc,
      thumbnail: "",
      images: "",
      tags: "",
      category: "",
      published: false,
      featured: false,
    },
  });

  // Mount check for client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load existing blog when editing
  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setEditorContent(defaultDoc);
        return;
      }

      try {
        setIsLoading(true);
        const response = await blogApi.getBySlug(slug);
        const blog = response.data;

        if (blog) {
          const content =
            blog.content && blog.content.type === "doc"
              ? blog.content
              : defaultDoc;

          form.reset({
            title: blog.title || "",
            content,
            thumbnail: blog.thumbnail || "",
            images: blog.images?.join(", ") || "",
            tags: blog.tags?.join(", ") || "",
            category: blog.category || "",
            published: blog.published || false,
            featured: blog.featured || false,
          });

          setEditorContent(content);
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
        content: editorContent || defaultDoc,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        images: data.images
          ? data.images
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : [],
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
                    <Editor initialValue={defaultValue} onChange={setContent} />
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
                  <FormControl>
                    <Input
                      placeholder="react, typescript, tailwind, nextjs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Separate tags with commas</FormDescription>
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
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/thumbnail.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Featured image for the blog post
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
                  <FormLabel>Additional Image URLs</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://img1.jpg, https://img2.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of image URLs
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
