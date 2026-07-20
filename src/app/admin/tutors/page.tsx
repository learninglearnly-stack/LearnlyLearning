import type { Metadata } from "next";

import { AdminTutorsManager, type AdminTutorRow } from "@/components/dashboard/admin-tutors-manager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage Tutors",
  description: "Add and remove tutor accounts.",
};

export default async function AdminTutorsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tutors")
    .select(
      `
      id,
      profile_id,
      headline,
      hourly_rate,
      is_verified,
      city,
      country,
      created_at,
      profiles:profile_id (full_name, email)
    `,
    )
    .order("created_at", { ascending: false });

  const tutors: AdminTutorRow[] = (data ?? []).map((row) => ({
    ...row,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] ?? null : row.profiles,
  }));

  return <AdminTutorsManager tutors={tutors} />;
}
