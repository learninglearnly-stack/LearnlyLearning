"use client";

import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Info,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { TUTOR_NAV_ITEMS } from "@/lib/constants/tutor-dashboard";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  "layout-dashboard": LayoutDashboard,
  user: User,
  calendar: Calendar,
  "book-open": BookOpen,
  "message-square": MessageSquare,
  star: Star,
  settings: Settings,
} as const;

interface TutorSidebarProps {
  onNavigate?: () => void;
}

export function TutorSidebar({ onNavigate }: TutorSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-3">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold">{APP_NAME}</span>
        </Link>
        <p className="text-muted-foreground mt-1 px-0 text-xs">Tutor Dashboard</p>
      </div>

      {TUTOR_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive =
          item.href === "/tutor" ? pathname === "/tutor" : pathname.startsWith(item.href);

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

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-accent/20 border-accent/30 flex items-center gap-3 border-b px-4 py-2.5 text-sm">
      <Info className="text-accent-foreground h-4 w-4 shrink-0" />
      <p className="flex-1">
        <strong>Demo mode:</strong> Profile and availability are saved locally in your browser.
        Connect Supabase later for cloud sync.
      </p>
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setDismissed(true)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface TutorDashboardShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function TutorDashboardShell({ children, title, description }: TutorDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-muted/30 flex min-h-screen">
      <aside className="bg-card fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <TutorSidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="bg-card absolute inset-y-0 left-0 w-64 border-r shadow-xl">
            <TutorSidebar onNavigate={() => setSidebarOpen(false)} />
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
              <Link href="/tutors">View Public Site</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <DemoModeBanner />

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
