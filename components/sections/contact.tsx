"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Linkedin, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactChannels } from "@/lib/content";

const channelIconMap = {
  Mail,
  Linkedin,
  Calendar,
};

const schema = z.object({
  name: z.string().min(2, "Introduce yourself"),
  email: z.string().email("Share a valid email"),
  message: z.string().min(10, "Tell me more about what you need"),
});

type ContactFormValues = z.infer<typeof schema>;

export function ContactSection() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Try emailing me directly.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send message."
      );
    }
  };

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-semibold lg:text-4xl">
            Let&apos;s Collaborate
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Reach out for consulting engagements, platform audits, or to invite
            me to speak. I respond within two business days.
          </p>
          <div className="grid gap-4 text-sm text-muted-foreground">
            {contactChannels.map((channel) => {
              const Icon =
                channelIconMap[channel.icon as keyof typeof channelIconMap] ??
                Mail;
              return (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="group flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 p-4 transition hover:border-emerald-400 hover:bg-background/90"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {channel.label}
                      </p>
                      <p className="text-muted-foreground/80">
                        {channel.value}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70 group-hover:text-emerald-400">
                    Connect
                  </span>
                </a>
              );
            })}
          </div>
        </motion.div>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="space-y-5 rounded-3xl border border-border/60 bg-background/75 p-8 shadow-xl backdrop-blur"
        >
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <Input
              id="name"
              placeholder="How should I address you?"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-emerald-400/90">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-emerald-400/90">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              How can I help?
            </label>
            <Textarea
              id="message"
              rows={6}
              placeholder="Share your goals, challenges, or scope."
              {...form.register("message")}
            />
            {form.formState.errors.message ? (
              <p className="text-xs text-emerald-400/90">
                {form.formState.errors.message.message}
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending
              </span>
            ) : (
              "Send message"
            )}
          </Button>
          {status === "success" ? (
            <p className="text-sm text-emerald-400">
              Message sent! I&apos;ll reply shortly.
            </p>
          ) : null}
          {status === "error" && errorMessage ? (
            <p className="text-sm text-red-400">{errorMessage}</p>
          ) : null}
        </motion.form>
      </div>
    </section>
  );
}
