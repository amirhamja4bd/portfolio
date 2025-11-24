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
import { Textarea } from "@/components/ui/textarea";
import { skillApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  proficiency: z.coerce
    .number()
    .min(0, "Proficiency must be at least 0")
    .max(100, "Proficiency cannot exceed 100"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description cannot exceed 300 characters"),
  icon: z.string().min(1, "Icon is required"),
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
  const isEditing = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "frontend",
      proficiency: 50,
      description: "",
      icon: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (skill) {
      form.reset({
        name: skill.name || "",
        category: skill.category || "frontend",
        proficiency: skill.proficiency || 50,
        description: skill.description || "",
        icon: skill.icon || "",
        isActive: skill.isActive !== false,
      });
    } else {
      form.reset({
        name: "",
        category: "frontend",
        proficiency: 50,
        description: "",
        icon: "",
        isActive: true,
      });
    }
  }, [skill, form]);

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
      alert(error.message || "Failed to save skill");
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your experience with this skill"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max 300 characters</FormDescription>
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
