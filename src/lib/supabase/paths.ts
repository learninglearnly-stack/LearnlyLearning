import type { UserRole } from "@/types";

export function getDashboardPathForRole(role: UserRole | string | null | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "tutor") return "/tutor";
  return "/dashboard";
}
