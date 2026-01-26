"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const BlogSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      toast.success(data.message);
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-brandColor to-accent" />
        <div className="relative p-8 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Stay in the loop</h3>
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            Get the latest articles, tutorials, and insights delivered straight
            to your inbox.
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Enter your email"
              className="bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:bg-white/30 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            />
            <Button
              className="w-full bg-white text-primary hover:bg-white/90"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
