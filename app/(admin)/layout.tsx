"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AnimatedBackground } from "@/components/animated-background";
import { FloatingCodeBrackets } from "@/components/floating-code-brackets";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on login/register pages
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="">
        <AnimatedBackground />
        <div className="absolute inset-0e bg-linear-to-b from-background/20 via-background/20 to-background/20" />
        {children}
      </div>
    );
  }

  // Generate breadcrumb from pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + pathSegments.slice(0, index + 1).join("/"),
  }));

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center gap-2">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-screen flex-1 rounded-xl p-4 md:p-8 ">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
