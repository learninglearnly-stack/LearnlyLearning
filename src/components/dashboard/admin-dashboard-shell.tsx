"use client";

import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ADMIN_NAV_ITEMS } from "@/lib/constants/admin-dashboard";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  library: Library,
} as const;

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-3">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-bold">{APP_NAME}</span>
        </Link>
        <p className="text-muted-foreground mt-1 text-xs">Admin Panel</p>
      </div>

      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {"badge" in item && item.badge && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

interface AdminDashboardShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminDashboardShell({ children, title, description }: AdminDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-muted/30 flex min-h-screen">
      <aside className="bg-card fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <AdminSidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="bg-card absolute inset-y-0 left-0 w-64 border-r shadow-xl">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="bg-card sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            {title && (
              <div>
                <h1 className="text-sm font-semibold lg:text-base">{title}</h1>
                {description && (
                  <p className="text-muted-foreground hidden text-xs sm:block">{description}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/">View Site</Link>
            </Button>
            <ThemeToggle />
            <SignOutButton variant="outline" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
