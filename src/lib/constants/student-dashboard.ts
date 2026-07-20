export const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "layout-dashboard" },
  { href: "/dashboard/bookings", label: "My Bookings", icon: "book-open" },
  { href: "/dashboard/messages", label: "Messages", icon: "message-square", badge: "Soon" },
  { href: "/dashboard/favorites", label: "Favorites", icon: "heart", badge: "Soon" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "star", badge: "Soon" },
  { href: "/dashboard/profile", label: "Profile", icon: "user", badge: "Soon" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings", badge: "Soon" },
] as const;

export const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;
