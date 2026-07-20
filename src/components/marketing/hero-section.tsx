import { ArrowRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TUTOR_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    alt: "Tutor teaching online",
    className: "top-0 right-0",
    bg: "bg-rose-100 dark:bg-rose-950",
  },
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    alt: "Professional tutor",
    className: "top-0 left-0",
    bg: "bg-indigo-100 dark:bg-indigo-950",
  },
  {
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    alt: "Female tutor",
    className: "bottom-0 right-0",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    alt: "Male tutor",
    className: "bottom-0 left-0",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
];

export function HeroSection() {
  return (
    <section className="gradient-hero relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <Badge variant="accent" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              100% Satisfaction Focused
            </Badge>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary relative">
                Tutor
                <svg
                  className="text-accent absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C50 2 100 10 198 4"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Online
            </h1>

            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              Connect with expert tutors for personalized 1-on-1 lessons. Search by subject,
              compare profiles, book sessions, and arrange payment directly — 
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/tutors">
                  Find Tutors
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works" className="gap-2">
                  <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                  How It Works
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-4 p-4">
              {TUTOR_IMAGES.map((img) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-3xl shadow-lg ${img.bg}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
              ))}
            </div>

            <div className="bg-card absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border px-6 py-3 shadow-lg">
              <p className="text-sm font-medium">
                <span className="text-primary text-lg font-bold">4.9</span>
                <span className="text-muted-foreground ml-1">avg. tutor rating</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
