import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createTutorSchema } from "@/lib/validations/admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const parsed = createTutorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, full_name, headline, hourly_rate, city, country } = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      role: "tutor",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const userId = data.user.id;

  await admin
    .from("profiles")
    .update({ city: city ?? null, country: country ?? null })
    .eq("id", userId);

  const { data: tutor, error: tutorError } = await admin
    .from("tutors")
    .update({
      headline: headline ?? "",
      hourly_rate: hourly_rate ?? 0,
      city: city ?? null,
      country: country ?? null,
      is_verified: true,
    })
    .eq("profile_id", userId)
    .select("id")
    .single();

  if (tutorError) {
    return NextResponse.json({ error: tutorError.message }, { status: 400 });
  }

  return NextResponse.json({
    id: tutor.id,
    profile_id: userId,
    email,
    full_name,
    role: "tutor",
  });
}
