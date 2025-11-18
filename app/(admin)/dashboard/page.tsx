"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  FileText,
  Mail,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/contexts/auth-context";
import { blogApi, contactApi, projectApi } from "@/lib/api-client";

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      // Fetch all data in parallel
      const [blogsRes, projectsRes, messagesRes] = await Promise.all([
        blogApi.getAll({ all: true, limit: 1 }),
        projectApi.getAll({ all: true, limit: 1 }),
        contactApi.getAll({ limit: 1 }),
      ]);

      setStats({
        totalBlogs: blogsRes.data?.pagination?.total || 0,
        publishedBlogs:
          blogsRes.data?.data?.filter((p: any) => p.published)?.length || 0,
        totalProjects: projectsRes.data?.pagination?.total || 0,
        totalMessages: messagesRes.data?.pagination?.total || 0,
        unreadMessages:
          messagesRes.data?.data?.filter((m: any) => m.status === "unread")
            ?.length || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoadingStats(false);
    }
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

  const statCards = [
    {
      title: "Total Blog Posts",
      value: stats.totalBlogs,
      subtitle: `${stats.publishedBlogs} published`,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/blogs",
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      subtitle: "Portfolio items",
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/projects",
    },
    {
      title: "Messages",
      value: stats.totalMessages,
      subtitle: `${stats.unreadMessages} unread`,
      icon: Mail,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/messages",
    },
    {
      title: "Site Activity",
      value: "Active",
      subtitle: "All systems operational",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const quickActions = [
    {
      title: "New Blog Post",
      description: "Create a new blog article",
      icon: FileText,
      href: "/blogs/new",
    },
    {
      title: "Add Project",
      description: "Showcase a new project",
      icon: Briefcase,
      href: "/projects/new",
    },
    {
      title: "View Messages",
      description: "Check contact submissions",
      icon: Mail,
      href: "/messages",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Here's what's happening with your portfolio today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={stat.href || "#"}
                className={`block rounded-xl border bg-card p-4 sm:p-6 transition-all hover:shadow-lg hover:scale-[1.02] ${
                  stat.href ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {loadingStats ? (
                        <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg p-2 sm:p-3 shrink-0 ${stat.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="group flex items-start space-x-4 rounded-xl border bg-card p-4 sm:p-6 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border bg-card p-4 sm:p-6"
      >
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="self-start sm:self-auto">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 text-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Account Activity</p>
              <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">
                Last login:{" "}
                {new Date(user.lastLogin || user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
