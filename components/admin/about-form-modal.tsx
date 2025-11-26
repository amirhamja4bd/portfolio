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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const aboutFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  infoCards: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    })
  ),
  snapshot: z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    ),
  }),
  education: z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(
      z.object({
        school: z.string().min(1, "School is required"),
        degree: z.string().min(1, "Degree is required"),
        year: z.string().min(1, "Year is required"),
      })
    ),
  }),
  certifications: z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        year: z.string().min(1, "Year is required"),
      })
    ),
  }),
  interests: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    items: z.array(
      z.object({
        icon: z.string().min(1, "Icon is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
      })
    ),
  }),
  published: z.boolean().optional(),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

interface AboutData {
  _id?: string;
  title: string;
  description: string;
  infoCards: Array<{ title: string; description: string }>;
  snapshot: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  education: {
    title: string;
    items: Array<{ school: string; degree: string; year: string }>;
  };
  certifications: {
    title: string;
    items: Array<{ name: string; issuer: string; year: string }>;
  };
  interests: {
    title: string;
    description: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  published?: boolean;
}

interface AboutFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aboutData?: AboutData | null;
  onSuccess: () => void;
}

export function AboutFormModal({
  open,
  onOpenChange,
  aboutData,
  onSuccess,
}: AboutFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!aboutData;

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      title: "",
      description: "",
      infoCards: [{ title: "", description: "" }],
      snapshot: {
        title: "",
        items: [{ label: "", value: "" }],
      },
      education: {
        title: "",
        items: [{ school: "", degree: "", year: "" }],
      },
      certifications: {
        title: "",
        items: [{ name: "", issuer: "", year: "" }],
      },
      interests: {
        title: "",
        description: "",
        items: [{ icon: "", title: "", description: "" }],
      },
      published: true,
    },
  });

  const {
    fields: infoCardFields,
    append: appendInfoCard,
    remove: removeInfoCard,
  } = useFieldArray({
    control: form.control,
    name: "infoCards",
  });

  const {
    fields: snapshotFields,
    append: appendSnapshot,
    remove: removeSnapshot,
  } = useFieldArray({
    control: form.control,
    name: "snapshot.items",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education.items",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications.items",
  });

  const {
    fields: interestFields,
    append: appendInterest,
    remove: removeInterest,
  } = useFieldArray({
    control: form.control,
    name: "interests.items",
  });

  useEffect(() => {
    if (aboutData) {
      form.reset({
        title: aboutData.title || "",
        description: aboutData.description || "",
        infoCards: aboutData.infoCards || [{ title: "", description: "" }],
        snapshot: {
          title: aboutData.snapshot?.title || "",
          items: aboutData.snapshot?.items || [{ label: "", value: "" }],
        },
        education: {
          title: aboutData.education?.title || "",
          items: aboutData.education?.items || [
            { school: "", degree: "", year: "" },
          ],
        },
        certifications: {
          title: aboutData.certifications?.title || "",
          items: aboutData.certifications?.items || [
            { name: "", issuer: "", year: "" },
          ],
        },
        interests: {
          title: aboutData.interests?.title || "",
          description: aboutData.interests?.description || "",
          items: aboutData.interests?.items || [
            { icon: "", title: "", description: "" },
          ],
        },
        published: aboutData.published ?? true,
      });
    }
  }, [aboutData, form]);

  const onSubmit = async (data: AboutFormValues) => {
    setIsSubmitting(true);
    try {
      const url = "/api/about";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { id: aboutData?._id, ...data } : data;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save about section");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving about:", error);
      toast.error("Failed to save about section. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit About Section" : "Create About Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your about section information"
              : "Add a new about section to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="About" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your professional description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Info Cards</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendInfoCard({ title: "", description: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>

              {infoCardFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {infoCardFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeInfoCard(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name={`infoCards.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Mission" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`infoCards.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Card description..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Snapshot Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Snapshot</h3>

              <FormField
                control={form.control}
                name="snapshot.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Professional Snapshot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSnapshot({ label: "", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {snapshotFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {snapshotFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeSnapshot(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`snapshot.items.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`snapshot.items.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input placeholder="Berlin, Germany" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Education</h3>

              <FormField
                control={form.control}
                name="education.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Education" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendEducation({ school: "", degree: "", year: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {educationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {educationFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name={`education.items.${index}.school`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="University of Copenhagen"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`education.items.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MSc Computer Science"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.items.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2013" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certifications</h3>

              <FormField
                control={form.control}
                name="certifications.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Professional Certifications"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendCertification({ name: "", issuer: "", year: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {certificationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {certificationFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name={`certifications.items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="AWS Certified Solutions Architect"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`certifications.items.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issuer</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Amazon Web Services"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`certifications.items.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2021" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Interests Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interests</h3>

              <FormField
                control={form.control}
                name="interests.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Beyond the Keyboard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description of your interests..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendInterest({ icon: "", title: "", description: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {interestFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {interestFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeInterest(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name={`interests.items.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon (emoji)</FormLabel>
                          <FormControl>
                            <Input placeholder="🏃‍♂️" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`interests.items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Outdoors" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`interests.items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Trail running & hiking"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
