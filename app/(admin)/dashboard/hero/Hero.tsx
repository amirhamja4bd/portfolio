"use client";

import { HeroFormModal } from "@/components/admin/hero-form-modal";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { AlertCircle, Eye, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type SocialLink = {
  icon: string;
  title: string;
  link: string;
};

type HeroData = {
  heading: {
    name: string;
    title: string;
  };
  badge: {
    text: string;
  };
  bio: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  socialLinks: SocialLink[];
  techStack: string[];
  published: boolean;
};

export default function HeroPage() {
  const { user, loading } = useRequireAuth();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHeroData();
    }
  }, [user]);

  const fetchHeroData = async () => {
    try {
      setLoadingHero(true);
      const response = await fetch("/api/hero");

      if (response.ok) {
        const result = await response.json();
        setHeroData(result.data);
      } else {
        setHeroData(null);
      }
    } catch (error) {
      console.error("Failed to fetch hero data:", error);
      setHeroData(null);
    } finally {
      setLoadingHero(false);
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchHeroData();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
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
            Hero Section
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your portfolio hero section
          </p>
        </div>
        {heroData && (
          <div className="flex gap-2 self-start sm:self-auto">
            <Button onClick={togglePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loadingHero ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading hero data...</p>
          </div>
        ) : !heroData ? (
          // Not Found State
          <div className="rounded-xl border bg-card p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  No Hero Section Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your hero section to showcase your
                  profile.
                </p>
              </div>
              <Button onClick={handleCreate} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Hero Section
              </Button>
            </div>
          </div>
        ) : (
          // Show Data
          <div className="space-y-6">
            {/* Preview Toggle */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border bg-card p-6 overflow-hidden"
              >
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <div className="bg-background rounded-lg p-6 border">
                  <iframe
                    src="/"
                    className="w-full h-[600px] rounded-lg"
                    title="Hero Section Preview"
                  />
                </div>
              </motion.div>
            )}

            {/* Hero Data Display */}
            <div className="rounded-xl border bg-card">
              {/* Basic Info */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {heroData.heading.name}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {heroData.heading.title}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      heroData.published
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {heroData.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  {heroData.badge.text}
                </div>
              </div>

              {/* Bio */}
              <div className="p-6 border-b">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                  Bio
                </h3>
                <p className="text-foreground">{heroData.bio}</p>
              </div>

              {/* CTAs */}
              <div className="p-6 border-b">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">
                  Call to Actions
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Primary CTA
                    </div>
                    <div className="font-medium">
                      {heroData.cta.primary.text}
                    </div>
                    <a
                      href={heroData.cta.primary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {heroData.cta.primary.href}
                    </a>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Secondary CTA
                    </div>
                    <div className="font-medium">
                      {heroData.cta.secondary.text}
                    </div>
                    <a
                      href={heroData.cta.secondary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {heroData.cta.secondary.href}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 border-b">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-2">
                  {heroData.socialLinks.map((social: SocialLink) => (
                    <a
                      key={social.title}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted transition-colors"
                    >
                      <span className="text-xs font-medium">{social.icon}</span>
                      <span className="text-sm">{social.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="p-6">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {heroData.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <HeroFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        heroData={heroData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
