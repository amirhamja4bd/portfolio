"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Textarea } from "@/components/ui/textarea";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().optional(),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  images: z.string().optional(), // Comma-separated URLs
  tags: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: any;
  onSuccess: () => void;
}

export function BlogFormModal({
  open,
  onOpenChange,
  blog,
  onSuccess,
}: BlogFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!blog;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: "",
      images: "",
      tags: "",
      category: "",
      published: false,
      featured: false,
    },
  });

  // Reset form when blog changes or modal opens/closes
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        content: blog.content || "",
        thumbnail: blog.thumbnail || "",
        images: blog.images?.join(", ") || "",
        tags: blog.tags?.join(", ") || "",
        category: blog.category || "",
        published: blog.published || false,
        featured: blog.featured || false,
      });
    } else {
      form.reset({
        title: "",
        content: "",
        thumbnail: "",
        images: "",
        tags: "",
        category: "",
        published: false,
        featured: false,
      });
    }
  }, [blog, open]); // Added 'open' to dependencies to reset when modal opens

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        images: data.images
          ? data.images
              .split(",")
              .map((img) => img.trim())
              .filter(Boolean)
          : [],
      };

      if (isEditing) {
        await blogApi.update(blog.slug, payload);
      } else {
        await blogApi.create(payload);
      }

      onSuccess();

      // Reset form after successful submission
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save blog:", error);
      alert(error.message || "Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Blog Post" : "Create Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your blog post information below."
              : "Fill in the details to create a new blog post."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog content here..."
                      className="min-h-[400px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write your blog content in plain text
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Web Development, Design"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags separated by commas (e.g., React, TypeScript, Next.js)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate multiple tags with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Main image for the blog post preview
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Images</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate multiple image URLs with commas
                  </FormDescription>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"} Blog Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
