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
import { Textarea } from "@/components/ui/textarea";
import { HeroData } from "@/types/hero";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const heroFormSchema = z.object({
  badge: z.object({
    text: z.string().min(1, "Badge text is required"),
  }),
  heading: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
  }),
  bio: z.string().min(1, "Bio is required"),
  cta: z.object({
    primary: z.object({
      text: z.string().min(1, "Primary CTA text is required"),
      href: z.string().min(1, "Primary CTA link is required"),
    }),
    secondary: z.object({
      text: z.string().min(1, "Secondary CTA text is required"),
      href: z.string().min(1, "Secondary CTA link is required"),
    }),
  }),
  techStack: z.string().min(1, "At least one tech is required"),
  socialLinks: z.string().min(1, "At least one social link is required"),
  published: z.boolean().optional(),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

interface HeroFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heroData?: HeroData | null;
  onSuccess: () => void;
}

export function HeroFormModal({
  open,
  onOpenChange,
  heroData,
  onSuccess,
}: HeroFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!heroData;

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      badge: { text: "" },
      heading: { name: "", title: "" },
      bio: "",
      cta: {
        primary: { text: "", href: "" },
        secondary: { text: "", href: "" },
      },
      techStack: "",
      socialLinks: "",
      published: true,
    },
  });

  useEffect(() => {
    if (heroData) {
      form.reset({
        badge: { text: heroData.badge.text || "" },
        heading: {
          name: heroData.heading.name || "",
          title: heroData.heading.title || "",
        },
        bio: heroData.bio || "",
        cta: {
          primary: {
            text: heroData.cta.primary.text || "",
            href: heroData.cta.primary.href || "",
          },
          secondary: {
            text: heroData.cta.secondary.text || "",
            href: heroData.cta.secondary.href || "",
          },
        },
        techStack: heroData.techStack?.join(", ") || "",
        socialLinks: heroData.socialLinks
          ?.map((link) => `${link.icon}|${link.link}|${link.title}`)
          .join("\n") || "",
        published: heroData.published !== false,
      });
    } else {
      form.reset({
        badge: { text: "Available for Work" },
        heading: { name: "", title: "" },
        bio: "",
        cta: {
          primary: { text: "View Projects", href: "#projects" },
          secondary: { text: "Contact Me", href: "#contact" },
        },
        techStack: "",
        socialLinks: "",
        published: true,
      });
    }
  }, [heroData, form, open]);

  const onSubmit = async (data: HeroFormValues) => {
    try {
      setIsSubmitting(true);

      // Parse social links (format: icon|link|title per line)
      const socialLinks = data.socialLinks
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [icon, link, title] = line.split("|").map((s) => s.trim());
          return { icon, link, title };
        });

      const payload = {
        badge: data.badge,
        heading: data.heading,
        bio: data.bio,
        cta: data.cta,
        techStack: data.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        socialLinks,
        published: data.published,
      };

      const url = "/api/hero";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { id: heroData._id, ...payload }
        : payload;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save hero section");
      }

      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Failed to save hero:", error);
      alert(error.message || "Failed to save hero section");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Hero Section" : "Create Hero Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your hero section information below."
              : "Fill in the details to create your hero section."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Badge */}
            <FormField
              control={form.control}
              name="badge.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge Text *</FormLabel>
                  <FormControl>
                    <Input placeholder="Available for Work" {...field} />
                  </FormControl>
                  <FormDescription>
                    Small badge displayed above your name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Heading */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heading.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heading.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTAs */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold text-sm">Call to Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cta.primary.text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary CTA Text *</FormLabel>
                      <FormControl>
                        <Input placeholder="View Projects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cta.primary.href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary CTA Link *</FormLabel>
                      <FormControl>
                        <Input placeholder="#projects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cta.secondary.text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary CTA Text *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact Me" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cta.secondary.href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary CTA Link *</FormLabel>
                      <FormControl>
                        <Input placeholder="#contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Tech Stack */}
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Next.js, TypeScript, Node.js, MongoDB"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Comma-separated technologies</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <FormField
              control={form.control}
              name="socialLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Links *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Github|https://github.com/username|GitHub\nLinkedin|https://linkedin.com/in/username|LinkedIn\nMail|mailto:email@example.com|Email`}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    One per line, format: icon|link|title
                    <br />
                    Available icons: Github, Linkedin, Mail
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published */}
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
                  <FormDescription className="mt-0!">
                    Make this hero section visible on your portfolio
                  </FormDescription>
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
                {isEditing ? "Update" : "Create"} Hero Section
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
