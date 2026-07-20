import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < Math.floor(rating)
              ? "fill-accent text-accent"
              : i < rating
                ? "fill-accent/50 text-accent"
                : "fill-muted text-muted",
          )}
        />
      ))}
      {showValue && (
        <span className="text-muted-foreground ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
