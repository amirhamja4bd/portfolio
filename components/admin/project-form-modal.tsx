"use client";

import Editor from "@/components/editor/editor";
import { Badge } from "@/components/ui/badge";
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
import { projectApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/core";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  technologies: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required"),
  category: z.enum([
    "Web Application",
    "Mobile App",
    "API",
    "Tool",
    "Library",
    "Platform",
    "Other",
  ]),
  thumbnail: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Project thumbnail is required"),
  images: z.array(z.string().url("Must be a valid URL")).optional(),
  videos: z.array(z.string().url("Must be a valid URL")).optional(),
  githubUrls: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().url("Must be a valid URL"),
      })
    )
    .optional(),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: any;
  onSuccess: () => void;
}

export function ProjectFormModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTech, setCurrentTech] = useState("");
  const [currentGithubLabel, setCurrentGithubLabel] = useState("");
  const [currentGithubUrl, setCurrentGithubUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const isEditing = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      category: "Web Application",
      thumbnail: "",
      images: [],
      videos: [],
      githubUrls: [],
      demoUrl: "",
      order: 0,
      featured: false,
      published: true,
    },
  });

  const {
    fields: githubFields,
    append: appendGithub,
    remove: removeGithub,
  } = useFieldArray({
    control: form.control,
    name: "githubUrls",
  });

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control: form.control as any,
    name: "technologies",
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control as any,
    name: "images",
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control as any,
    name: "videos",
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title || "",
        description: project.description || "",
        technologies: project.technologies || [],
        category: project.category || "Web Application",
        thumbnail: project.thumbnail || "",
        images: project.images || [],
        videos: project.videos || [],
        githubUrls: project.githubUrls || [],
        demoUrl: project.demoUrl || "",
        order: project.order || 0,
        featured: project.featured || false,
        published: project.published !== false,
      });
      setThumbnailUrl(project.thumbnail || "");
      setImagesUrls(project.images || []);
    } else {
      form.reset({
        title: "",
        description: "",
        technologies: [],
        category: "Web Application",
        thumbnail: "",
        images: [],
        videos: [],
        githubUrls: [],
        demoUrl: "",
        order: 0,
        featured: false,
        published: true,
      });
      setThumbnailUrl("");
      setImagesUrls([]);
    }
  }, [project, form]);

  const handleAddTech = () => {
    if (currentTech.trim()) {
      (appendTech as any)(currentTech.trim());
      setCurrentTech("");
    }
  };

  const handleAddGithub = () => {
    if (currentGithubLabel.trim() && currentGithubUrl.trim()) {
      appendGithub({
        label: currentGithubLabel.trim(),
        url: currentGithubUrl.trim(),
      });
      setCurrentGithubLabel("");
      setCurrentGithubUrl("");
    }
  };

  const handleAddVideo = () => {
    if (currentVideo.trim()) {
      (appendVideo as any)(currentVideo.trim());
      setCurrentVideo("");
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      try {
        const url = await uploadFile(file);
        setThumbnailUrl(url);
        form.setValue("thumbnail", url);
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadFile(files[i]);
          urls.push(url);
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
      setImagesUrls((prev) => [...prev, ...urls]);
      urls.forEach((url) => (appendImage as any)(url));
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        githubUrls: data.githubUrls || [],
      };

      if (isEditing) {
        await projectApi.update(project.slug, payload);
      } else {
        await projectApi.create(payload);
      }

      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Failed to save project:", error);
      alert(error.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your project information below."
              : "Fill in the details to create a new project."}
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
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Editor
                      initialValue={
                        field.value
                          ? {
                              type: "doc",
                              content: [
                                {
                                  type: "paragraph",
                                  content: field.value
                                    ? [
                                        {
                                          type: "text",
                                          text: field.value.replace(
                                            /<[^>]*>/g,
                                            ""
                                          ),
                                        },
                                      ]
                                    : [],
                                },
                              ],
                            }
                          : undefined
                      }
                      onChange={(content) => field.onChange(content)}
                    />
                  </FormControl>
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
                      <SelectItem value="Web Application">
                        Web Application
                      </SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="API">API</SelectItem>
                      <SelectItem value="Tool">Tool</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Platform">Platform</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Technologies *</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
                />
                <Button type="button" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {form.watch(`technologies.${index}`)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTech(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Project Thumbnail *</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="space-y-4">
              <FormLabel>Additional Images</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
              />
              <div className="flex flex-wrap gap-2">
                {imageFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <img
                      src={imagesUrls[index]}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        removeImage(index);
                        setImagesUrls((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>GitHub URLs</FormLabel>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Input
                  placeholder="Label (e.g., Frontend)"
                  value={currentGithubLabel}
                  onChange={(e) => setCurrentGithubLabel(e.target.value)}
                />
                <Input
                  type="url"
                  placeholder="https://github.com/..."
                  value={currentGithubUrl}
                  onChange={(e) => setCurrentGithubUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddGithub()}
                />
                <Button
                  type="button"
                  onClick={handleAddGithub}
                  className="self-start sm:self-center"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {githubFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {form.watch(`githubUrls.${index}.label`)}:{" "}
                    {form.watch(`githubUrls.${index}.url`)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGithub(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Video Links</FormLabel>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={currentVideo}
                  onChange={(e) => setCurrentVideo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddVideo()}
                />
                <Button type="button" onClick={handleAddVideo}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {videoFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {form.watch(`videos.${index}`)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="demoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://demo.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
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
                {isEditing ? "Update" : "Create"} Project
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
