import type { Metadata } from "next";

import { AdminStudentsManager } from "@/components/dashboard/admin-students-manager";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const metadata: Metadata = {
  title: "Manage Students",
  description: "Add and remove student accounts.",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return <AdminStudentsManager students={(data ?? []) as Profile[]} />;
}
