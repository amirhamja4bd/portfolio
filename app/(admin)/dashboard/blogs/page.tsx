"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/contexts/auth-context";
import { blogApi } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Calendar, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BlogsPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await blogApi.getAll({ all: true, limit: 100 });
      setBlogs(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleCreate = () => {
    router.push("/dashboard/blogs/form");
  };

  const handleEdit = (blog: any) => {
    router.push(`/dashboard/blogs/form?slug=${blog.slug}`);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(
    null
  );

  const handleDelete = (slug: string) => {
    setPendingDeleteSlug(slug);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteSlug) return;
    try {
      await blogApi.delete(pendingDeleteSlug);
      toast.success("Blog post deleted");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteSlug(null);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your blog articles and content
          </p>
        </div>
        <Button onClick={handleCreate} className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Blogs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loadingBlogs ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No blog posts found.</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create your first blog post
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group rounded-xl border bg-card p-5 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-44 sm:w-32 sm:h-20 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2 w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2 wrap-break-word">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 wrap-break-word">
                          {blog.category} • {blog.tags?.slice(0, 3).join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0 sm:ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(blog)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(blog.slug)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {blog.category}
                      </span>
                      {blog.published ? (
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                          Draft
                        </span>
                      )}
                      {blog.featured && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                          Featured
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {blog.views || 0} views
                      </span>
                      {blog.tags && blog.tags.length > 0 && (
                        <span className="max-w-full block overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-normal wrap-break-word">
                          {blog.tags.slice(0, 3).join(", ")}
                          {blog.tags.length > 3 && ` +${blog.tags.length - 3}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
