import Link from "next/link";

import { AdminDashboardShell } from "@/components/dashboard/admin-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

async function getAdminStats() {
  const supabase = await createClient();

  const [profiles, tutors, bookings, subjects, pendingBookings] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("tutors").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("subjects").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    profiles: profiles.count ?? 0,
    tutors: tutors.count ?? 0,
    bookings: bookings.count ?? 0,
    subjects: subjects.count ?? 0,
    pendingBookings: pendingBookings.count ?? 0,
  };
}

export async function AdminOverview() {
  const stats = await getAdminStats();

  return (
    <AdminDashboardShell title="Overview" description="Platform administration">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: stats.profiles },
            { label: "Tutors", value: stats.tutors },
            { label: "Bookings", value: stats.bookings },
            { label: "Subjects", value: stats.subjects },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Live data from your Supabase database</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2 text-sm">
              <p>
                <strong className="text-foreground">{stats.pendingBookings}</strong> booking
                {stats.pendingBookings === 1 ? "" : "s"} awaiting tutor response
              </p>
              <p>
                <strong className="text-foreground">{stats.tutors}</strong> tutor profile
                {stats.tutors === 1 ? "" : "s"} on the platform
              </p>
              <p>
                <strong className="text-foreground">{stats.subjects}</strong> subjects available
                for discovery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild>
                <Link href="/admin/users">Manage Students</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/tutors">Manage Tutors</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/subjects">Manage Subjects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tutors">View Public Tutor Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardShell>
  );
}
