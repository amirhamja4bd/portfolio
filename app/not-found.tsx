import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center px-4 mt-20">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-white/5 p-10 max-w-2xl w-full text-center">
        <div className="mb-4">
          <span
            className="block text-7xl sm:text-8xl font-extrabold text-brand-accent"
            aria-hidden="true"
          >
            404
          </span>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2">
          Page not found
        </h1>
        <p className="text-slate-300 mb-6">
          We couldn't find the page you're looking for. It may have been moved
          or the link is broken.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/" className="">
              Return Home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          If you typed the address, double-check the URL for typos.
        </p>
      </div>
    </main>
  );
}
