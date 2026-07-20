import {
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
  Star,
  Verified,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TutorBookingActions } from "@/components/bookings/tutor-booking-actions";
import { StarRating } from "@/components/tutors/star-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

interface TutorProfileViewProps {
  tutor: Tutor;
}

export function TutorProfileView({ tutor }: TutorProfileViewProps) {
  return (
    <div className="section-container py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TutorProfileHeader tutor={tutor} />
          <TutorAboutSection tutor={tutor} />
          <TutorEducationSection tutor={tutor} />
          <TutorExperienceSection tutor={tutor} />
          <TutorReviewsSection tutor={tutor} />
        </div>

        <div className="space-y-6">
          <TutorBookingActions tutor={tutor} />
          <TutorAvailabilityCard tutor={tutor} />
          <TutorInfoCard tutor={tutor} />
        </div>
      </div>
    </div>
  );
}

function TutorProfileHeader({ tutor }: { tutor: Tutor }) {
  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-2xl sm:mx-0">
            <Image
              src={tutor.avatar_url}
              alt={tutor.full_name}
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold sm:text-3xl">{tutor.full_name}</h1>
              {tutor.is_verified && (
                <Badge variant="secondary" className="gap-1">
                  <Verified className="text-primary h-3.5 w-3.5" />
                  Verified
                </Badge>
              )}
              {tutor.is_online && (
                <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                  <Monitor className="h-3 w-3" />
                  Online
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4 text-lg">{tutor.headline}</p>
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tutor.city}, {tutor.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="fill-accent text-accent h-4 w-4" />
                {tutor.rating_avg} ({tutor.rating_count} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {tutor.experience_years} years experience
              </span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {tutor.subjects.map((subject) => (
                <Link key={subject.id} href={`/subjects/${subject.slug}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {subject.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TutorAboutSection({ tutor }: { tutor: Tutor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          About Me
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="leading-relaxed">{tutor.bio}</p>
        {tutor.specialties.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {tutor.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {tutor.languages.map((lang) => (
              <Badge key={lang} variant="secondary">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TutorEducationSection({ tutor }: { tutor: Tutor }) {
  if (tutor.education.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tutor.education.map((edu) => (
          <div key={edu.id} className="border-l-primary border-l-2 pl-4">
            <p className="font-semibold">
              {edu.degree} in {edu.field}
            </p>
            <p className="text-muted-foreground text-sm">
              {edu.institution} · {edu.year}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TutorExperienceSection({ tutor }: { tutor: Tutor }) {
  if (tutor.experience.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {tutor.experience.map((exp) => (
          <div key={exp.id}>
            <p className="font-semibold">{exp.title}</p>
            <p className="text-muted-foreground text-sm">
              {exp.organization} · {exp.start_year}
              {exp.end_year ? ` – ${exp.end_year}` : " – Present"}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{exp.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TutorReviewsSection({ tutor }: { tutor: Tutor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Reviews ({tutor.rating_count})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <p className="text-4xl font-bold">{tutor.rating_avg}</p>
          <div>
            <StarRating rating={tutor.rating_avg} size="lg" />
            <p className="text-muted-foreground mt-1 text-sm">
              Based on {tutor.rating_count} reviews
            </p>
          </div>
        </div>
        <Separator />
        {tutor.reviews.length > 0 ? (
          <div className="space-y-5">
            {tutor.reviews.map((review) => (
              <div key={review.id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{review.student_name}</p>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function TutorAvailabilityCard({ tutor }: { tutor: Tutor }) {
  if (tutor.availability.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tutor.availability.map((slot) => (
          <div
            key={`${slot.day}-${slot.start_time}`}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium">{DAY_LABELS[slot.day]}</span>
            <span className="text-muted-foreground">
              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TutorInfoCard({ tutor }: { tutor: Tutor }) {
  const info = [
    { label: "Hourly Rate", value: `${formatCurrency(tutor.hourly_rate)}/hr` },
    { label: "Location", value: `${tutor.city}, ${tutor.country}` },
    { label: "Experience", value: `${tutor.experience_years} years` },
    { label: "Subjects", value: tutor.subjects.map((s) => s.name).join(", ") },
    { label: "Languages", value: tutor.languages.join(", ") },
    { label: "Lessons", value: `${tutor.rating_count}+ completed` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tutor Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {info.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0">{item.label}</span>
            <span className="text-right font-medium">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
