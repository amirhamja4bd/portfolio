"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Linkedin,
  Link as LinkIcon,
  Share2,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import BlogReactions from "@/components/blog-reactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/content";
import MarkdownPreview from "@/lib/MarkdownPreview";
import { timeAgo } from "@/lib/utils";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({
  post,
  relatedPosts,
}: BlogPostClientProps) {
  const htmlContentRef = useRef<HTMLDivElement | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [reactions, setReactions] = useState(
    post.reactionsCount || {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
  );
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);
  // Comments: separate approved comments from optimistic pending comments
  const [approvedComments, setApprovedComments] = useState<any[]>([]);
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });

  // Reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  // Track view (POST /api/blogs/[slug])
  useEffect(() => {
    const doView = async () => {
      try {
        await fetch(`/api/blogs/${post.slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "view" }),
        });
      } catch (e) {
        // ignore
      }
    };
    doView();
  }, [post.slug]);

  // On client mount, fetch visitor-specific post data (visitorReaction, updated counts)
  useEffect(() => {
    const fetchVisitorState = async () => {
      try {
        const res = await fetch(`/api/blogs/${post.slug}`, {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data || json;
        if (data?.reactionsCount) setReactions(data.reactionsCount);
        if (data?.visitorReaction !== undefined)
          setSelectedReaction(data.visitorReaction);
      } catch (e) {
        // ignore
      }
    };
    fetchVisitorState();
  }, [post.slug]);

  // Load comments from API on mount or when slug changes
  useEffect(() => {
    const controller = new AbortController();
    const fetchComments = async () => {
      try {
        // Fetch comments for this slug
        const res = await fetch(`/api/blogs/${post.slug}/comments`, {
          cache: "no-store",
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = await res.json();
        setApprovedComments(json?.data || []);
      } catch (err) {
        // Ignore network errors; keep existing comments in UI
      }
    };
    fetchComments();
    return () => controller.abort();
  }, [post.slug]);

  // Visible comments merges pending optimistic comments and approved
  // server-side comments fetched from the API.
  const visibleComments = [...pendingComments, ...approvedComments];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out "${post.title}" by ${post.author.name}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const postAction = async (payload: object) => {
    const res = await fetch(`/api/blogs/${post.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return res;
  };

  const handleReaction = async (reaction: number) => {
    // optimistic update: update counts and selected state immediately
    const prevReactions = { ...reactions };
    const prevSelected = selectedReaction;
    // compute optimistic new counts
    const newCounts = { ...reactions } as any;
    if (prevSelected === reaction) {
      // toggle off
      newCounts[reaction] = Math.max(0, (newCounts[reaction] || 1) - 1);
      setSelectedReaction(null);
    } else {
      if (prevSelected) {
        newCounts[prevSelected] = Math.max(
          0,
          (newCounts[prevSelected] || 1) - 1
        );
      }
      newCounts[reaction] = (newCounts[reaction] || 0) + 1;
      setSelectedReaction(reaction);
    }
    setReactions(newCounts);

    try {
      const res = await postAction({ action: "reaction", reaction });
      if (res.ok) {
        const body = await res.json();
        // Update with canonical server counts and selected reaction
        setReactions(body?.data?.reactionsCount || {});
        const visitorReaction = body?.data?.visitorReaction ?? null;
        setSelectedReaction(visitorReaction);
      } else {
        // rollback optimistic UI state
        setReactions(prevReactions);
        setSelectedReaction(prevSelected);
        // If the server responded 409 (duplicate key / race), re-sync from server
        if (res.status === 409) {
          try {
            const r = await fetch(`/api/blogs/${post.slug}`, {
              cache: "no-store",
              credentials: "include",
            });
            if (r.ok) {
              const data = await r.json();
              const d = data?.data || data;
              setReactions(d?.reactionsCount || {});
              setSelectedReaction(d?.visitorReaction ?? null);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        const error = await res.json();
        toast.error(error?.message || "Failed to update reaction");
      }
    } catch (e) {
      // network error: rollback
      setReactions(prevReactions);
      setSelectedReaction(prevSelected);
      toast.error("Network error");
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.content) {
      toast.error("Name, email and content are required");
      return;
    }

    try {
      const res = await postAction({
        action: "comment",
        name: commentForm.name,
        email: commentForm.email,
        content: commentForm.content,
      });
      if (res.ok) {
        const body = await res.json();
        const created = body?.data;

        // Append the created comment optimistically so the user sees their
        // feedback immediately. If the comment is pending moderation we
        // show a status label; approved comments will just appear.
        if (created) {
          const resolved = {
            _id: created._id || `temp-${Date.now()}`,
            name: created.name || commentForm.name,
            content: created.content || commentForm.content,
            status: created.status || "pending",
            createdAt: created.createdAt || new Date().toISOString(),
          } as any;
          if ((resolved.status || "pending") === "approved") {
            setApprovedComments((prev) => [resolved, ...prev]);
            // Remove from pending if it was previously added
            setPendingComments((prev) =>
              prev.filter((c) => c._id !== resolved._id)
            );
          } else {
            // Add to pending comments optimistically
            setPendingComments((prev) => [resolved, ...prev]);
          }
        }
        toast.success("Comment submitted");
        setCommentForm({ name: "", email: "", content: "" });
        // Re-fetch approved comments in case moderation processed the
        // comment synchronously and returned it as approved.
        try {
          const r = await fetch(`/api/blogs/${post.slug}/comments`, {
            cache: "no-store",
            credentials: "include",
          });
          if (r.ok) {
            const j = await r.json();
            const approved = j?.data || [];
            // Remove any pending comments that have been approved (match by id)
            setPendingComments((prev) =>
              prev.filter((p) => !approved.some((a: any) => a._id === p._id))
            );
            setApprovedComments(approved);
          }
        } catch (e) {
          // ignore
        }
      } else {
        const err = await res.json();
        toast.error(err?.message || "Failed to submit comment");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mx-auto max-w-6xl">
        <Button asChild variant="ghost" size="sm">
          <Link href="/blogs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
            >
              <Share2 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Share</span>
            </Button>
            {isShareMenuOpen && (
              <div className="absolute right-0 top-12 z-50 flex flex-col gap-2 rounded-lg border bg-background p-3 shadow-lg">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                >
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                >
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="justify-start"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="container py-12">
        <div className="mx-auto max-w-6xl">
          {/* Cover Image */}
          {(post.thumbnail || post.coverImage) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-12 aspect-video overflow-hidden rounded-3xl"
            >
              <img
                src={post.thumbnail || post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />

              {/* No reaction overlay inside image; reactions will be shown after the image */}
            </motion.div>
          )}

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex items-center justify-between gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {timeAgo(post.publishedAt)}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime}
                </span>
              )}
              {post.views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views.toLocaleString()} views
                </span>
              )}
            </div>

            <div className="flex items-center">
              <BlogReactions
                reactions={reactions}
                onReact={handleReaction}
                selectedReaction={selectedReaction}
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 text-xl text-muted-foreground"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </motion.div>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12 flex items-center gap-4 rounded-2xl border bg-muted/50 p-6"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {post.author.role}
              </p>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="prose max-w-none dark:prose-invert prose-neutral"
          >
            <MarkdownPreview
              data={post.content}
              htmlContentRef={htmlContentRef}
            />
          </motion.div>

          {/* Reactions (render after article when there is no cover image) */}
          {!post.thumbnail && !post.coverImage && (
            <div className="mt-8">
              <BlogReactions
                reactions={reactions}
                onReact={handleReaction}
                selectedReaction={selectedReaction}
              />
            </div>
          )}

          {/* Comments */}
          <section className="mt-12">
            <h3 className="mb-4 text-lg font-semibold">Comments</h3>
            <form onSubmit={submitComment} className="mb-6 space-y-2">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded px-3 py-2 border"
                  placeholder="Name"
                  value={commentForm.name}
                  onChange={(e) =>
                    setCommentForm((s) => ({ ...s, name: e.target.value }))
                  }
                />
                <input
                  className="flex-1 rounded px-3 py-2 border"
                  placeholder="Email"
                  value={commentForm.email}
                  onChange={(e) =>
                    setCommentForm((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>
              <textarea
                className="w-full rounded px-3 py-2 border"
                placeholder="Write your comment..."
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm((s) => ({ ...s, content: e.target.value }))
                }
              />
              <div className="flex justify-end">
                <Button type="submit">Submit Comment</Button>
              </div>
            </form>

            {visibleComments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {visibleComments.map((c) => (
                  <div key={c._id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {timeAgo(c.createdAt)}
                      </div>
                      {c.status && c.status !== "approved" && (
                        <div className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          {c.status}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {c.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-3xl font-bold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blogs/${relatedPost.slug}`}
                    className="group rounded-2xl border bg-background p-6 transition-all hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {relatedPost.publishedAt}
                    </div>
                    <h3 className="mb-2 font-semibold leading-tight transition-colors group-hover:text-primary">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Want to discuss this article?
            </h2>
            <p className="mb-6 text-muted-foreground">
              I'd love to hear your thoughts and experiences. Reach out on
              LinkedIn or Twitter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/#contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/blogs">Read More Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
