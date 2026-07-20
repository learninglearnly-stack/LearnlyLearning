export const FILTER_OPTIONS = {
  languages: ["English", "Spanish", "French", "German", "Mandarin", "Arabic", "Portuguese", "Hindi"],
  cities: [
    "New York",
    "Los Angeles",
    "Chicago",
    "London",
    "Toronto",
    "Sydney",
    "Berlin",
    "Dubai",
    "Singapore",
    "Remote",
  ],
  availability: [
    { value: "weekdays", label: "Weekdays" },
    { value: "weekends", label: "Weekends" },
    { value: "evenings", label: "Evenings" },
    { value: "mornings", label: "Mornings" },
  ],
  sort: [
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviews" },
    { value: "rate_low", label: "Price: Low to High" },
    { value: "rate_high", label: "Price: High to Low" },
    { value: "experience", label: "Most Experience" },
  ],
} as const;
