"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRequireAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ExternalLink,
  FileText,
  Link2,
  Pencil,
  Plus,
  Save,
  Share2,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type SocialAccount = {
  name: string;
  icon: string;
  url: string;
  order: number;
};

type Resume = {
  name: string;
  resumeUrl: string;
  isPrimary: boolean;
  uploadedAt: Date;
};

type SettingsData = {
  _id?: string;
  socialAccounts: SocialAccount[];
  resumes: Resume[];
};

export default function SettingsPage() {
  const { user, loading } = useRequireAuth();
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Social accounts state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [newSocial, setNewSocial] = useState({ name: "", icon: "", url: "" });
  const [editingSocialIdx, setEditingSocialIdx] = useState<number | null>(null);
  const [editingSocial, setEditingSocial] = useState<{
    name: string;
    icon: string;
    url: string;
  }>({ name: "", icon: "", url: "" });
  // Edit social account
  const handleEditSocial = (index: number) => {
    setEditingSocialIdx(index);
    setEditingSocial({
      name: socialAccounts[index].name,
      icon: socialAccounts[index].icon,
      url: socialAccounts[index].url,
    });
  };

  const handleSaveEditSocial = (index: number) => {
    const updated = socialAccounts.map((account, i) =>
      i === index ? { ...account, ...editingSocial } : account
    );
    setSocialAccounts(updated);
    setEditingSocialIdx(null);
    setEditingSocial({ name: "", icon: "", url: "" });
  };

  const handleCancelEditSocial = () => {
    setEditingSocialIdx(null);
    setEditingSocial({ name: "", icon: "", url: "" });
  };

  // Resumes state
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [newResumeName, setNewResumeName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingResumeIdx, setEditingResumeIdx] = useState<number | null>(null);
  const [editingResumeName, setEditingResumeName] = useState("");
  const [changingPdfIdx, setChangingPdfIdx] = useState<number | null>(null);
  const [changingPdfLoading, setChangingPdfLoading] = useState(false);
  // Change PDF for resume
  const handleChangePdf = (index: number) => {
    setChangingPdfIdx(index);
  };

  const handleCancelChangePdf = () => {
    setChangingPdfIdx(null);
  };

  const handleChangePdfFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }
    setChangingPdfLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/settings/upload-resume", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadResult = await uploadResponse.json();
      const updated = resumes.map((resume, i) =>
        i === index
          ? {
              ...resume,
              resumeUrl: uploadResult.data.url,
              uploadedAt: new Date(),
            }
          : resume
      );
      setResumes(updated);
      toast({ title: "Success", description: "PDF updated successfully" });
      setChangingPdfIdx(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update PDF",
        variant: "destructive",
      });
    } finally {
      setChangingPdfLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await fetch("/api/settings");

      if (response.ok) {
        const result = await response.json();
        setSettingsData(result.data);
        setSocialAccounts(result.data.socialAccounts || []);
        setResumes(result.data.resumes || []);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast("Failed to load settings");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleAddSocialAccount = () => {
    if (!newSocial.name || !newSocial.url) {
      // Short string-style toast
      toast("Please provide name and URL for the social account");
      return;
    }

    const newAccount: SocialAccount = {
      ...newSocial,
      order: socialAccounts.length + 1,
    };

    setSocialAccounts([...socialAccounts, newAccount]);
    setNewSocial({ name: "", icon: "", url: "" });
  };

  const handleRemoveSocialAccount = (index: number) => {
    const updated = socialAccounts.filter((_, i) => i !== index);
    // Reorder remaining items
    const reordered = updated.map((account, i) => ({
      ...account,
      order: i + 1,
    }));
    setSocialAccounts(reordered);
  };

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      e.target.value = ""; // Reset file input
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveResume = (index: number) => {
    const updated = resumes.filter((_, i) => i !== index);
    // If we removed the primary, make the first one primary if any exist
    if (updated.length > 0 && !updated.some((r) => r.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setResumes(updated);
  };

  const handleSetPrimaryResume = (index: number) => {
    const updated = resumes.map((resume, i) => ({
      ...resume,
      isPrimary: i === index,
    }));
    setResumes(updated);
  };

  // Edit resume name
  const handleEditResume = (index: number) => {
    setEditingResumeIdx(index);
    setEditingResumeName(resumes[index].name);
  };

  const handleSaveEditResume = (index: number) => {
    const updated = resumes.map((resume, i) =>
      i === index ? { ...resume, name: editingResumeName } : resume
    );
    setResumes(updated);
    setEditingResumeIdx(null);
    setEditingResumeName("");
  };

  const handleCancelEditResume = () => {
    setEditingResumeIdx(null);
    setEditingResumeName("");
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // First, upload the resume if a file is selected
      let updatedResumes = [...resumes];
      if (selectedFile && newResumeName) {
        setUploadingResume(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/settings/upload-resume", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Resume upload failed");
        }

        const uploadResult = await uploadResponse.json();

        const newResume: Resume = {
          name: newResumeName,
          resumeUrl: uploadResult.data.url,
          isPrimary: resumes.length === 0, // First resume is primary by default
          uploadedAt: new Date(),
        };

        updatedResumes = [...resumes, newResume];
        setResumes(updatedResumes);
        setNewResumeName("");
        setSelectedFile(null);
        setUploadingResume(false);

        // Clear file input visually
        const fileInput = document.getElementById(
          "resume-upload-input"
        ) as HTMLInputElement | null;
        if (fileInput) fileInput.value = "";
      }

      // Ensure only one resume is marked as primary
      const primaryCount = updatedResumes.filter((r) => r.isPrimary).length;
      if (primaryCount === 0 && updatedResumes.length > 0) {
        // If no primary, set the first one as primary
        updatedResumes[0].isPrimary = true;
      } else if (primaryCount > 1) {
        // If multiple primaries, keep only the first one
        let foundPrimary = false;
        updatedResumes = updatedResumes.map((resume) => ({
          ...resume,
          isPrimary:
            !foundPrimary && resume.isPrimary ? (foundPrimary = true) : false,
        }));
      }

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialAccounts,
          resumes: updatedResumes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const result = await response.json();
      setSettingsData(result.data);

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Save settings error:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setUploadingResume(false);
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

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-base text-muted-foreground">
            Manage your social media profiles and resume files
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </motion.div>

      {/* Content */}
      {loadingSettings ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Social Media Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      Social Media Accounts
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Connect and manage your social media profiles
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {socialAccounts.length}{" "}
                    {socialAccounts.length === 1 ? "Account" : "Accounts"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Social Accounts */}
                {socialAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {socialAccounts.map((account, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group relative"
                        >
                          <div className="flex items-start gap-3 p-4 rounded-lg border-2 bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-200">
                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Link2 className="h-4 w-4 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              {editingSocialIdx === index ? (
                                <div className="space-y-3">
                                  <div className="grid gap-3">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                                        Platform Name
                                      </Label>
                                      <Input
                                        className="h-9"
                                        value={editingSocial.name}
                                        onChange={(e) =>
                                          setEditingSocial({
                                            ...editingSocial,
                                            name: e.target.value,
                                          })
                                        }
                                        placeholder="LinkedIn"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                                        Icon Class
                                      </Label>
                                      <Input
                                        className="h-9"
                                        value={editingSocial.icon}
                                        onChange={(e) =>
                                          setEditingSocial({
                                            ...editingSocial,
                                            icon: e.target.value,
                                          })
                                        }
                                        placeholder="fab fa-linkedin"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                                        Profile URL
                                      </Label>
                                      <Input
                                        className="h-9"
                                        value={editingSocial.url}
                                        onChange={(e) =>
                                          setEditingSocial({
                                            ...editingSocial,
                                            url: e.target.value,
                                          })
                                        }
                                        placeholder="https://linkedin.com/in/username"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSaveEditSocial(index)
                                      }
                                      className="gap-1"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelEditSocial}
                                      className="gap-1"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-semibold text-base">
                                        {account.name}
                                      </h4>
                                      {account.icon && (
                                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                          {account.icon}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <a
                                    href={account.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline transition-colors truncate max-w-full"
                                  >
                                    <span className="truncate">
                                      {account.url}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                  </a>
                                </>
                              )}
                            </div>

                            {editingSocialIdx !== index && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditSocial(index)}
                                  className="h-8 w-8 p-0"
                                  aria-label="Edit Social"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveSocialAccount(index)
                                  }
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  aria-label="Delete Social"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Share2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      No social accounts yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Add your first social media profile to get started
                    </p>
                  </div>
                )}

                <Separator />

                {/* Add New Social Account */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">
                      Add New Social Account
                    </Label>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Platform Name
                      </Label>
                      <Input
                        placeholder="e.g., LinkedIn, Twitter, GitHub"
                        value={newSocial.name}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, name: e.target.value })
                        }
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Icon Class (Optional)
                      </Label>
                      <Input
                        placeholder="e.g., fab fa-linkedin, fab fa-github"
                        value={newSocial.icon}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, icon: e.target.value })
                        }
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Profile URL
                      </Label>
                      <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={newSocial.url}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, url: e.target.value })
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddSocialAccount}
                    variant="outline"
                    className="w-full h-10 border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resumes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Resume Files</CardTitle>
                    <CardDescription className="mt-1">
                      Upload and manage your resume files (PDF format only)
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {resumes.length}{" "}
                    {resumes.length === 1 ? "Resume" : "Resumes"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Resumes */}
                {resumes.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {resumes.map((resume, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group relative"
                        >
                          <div className="flex items-start gap-3 p-4 rounded-lg border-2 bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-200">
                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              {editingResumeIdx === index ? (
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                                      Resume Name
                                    </Label>
                                    <Input
                                      className="h-9"
                                      value={editingResumeName}
                                      onChange={(e) =>
                                        setEditingResumeName(e.target.value)
                                      }
                                      placeholder="e.g., General Tech Resume"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSaveEditResume(index)
                                      }
                                      className="gap-1"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelEditResume}
                                      className="gap-1"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-base">
                                      {resume.name}
                                    </h4>
                                    {resume.isPrimary && (
                                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                                        <Star className="h-3 w-3 fill-current mr-1" />
                                        Primary
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                                    <a
                                      href={resume.resumeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline transition-colors"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      View PDF
                                    </a>
                                    <span className="text-muted-foreground">
                                      •
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                        {(() => {
                                          try {
                                            const urlParts =
                                              resume.resumeUrl.split("/");
                                            const filename =
                                              urlParts[urlParts.length - 1] ||
                                              "PDF";
                                            return filename.length > 20
                                              ? filename.substring(0, 20) +
                                                  "..."
                                              : filename;
                                          } catch {
                                            return "PDF";
                                          }
                                        })()}
                                      </span>
                                    </span>
                                  </div>

                                  {changingPdfIdx === index && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="pt-3 border-t"
                                    >
                                      <Label className="text-xs text-muted-foreground mb-2 block">
                                        Upload New PDF File
                                      </Label>
                                      <div className="flex gap-2 items-center">
                                        <Input
                                          type="file"
                                          accept=".pdf"
                                          onChange={(e) =>
                                            handleChangePdfFile(e, index)
                                          }
                                          disabled={changingPdfLoading}
                                          className="h-9 text-sm"
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleCancelChangePdf}
                                          disabled={changingPdfLoading}
                                          className="shrink-0"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                      {changingPdfLoading && (
                                        <div className="flex items-center gap-2 mt-2">
                                          <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-primary animate-pulse"
                                              style={{ width: "60%" }}
                                            />
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            Uploading...
                                          </span>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </>
                              )}
                            </div>

                            {editingResumeIdx !== index &&
                              changingPdfIdx !== index && (
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditResume(index)}
                                      className="h-8 w-8 p-0"
                                      aria-label="Edit Resume"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveResume(index)}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      aria-label="Delete Resume"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="flex gap-1">
                                    {!resume.isPrimary && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleSetPrimaryResume(index)
                                        }
                                        className="text-xs h-8 px-2 whitespace-nowrap"
                                      >
                                        <Star className="h-3 w-3 mr-1" />
                                        Set Primary
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleChangePdf(index)}
                                      className="text-xs h-8 px-2 whitespace-nowrap"
                                    >
                                      <Upload className="h-3 w-3 mr-1" />
                                      Change PDF
                                    </Button>
                                  </div>
                                </div>
                              )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      No resumes uploaded
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Upload your first resume to get started
                    </p>
                  </div>
                )}

                <Separator />

                {/* Upload New Resume */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">
                      Upload New Resume
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Resume Name
                      </Label>
                      <Input
                        placeholder="e.g., General Tech Resume, Frontend Developer CV"
                        value={newResumeName}
                        onChange={(e) => setNewResumeName(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        PDF File
                      </Label>
                      <div className="relative">
                        <Input
                          id="resume-upload-input"
                          type="file"
                          accept=".pdf"
                          onChange={handleUploadResume}
                          className="h-10"
                        />
                      </div>
                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground font-medium flex-1 truncate">
                            {selectedFile.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    {!selectedFile && !newResumeName && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 text-sm">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-muted-foreground">
                          Please provide both a name and select a PDF file, then
                          click "Save All Changes" to upload.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
