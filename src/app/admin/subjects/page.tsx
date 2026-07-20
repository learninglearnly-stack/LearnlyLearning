import type { Metadata } from "next";

import { AdminSubjectsManager } from "@/components/dashboard/admin-subjects-manager";
import { createClient } from "@/lib/supabase/server";
import type { Subject } from "@/types";

export const metadata: Metadata = {
  title: "Manage Subjects",
  description: "Add and remove subjects.",
};

export default async function AdminSubjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("subjects").select("*").order("name");

  return <AdminSubjectsManager subjects={(data ?? []) as Subject[]} />;
}
