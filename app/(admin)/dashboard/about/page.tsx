"use client";

import { AboutFormModal } from "@/components/admin/about-form-modal";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { AlertCircle, Eye, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type InfoCard = {
  title: string;
  description: string;
};

type SnapshotItem = {
  label: string;
  value: string;
};

type EducationItem = {
  school: string;
  degree: string;
  year: string;
};

type CertificationItem = {
  name: string;
  issuer: string;
  year: string;
};

type InterestItem = {
  icon: string;
  title: string;
  description: string;
};

type AboutData = {
  _id: string;
  title: string;
  description: string;
  infoCards: InfoCard[];
  snapshot: {
    title: string;
    items: SnapshotItem[];
  };
  education: {
    title: string;
    items: EducationItem[];
  };
  certifications: {
    title: string;
    items: CertificationItem[];
  };
  interests: {
    title: string;
    description: string;
    items: InterestItem[];
  };
  published: boolean;
};

export default function AboutPage() {
  const { user, loading } = useRequireAuth();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAboutData();
    }
  }, [user]);

  const fetchAboutData = async () => {
    try {
      setLoadingAbout(true);
      const response = await fetch("/api/about");

      if (response.ok) {
        const result = await response.json();
        setAboutData(result.data);
      } else {
        setAboutData(null);
      }
    } catch (error) {
      console.error("Failed to fetch about data:", error);
      setAboutData(null);
    } finally {
      setLoadingAbout(false);
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
    fetchAboutData();
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
            About Section
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your portfolio about section
          </p>
        </div>
        {aboutData && (
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
        {loadingAbout ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading about data...</p>
          </div>
        ) : !aboutData ? (
          // Not Found State
          <div className="rounded-xl border bg-card p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  No About Section Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your about section to showcase your
                  background.
                </p>
              </div>
              <Button onClick={handleCreate} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create About Section
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
                    src="/#about"
                    className="w-full h-[600px] rounded-lg"
                    title="About Section Preview"
                  />
                </div>
              </motion.div>
            )}

            {/* About Data Display */}
            <div className="rounded-xl border bg-card">
              {/* Basic Info */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {aboutData.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {aboutData.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      aboutData.published
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {aboutData.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Info Cards</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {aboutData.infoCards.map((card, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-background"
                    >
                      <h4 className="font-medium mb-2">{card.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Snapshot */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  {aboutData.snapshot.title}
                </h3>
                <div className="space-y-3">
                  {aboutData.snapshot.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 p-3 border rounded-lg bg-background"
                    >
                      <span className="font-medium">{item.label}:</span>
                      <span className="text-muted-foreground text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  {aboutData.education.title}
                </h3>
                <div className="space-y-3">
                  {aboutData.education.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-background"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{item.school}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.degree}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  {aboutData.certifications.title}
                </h3>
                <div className="space-y-3">
                  {aboutData.certifications.items.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-background"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {cert.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {aboutData.interests.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {aboutData.interests.description}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {aboutData.interests.items.map((interest, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-background"
                    >
                      <div className="text-2xl mb-2">{interest.icon}</div>
                      <h4 className="font-medium text-sm">{interest.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {interest.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Form Modal */}
      <AboutFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        aboutData={aboutData}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
