"use client";

import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md text-center"
        >
          <FileQuestion className="mx-auto mb-6 h-24 w-24 text-muted-foreground" />
          <h1 className="mb-4 text-4xl font-bold">Article Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            Sorry, we couldn't find the article you're looking for. It may have
            been moved or deleted.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/blogs">Browse All Articles</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
