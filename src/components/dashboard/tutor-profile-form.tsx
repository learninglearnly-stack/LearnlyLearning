"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { TutorDashboardShell } from "@/components/dashboard/tutor-dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FILTER_OPTIONS } from "@/lib/constants/tutor-filters";
import { useSubjects } from "@/hooks/use-subjects";
import { useTutorProfile } from "@/hooks/use-tutor-profile";
import { generateId } from "@/lib/tutor-storage";
import {
  tutorProfileSchema,
  type TutorProfileFormValues,
} from "@/lib/validations/tutor-profile";

export function TutorProfileForm() {
  const { profile, updateProfile, isLoaded } = useTutorProfile();
  const { subjects, isLoaded: subjectsLoaded } = useSubjects();
  const [specialtyInput, setSpecialtyInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
      headline: "",
      bio: "",
      hourly_rate: 40,
      experience_years: 0,
      is_online: true,
      city: "",
      country: "",
      subject_slugs: [],
      languages: [],
      specialties: [],
      education: [],
      experience: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const educationFields = useFieldArray({ control, name: "education" });
  const experienceFields = useFieldArray({ control, name: "experience" });

  const watchedSubjects = watch("subject_slugs");
  const watchedLanguages = watch("languages");
  const watchedSpecialties = watch("specialties");
  const watchedAvatar = watch("avatar_url");
  const watchedOnline = watch("is_online");

  useEffect(() => {
    if (isLoaded) {
      reset({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        headline: profile.headline,
        bio: profile.bio,
        hourly_rate: profile.hourly_rate,
        experience_years: profile.experience_years,
        is_online: profile.is_online,
        city: profile.city,
        country: profile.country,
        subject_slugs: profile.subject_slugs,
        languages: profile.languages,
        specialties: profile.specialties,
        education: profile.education,
        experience: profile.experience,
      });
    }
  }, [isLoaded, profile, reset]);

  const toggleSubject = (slug: string) => {
    const current = watchedSubjects ?? [];
    setValue(
      "subject_slugs",
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
      { shouldValidate: true },
    );
  };

  const toggleLanguage = (lang: string) => {
    const current = watchedLanguages ?? [];
    setValue(
      "languages",
      current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang],
      { shouldValidate: true },
    );
  };

  const addSpecialty = () => {
    const trimmed = specialtyInput.trim();
    if (!trimmed || (watchedSpecialties ?? []).includes(trimmed)) return;
    setValue("specialties", [...(watchedSpecialties ?? []), trimmed]);
    setSpecialtyInput("");
  };

  const removeSpecialty = (specialty: string) => {
    setValue(
      "specialties",
      (watchedSpecialties ?? []).filter((s) => s !== specialty),
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error("Image must be under 500KB in demo mode");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setValue("avatar_url", event.target?.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: TutorProfileFormValues) => {
    updateProfile({
      ...profile,
      ...data,
    });
    toast.success("Profile saved successfully");
  };

  if (!isLoaded) {
    return (
      <TutorDashboardShell title="Profile">
        <div className="bg-muted h-96 animate-pulse rounded-2xl" />
      </TutorDashboardShell>
    );
  }

  return (
    <TutorDashboardShell title="Edit Profile" description="Update your public tutor profile">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Upload a photo or paste an image URL</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
              {watchedAvatar ? (
                <Image src={watchedAvatar} alt="Profile" fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera className="text-muted-foreground h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-4 w-4" />
                Upload Photo
              </Button>
              <div>
                <Label htmlFor="avatar_url">Or image URL</Label>
                <Input
                  id="avatar_url"
                  placeholder="https://..."
                  className="mt-1.5"
                  {...register("avatar_url")}
                />
                {errors.avatar_url && (
                  <p className="text-destructive mt-1 text-xs">{errors.avatar_url.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" className="mt-1.5" {...register("full_name")} />
              {errors.full_name && (
                <p className="text-destructive mt-1 text-xs">{errors.full_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="e.g. PhD Mathematician — Making calculus click"
                className="mt-1.5"
                {...register("headline")}
              />
              {errors.headline && (
                <p className="text-destructive mt-1 text-xs">{errors.headline.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about your teaching style, experience, and what makes you unique..."
                className="mt-1.5 min-h-[140px]"
                {...register("bio")}
              />
              {errors.bio && <p className="text-destructive mt-1 text-xs">{errors.bio.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
                {errors.city && (
                  <p className="text-destructive mt-1 text-xs">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" className="mt-1.5" {...register("country")} />
                {errors.country && (
                  <p className="text-destructive mt-1 text-xs">{errors.country.message}</p>
                )}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={watchedOnline}
                onChange={(e) => setValue("is_online", e.target.checked)}
                className="border-input text-primary h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">I teach online</span>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rates & Experience</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min={5}
                max={500}
                className="mt-1.5"
                {...register("hourly_rate", { valueAsNumber: true })}
              />
              {errors.hourly_rate && (
                <p className="text-destructive mt-1 text-xs">{errors.hourly_rate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                min={0}
                max={50}
                className="mt-1.5"
                {...register("experience_years", { valueAsNumber: true })}
              />
              {errors.experience_years && (
                <p className="text-destructive mt-1 text-xs">{errors.experience_years.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Select all subjects you can teach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {!subjectsLoaded ? (
                <p className="text-muted-foreground text-sm">Loading subjects...</p>
              ) : subjects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No subjects available yet.</p>
              ) : (
                subjects.map((subject) => {
                  const selected = (watchedSubjects ?? []).includes(subject.slug);
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => toggleSubject(subject.slug)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-muted"
                      }`}
                    >
                      {subject.name}
                    </button>
                  );
                })
              )}
            </div>
            {errors.subject_slugs && (
              <p className="text-destructive mt-2 text-xs">{errors.subject_slugs.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Languages you can teach in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.languages.map((lang) => {
                const selected = (watchedLanguages ?? []).includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-muted"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
            {errors.languages && (
              <p className="text-destructive mt-2 text-xs">{errors.languages.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specialties</CardTitle>
            <CardDescription>Optional tags like &quot;AP Calculus&quot; or &quot;IELTS Prep&quot;</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                placeholder="Add a specialty"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpecialty();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSpecialty}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            {(watchedSpecialties ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(watchedSpecialties ?? []).map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                  >
                    {specialty}
                    <button type="button" onClick={() => removeSpecialty(specialty)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your academic background</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                educationFields.append({
                  id: generateId(),
                  institution: "",
                  degree: "",
                  field: "",
                  year: new Date().getFullYear(),
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationFields.fields.length === 0 && (
              <p className="text-muted-foreground text-sm">No education entries yet.</p>
            )}
            {educationFields.fields.map((field, index) => (
              <div key={field.id} className="bg-muted/50 space-y-3 rounded-xl border p-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => educationFields.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Institution</Label>
                    <Input className="mt-1" {...register(`education.${index}.institution`)} />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input className="mt-1" placeholder="BS, MS, PhD..." {...register(`education.${index}.degree`)} />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input className="mt-1" {...register(`education.${index}.field`)} />
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      {...register(`education.${index}.year`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Experience</CardTitle>
              <CardDescription>Your teaching and professional experience</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                experienceFields.append({
                  id: generateId(),
                  title: "",
                  organization: "",
                  start_year: new Date().getFullYear() - 1,
                  end_year: null,
                  description: "",
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceFields.fields.length === 0 && (
              <p className="text-muted-foreground text-sm">No experience entries yet.</p>
            )}
            {experienceFields.fields.map((field, index) => (
              <div key={field.id} className="bg-muted/50 space-y-3 rounded-xl border p-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => experienceFields.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Title</Label>
                    <Input className="mt-1" {...register(`experience.${index}.title`)} />
                  </div>
                  <div>
                    <Label>Organization</Label>
                    <Input className="mt-1" {...register(`experience.${index}.organization`)} />
                  </div>
                  <div>
                    <Label>Start Year</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      {...register(`experience.${index}.start_year`, { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>End Year (leave blank if current)</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      placeholder="Present"
                      {...register(`experience.${index}.end_year`, {
                        setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea className="mt-1" {...register(`experience.${index}.description`)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pb-8">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </TutorDashboardShell>
  );
}
