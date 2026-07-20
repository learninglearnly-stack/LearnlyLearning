import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: tutor } = await admin
    .from("tutors")
    .select("profile_id")
    .eq("id", id)
    .maybeSingle();

  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  if (auth.user.id === tutor.profile_id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const { error } = await admin.auth.admin.deleteUser(tutor.profile_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
