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
import { Textarea } from "@/components/ui/textarea";
import type { Subject } from "@/types";

interface AdminSubjectsManagerProps {
  subjects: Subject[];
}

export function AdminSubjectsManager({ subjects }: AdminSubjectsManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    icon: "",
    description: "",
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.fieldErrors?.name?.[0] ?? data.error ?? "Failed to create subject");
      }

      toast.success("Subject created");
      setForm({ name: "", category: "", icon: "", description: "" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete subject "${name}"? Tutors linked to this subject will be unlinked.`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete subject");

      toast.success("Subject deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subject");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminDashboardShell title="Subjects" description="Manage subjects for tutor discovery">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">All Subjects</h2>
            <p className="text-muted-foreground text-sm">{subjects.length} subjects available</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Add Subject</DialogTitle>
                  <DialogDescription>Create a new subject for tutors to teach.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject-name">Name</Label>
                    <Input
                      id="subject-name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject-category">Category</Label>
                    <Input
                      id="subject-category"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. STEM, Languages"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject-icon">Icon</Label>
                    <Input
                      id="subject-icon"
                      value={form.icon}
                      onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. calculator, book-open"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject-description">Description</Label>
                    <Textarea
                      id="subject-description"
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Subject
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject List</CardTitle>
            <CardDescription>Subjects appear on the public subjects and tutor discovery pages.</CardDescription>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No subjects yet. Add your first subject above.</p>
            ) : (
              <div className="divide-y rounded-xl border">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-muted-foreground text-sm">/{subject.slug}</p>
                      {subject.category && (
                        <p className="text-muted-foreground mt-1 text-xs">{subject.category}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subject.id, subject.name)}
                      disabled={deletingId === subject.id}
                    >
                      {deletingId === subject.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardShell>
  );
}
