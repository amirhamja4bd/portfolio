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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skillApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const skillFormSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.enum([
    "frontend",
    "backend",
    "devops",
    "database",
    "tooling",
    "leadership",
  ]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  proficiency: z.coerce
    .number()
    .min(0, "Proficiency must be at least 0")
    .max(100, "Proficiency cannot exceed 100"),
  icon: z.string().min(1, "Icon is required"),
  logo: z.string().optional(),
  experienceYear: z.string().optional(),
  isActive: z.boolean().optional(),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

interface SkillFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: any;
  onSuccess: () => void;
}

export function SkillFormModal({
  open,
  onOpenChange,
  skill,
  onSuccess,
}: SkillFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "frontend",
      experienceLevel: "intermediate",
      proficiency: 50,
      icon: "",
      logo: "",
      experienceYear: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (skill) {
      const experienceYearValue = skill.experienceYear
        ? new Date(skill.experienceYear).toISOString().split("T")[0]
        : "";

      form.reset({
        name: skill.name || "",
        category: skill.category || "frontend",
        experienceLevel: skill.experienceLevel || "intermediate",
        proficiency: skill.proficiency || 50,
        icon: skill.icon || "",
        logo: skill.logo || "",
        experienceYear: experienceYearValue,
        isActive: skill.isActive !== false,
      });
      setLogoPreview(skill.logo || "");
    } else {
      form.reset({
        name: "",
        category: "frontend",
        experienceLevel: "intermediate",
        proficiency: 50,
        icon: "",
        logo: "",
        experienceYear: "",
        isActive: true,
      });
      setLogoPreview("");
    }
  }, [skill, form]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "skills");

      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (data.success && data.data?.url) {
        // Update form value
        form.setValue("logo", data.data.url);
        setLogoPreview(data.data.url);
        toast.success("Logo uploaded successfully");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    const currentLogo = form.getValues("logo");

    if (currentLogo) {
      try {
        // Delete from server
        const response = await fetch("/api/upload", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: currentLogo }),
        });

        if (!response.ok) {
          console.error("Failed to delete file from server");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    form.setValue("logo", "");
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Logo removed successfully");
  };

  const onSubmit = async (data: SkillFormValues) => {
    try {
      setIsSubmitting(true);

      if (isEditing) {
        await skillApi.update(skill._id, data);
      } else {
        await skillApi.create(data);
      }

      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Failed to save skill:", error);
      toast.error(error.message || "Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Skill" : "Create Skill"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your skill information below."
              : "Fill in the details to add a new skill."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon/Emoji *</FormLabel>
                    <FormControl>
                      <Input placeholder="Atom" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Use an icon text from Lucide
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="tooling">Tooling</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency (0-100) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="85"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Since (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Select date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When you started using this skill
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Logo (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        {/* Square Upload Area */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="relative w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors flex items-center justify-center bg-muted/50 hover:bg-muted group"
                        >
                          {logoPreview ? (
                            <>
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-contain p-2 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLogo();
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              {isUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : (
                                <>
                                  <ImagePlus className="w-6 h-6 mb-1" />
                                  <span className="text-xs">Upload</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Upload Info */}
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            Click the square to upload a logo image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, WebP or GIF (max. 5MB)
                          </p>
                          {logoPreview && (
                            <p className="text-xs text-primary mt-1">
                              ✓ Logo uploaded
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
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
                  <FormLabel className="mt-0!">
                    Active (Show on website)
                  </FormLabel>
                </FormItem>
              )}
            />

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
                {isEditing ? "Update" : "Create"} Skill
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
