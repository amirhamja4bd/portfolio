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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { experienceApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const experienceFormSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  companyUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  responsibilities: z
    .array(z.string().min(1, "Responsibility cannot be empty"))
    .optional(),
  technologies: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .optional(),
  isActive: z.boolean().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface ExperienceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: any;
  onSuccess: () => void;
}

export function ExperienceFormModal({
  open,
  onOpenChange,
  experience,
  onSuccess,
}: ExperienceFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const isEditing = !!experience;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      company: "",
      companyUrl: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      responsibilities: [],
      technologies: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (experience) {
      const startDate = experience.startDate
        ? new Date(experience.startDate).toISOString().split("T")[0]
        : "";
      const endDate = experience.endDate
        ? new Date(experience.endDate).toISOString().split("T")[0]
        : "";

      form.reset({
        company: experience.company || "",
        companyUrl: experience.companyUrl || "",
        position: experience.position || "",
        location: experience.location || "",
        startDate,
        endDate,
        current: experience.current || false,
        description: experience.description || "",
        responsibilities: experience.responsibilities || [],
        technologies: experience.technologies || [],
        isActive: experience.isActive !== false,
      });
      setIsCurrent(experience.current || false);
    } else {
      form.reset({
        company: "",
        companyUrl: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        responsibilities: [],
        technologies: [],
        isActive: true,
      });
      setIsCurrent(false);
    }
  }, [experience, form]);

  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        responsibilities: data.responsibilities || [],
        technologies: data.technologies || [],
      };

      if (isEditing) {
        await experienceApi.update(experience._id, payload);
      } else {
        await experienceApi.create(payload);
      }

      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Failed to save experience:", error);
      alert(error.message || "Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your work experience information below."
              : "Fill in the details to add a new work experience."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isCurrent} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsCurrent(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel className="mt-0!">
                    Currently working here
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of your role"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Responsibilities</FormLabel>
                  <div className="space-y-2">
                    {field.value?.map(
                      (responsibility: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter responsibility"
                            value={responsibility}
                            onChange={(e) => {
                              const newResponsibilities = [
                                ...(field.value || []),
                              ];
                              newResponsibilities[index] = e.target.value;
                              field.onChange(newResponsibilities);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newResponsibilities = [
                                ...(field.value || []),
                              ];
                              newResponsibilities.splice(index, 1);
                              field.onChange(newResponsibilities);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newResponsibilities = [
                          ...(field.value || []),
                          "",
                        ];
                        field.onChange(newResponsibilities);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <div className="space-y-2">
                    {field.value?.map((technology: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Enter technology"
                          value={technology}
                          onChange={(e) => {
                            const newTechnologies = [...(field.value || [])];
                            newTechnologies[index] = e.target.value;
                            field.onChange(newTechnologies);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newTechnologies = [...(field.value || [])];
                            newTechnologies.splice(index, 1);
                            field.onChange(newTechnologies);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTechnologies = [...(field.value || []), ""];
                        field.onChange(newTechnologies);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Technology
                    </Button>
                  </div>
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
                {isEditing ? "Update" : "Add"} Experience
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
