"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AdminDashboardShell } from "@/components/dashboard/admin-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export interface AdminTutorRow {
  id: string;
  profile_id: string;
  headline: string | null;
  hourly_rate: number;
  is_verified: boolean;
  city: string | null;
  country: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

interface AdminTutorsManagerProps {
  tutors: AdminTutorRow[];
}

export function AdminTutorsManager({ tutors }: AdminTutorsManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    headline: "",
    hourly_rate: "40",
    city: "",
    country: "",
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hourly_rate: Number(form.hourly_rate),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.fieldErrors?.email?.[0] ?? data.error ?? "Failed to create tutor");
      }

      toast.success("Tutor created");
      setForm({
        full_name: "",
        email: "",
        password: "",
        headline: "",
        hourly_rate: "40",
        city: "",
        country: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create tutor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tutor "${name}"? This will remove their account and profile.`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/tutors/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete tutor");

      toast.success("Tutor deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete tutor");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminDashboardShell title="Tutors" description="Manage tutor accounts">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">All Tutors</h2>
            <p className="text-muted-foreground text-sm">{tutors.length} tutor profiles</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Tutor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Add Tutor</DialogTitle>
                  <DialogDescription>Create a new tutor account. They can sign in and complete their profile.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tutor-name">Full name</Label>
                    <Input
                      id="tutor-name"
                      value={form.full_name}
                      onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tutor-email">Email</Label>
                    <Input
                      id="tutor-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tutor-password">Password</Label>
                    <Input
                      id="tutor-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tutor-headline">Headline</Label>
                    <Input
                      id="tutor-headline"
                      value={form.headline}
                      onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g. Math tutor with 10 years experience"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tutor-rate">Hourly rate (USD)</Label>
                      <Input
                        id="tutor-rate"
                        type="number"
                        min={0}
                        value={form.hourly_rate}
                        onChange={(e) => setForm((prev) => ({ ...prev, hourly_rate: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tutor-city">City</Label>
                      <Input
                        id="tutor-city"
                        value={form.city}
                        onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tutor-country">Country</Label>
                    <Input
                      id="tutor-country"
                      value={form.country}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Tutor
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tutor List</CardTitle>
            <CardDescription>Tutors appear in the public directory once their profile is set up.</CardDescription>
          </CardHeader>
          <CardContent>
            {tutors.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tutors yet. Add your first tutor above.</p>
            ) : (
              <div className="divide-y rounded-xl border">
                {tutors.map((tutor) => {
                  const name = tutor.profiles?.full_name || "Unnamed tutor";
                  return (
                    <div key={tutor.id} className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-muted-foreground text-sm">{tutor.profiles?.email}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {tutor.headline || "No headline"} · {formatCurrency(Number(tutor.hourly_rate))}/hr
                          {tutor.is_verified ? " · Verified" : ""}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tutor.id, name)}
                        disabled={deletingId === tutor.id}
                      >
                        {deletingId === tutor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardShell>
  );
}
