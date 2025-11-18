import { Skeleton } from "@/components/ui/skeleton";


export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="border-b bg-linear-to-b from-muted/50 to-background">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-3/4 md:h-16" />
            <Skeleton className="mx-auto h-6 w-2/3 md:h-8" />
          </div>
        </div>
      </section>

      {/* Search and Filters Skeleton */}
      <section className="border-b bg-background/95 backdrop-blur">
        <div className="container py-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid Skeleton */}
      <section className="container py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border bg-card"
              >
                <Skeleton className="aspect-video w-full" />
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
