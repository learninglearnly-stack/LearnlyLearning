import { MapPin, Monitor, Star, Verified } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StarRating } from "@/components/tutors/star-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Link href={`/tutors/${tutor.id}`} className="group block h-full">
      <Card className="hover:border-primary/30 h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={tutor.avatar_url}
              alt={tutor.full_name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {tutor.is_online && (
              <Badge className="absolute top-3 left-3 gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                <Monitor className="h-3 w-3" />
                Online
              </Badge>
            )}
            {tutor.is_verified && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 gap-1 bg-white/90 text-foreground"
              >
                <Verified className="text-primary h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="group-hover:text-primary line-clamp-1 font-semibold transition-colors">
                {tutor.full_name}
              </h3>
              <p className="text-primary shrink-0 text-lg font-bold">
                {formatCurrency(tutor.hourly_rate)}
                <span className="text-muted-foreground text-xs font-normal">/hr</span>
              </p>
            </div>

            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{tutor.headline}</p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {tutor.subjects.slice(0, 2).map((subject) => (
                <Badge key={subject.id} variant="secondary" className="text-xs">
                  {subject.name}
                </Badge>
              ))}
              {tutor.subjects.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tutor.subjects.length - 2}
                </Badge>
              )}
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <StarRating rating={tutor.rating_avg} size="sm" />
                <span className="flex items-center gap-1">
                  <Star className="fill-accent text-accent h-3.5 w-3.5" />
                  {tutor.rating_avg}
                  <span className="text-muted-foreground">({tutor.rating_count})</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {tutor.city}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
