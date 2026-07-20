export const TUTOR_NAV_ITEMS = [
  { href: "/tutor", label: "Overview", icon: "layout-dashboard" },
  { href: "/tutor/profile", label: "Profile", icon: "user" },
  { href: "/tutor/availability", label: "Availability", icon: "calendar" },
  { href: "/tutor/bookings", label: "Bookings", icon: "book-open" },
  { href: "/tutor/messages", label: "Messages", icon: "message-square", badge: "Soon" },
  { href: "/tutor/reviews", label: "Reviews", icon: "star", badge: "Soon" },
  { href: "/tutor/settings", label: "Settings", icon: "settings", badge: "Soon" },
] as const;

export const BECOME_TUTOR_STEPS = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Add your photo, headline, bio, subjects, and hourly rate. Showcase your expertise to students.",
  },
  {
    step: "02",
    title: "Set Your Availability",
    description:
      "Define your weekly schedule so students know when you're free for lessons.",
  },
  {
    step: "03",
    title: "Start Teaching",
    description:
      "Receive booking requests, chat with students, and arrange payment directly. ",
  },
] as const;

export const TUTOR_BENEFITS = [
  {
    title: "Set Your Own Rates",
    description: "You decide what to charge. No commission — keep 100% of what you earn.",
    icon: "dollar-sign",
  },
  {
    title: "Flexible Schedule",
    description: "Teach when it suits you. Update availability anytime from your dashboard.",
    icon: "clock",
  },
  {
    title: "Reach More Students",
    description: "Get discovered by students searching for tutors in your subjects and city.",
    icon: "users",
  },
  {
    title: "Build Your Reputation",
    description: "Collect reviews, earn verified status, and grow your tutoring practice.",
    icon: "award",
  },
] as const;

export const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
] as const;

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const value = `${hours.toString().padStart(2, "0")}:${minutes}`;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const label = `${displayHours}:${minutes} ${period}`;
  return { value, label };
});
