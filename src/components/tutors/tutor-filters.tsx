"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_OPTIONS } from "@/data/mock/subjects";
import { cn } from "@/lib/utils";

interface TutorFiltersProps {
  subjects: { slug: string; name: string }[];
  className?: string;
}

export function TutorFilters({ subjects, className }: TutorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = {
    q: searchParams.get("q") ?? "",
    subject: searchParams.get("subject") ?? "",
    language: searchParams.get("language") ?? "",
    minRate: searchParams.get("minRate") ?? "",
    maxRate: searchParams.get("maxRate") ?? "",
    minExperience: searchParams.get("minExperience") ?? "",
    minRating: searchParams.get("minRating") ?? "",
    online: searchParams.get("online") === "true",
    city: searchParams.get("city") ?? "",
    availability: searchParams.get("availability") ?? "",
    sort: searchParams.get("sort") ?? "rating",
  };

  const activeFilterCount = [
    current.subject,
    current.language,
    current.minRate,
    current.maxRate,
    current.minExperience,
    current.minRating,
    current.online,
    current.city,
    current.availability,
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (updates: Record<string, string | boolean | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === false) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      params.delete("page");

      startTransition(() => {
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = () => {
    const q = searchParams.get("q");
    startTransition(() => {
      router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
    });
  };

  const selectClass =
    "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-11 w-full rounded-xl border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  const filterFields = (
    <div className="space-y-5">
      <div>
        <label htmlFor="filter-subject" className="mb-1.5 block text-sm font-medium">
          Subject
        </label>
        <select
          id="filter-subject"
          className={selectClass}
          value={current.subject}
          onChange={(e) => updateParams({ subject: e.target.value || null })}
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-language" className="mb-1.5 block text-sm font-medium">
          Language
        </label>
        <select
          id="filter-language"
          className={selectClass}
          value={current.language}
          onChange={(e) => updateParams({ language: e.target.value || null })}
        >
          <option value="">All languages</option>
          {FILTER_OPTIONS.languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Hourly Rate ($)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            min={0}
            value={current.minRate}
            onChange={(e) => updateParams({ minRate: e.target.value || null })}
          />
          <Input
            type="number"
            placeholder="Max"
            min={0}
            value={current.maxRate}
            onChange={(e) => updateParams({ maxRate: e.target.value || null })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-experience" className="mb-1.5 block text-sm font-medium">
          Min. Experience (years)
        </label>
        <select
          id="filter-experience"
          className={selectClass}
          value={current.minExperience}
          onChange={(e) => updateParams({ minExperience: e.target.value || null })}
        >
          <option value="">Any experience</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-rating" className="mb-1.5 block text-sm font-medium">
          Min. Rating
        </label>
        <select
          id="filter-rating"
          className={selectClass}
          value={current.minRating}
          onChange={(e) => updateParams({ minRating: e.target.value || null })}
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4.8">4.8+ stars</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-city" className="mb-1.5 block text-sm font-medium">
          City
        </label>
        <select
          id="filter-city"
          className={selectClass}
          value={current.city}
          onChange={(e) => updateParams({ city: e.target.value || null })}
        >
          <option value="">All cities</option>
          {FILTER_OPTIONS.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-availability" className="mb-1.5 block text-sm font-medium">
          Availability
        </label>
        <select
          id="filter-availability"
          className={selectClass}
          value={current.availability}
          onChange={(e) => updateParams({ availability: e.target.value || null })}
        >
          <option value="">Any time</option>
          {FILTER_OPTIONS.availability.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={current.online}
          onChange={(e) => updateParams({ online: e.target.checked || null })}
          className="border-input text-primary focus:ring-primary h-4 w-4 rounded"
        />
        <span className="text-sm font-medium">Online tutors only</span>
      </label>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateParams({ q: (formData.get("q") as string) || null });
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            name="q"
            defaultValue={current.q}
            placeholder="Search tutors, subjects, specialties..."
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-muted-foreground text-sm whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            className={cn(selectClass, "h-9 w-auto")}
            value={current.sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
          >
            {FILTER_OPTIONS.sort.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <div className="hidden lg:block">
        <div className="bg-card rounded-2xl border p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Filters</h3>
          {filterFields}
        </div>
      </div>

      {mobileOpen && (
        <div className="bg-card rounded-2xl border p-5 shadow-sm lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {filterFields}
        </div>
      )}
    </div>
  );
}
