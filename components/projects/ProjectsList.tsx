"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { projectApi } from "@/lib/api-client";
import sanitizeHtml from "@/lib/sanitizeHtml";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = [
  "Web Application",
  "Mobile App",
  "API",
  "Tool",
  "Library",
  "Platform",
  "Other",
];

export default function ProjectsList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryKey = useMemo(
    () => [
      "projects",
      {
        page,
        limit,
        search: debouncedSearch,
        category,
        featured: featuredOnly,
        sort,
      },
    ],
    [page, limit, debouncedSearch, category, featuredOnly, sort]
  );
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKey as any,
    queryFn: async () => {
      const resp = await projectApi.getAll({
        page,
        limit,
        search: debouncedSearch || undefined,
        category: category || undefined,
        featured: featuredOnly || undefined,
        sort: sort || undefined,
      });
      return resp;
    },
  });

  // Reset to page 1 when search/category/featured filters change (debounced applied)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, featuredOnly]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // `data` is the API wrapper: { success, message, data: { data: [], pagination } }
  const apiResult = data ?? undefined;
  const projects = apiResult?.data?.data ?? [];
  const pagination = apiResult?.data?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  // Server-sorted data, fallback to as-is
  const sortedProjects = projects;

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />
          <Select
            onValueChange={(v) =>
              setCategory(v === "all" ? undefined : (v as string))
            }
            defaultValue={category}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="h-4 w-4 rounded border"
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Select onValueChange={(v) => setSort(v)} defaultValue={sort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Build content programmatically to avoid nested JSX ternaries */}
      {(() => {
        if (isLoading) {
          return (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg h-80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <div className="h-48 bg-linear-to-br from-slate-800 to-slate-900 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          );
        }
        if (isError) {
          return (
            <div className="text-center py-12 text-destructive">
              Failed to load projects.
            </div>
          );
        }

        if (sortedProjects.length === 0) {
          return (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          );
        }

        // Render grid + pagination
        return (
          <>
            <motion.div
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {sortedProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.slug}
                  className="group relative rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <div className="h-48 w-full relative bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden">
                      <Image
                        src={project.thumbnail || "/placeholder-project.jpg"}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="text-yellow-500 text-sm font-medium bg-yellow-500/10 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(project.summary),
                          }}
                        />
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(project.technologies) &&
                          project.technologies.slice(0, 3).map((t: string) => (
                            <span
                              key={t}
                              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-muted-foreground">
                Showing {sortedProjects.length} of {pagination.total} projects
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <span className="text-sm">
                  Page {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
