"use client";

import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { getDashboardPathForRole } from "@/lib/supabase/paths";
import { useUser } from "@/hooks/use-user";

export function AuthNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user, role, isLoading } = useUser();

  if (isLoading) {
    return <div className="bg-muted h-9 w-24 animate-pulse rounded-xl" />;
  }

  if (user) {
    const dashboardHref = getDashboardPathForRole(role);
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href={dashboardHref} onClick={onNavigate}>
            Dashboard
          </Link>
        </Button>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login" onClick={onNavigate}>
          Sign In
        </Link>
      </Button>
      <Button asChild>
        <Link href="/signup" onClick={onNavigate}>
          Get Started
        </Link>
      </Button>
    </div>
  );
}
