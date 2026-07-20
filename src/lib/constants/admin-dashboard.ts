export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "layout-dashboard" },
  { href: "/admin/users", label: "Students", icon: "users" },
  { href: "/admin/tutors", label: "Tutors", icon: "graduation-cap" },
  { href: "/admin/bookings", label: "Bookings", icon: "book-open", badge: "Soon" },
  { href: "/admin/subjects", label: "Subjects", icon: "library" },
] as const;
