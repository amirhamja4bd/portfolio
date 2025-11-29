import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen">
      {/* Reading Progress (placeholder bar) */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted">
        <div className="h-full w-0 bg-primary" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mx-auto max-w-6xl py-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <article className="container py-12">
        <div className="mx-auto max-w-6xl">
          {/* Cover Image */}
          <div className="relative mb-12 aspect-video overflow-hidden rounded-3xl">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Meta & Reactions */}
          <div className="mb-6 flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6">
            <Skeleton className="h-12 w-3/4 md:h-16" />
          </h1>

          {/* Excerpt */}
          <div className="mb-8">
            <Skeleton className="h-6 w-3/5" />
          </div>

          {/* Tags */}
          <div className="mb-8 flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>

          {/* Author Info */}
          <div className="mb-12 flex items-center gap-4 rounded-2xl border bg-muted/50 p-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none dark:prose-invert prose-neutral space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Reactions (placeholder) */}
          <div className="mt-8">
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Comments */}
          <section className="mt-12">
            <h3 className="mb-4 text-lg font-semibold">Comments</h3>
            <div className="mb-6 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-10" />
                <Skeleton className="flex-1 h-10" />
              </div>
              <Skeleton className="w-full h-24" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
              </div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* Related Posts */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border bg-background p-6"
                >
                  <Skeleton className="h-40 w-full rounded-lg mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Skeleton className="h-8 w-72 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto mb-6" />
            <div className="flex flex-wrap justify-center gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
