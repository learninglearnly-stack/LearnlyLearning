import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { createSubjectSchema } from "@/lib/validations/admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const parsed = createSubjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, category, icon, description } = parsed.data;
  const slug = slugify(name);
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("subjects")
    .insert({
      name,
      slug,
      category: category ?? null,
      icon: icon ?? null,
      description: description ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
