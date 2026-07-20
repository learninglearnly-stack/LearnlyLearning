export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Learnly";

export const APP_DESCRIPTION =
  "Discover expert tutors, book 1-on-1 lessons, and achieve your learning goals. No payment processing — arrange fees directly with your tutor.";

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/tutors", label: "Tutors" },
  { href: "/subjects", label: "Subjects" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { href: "/tutors", label: "Find Tutors" },
    { href: "/subjects", label: "Browse Subjects" },
    { href: "/become-a-tutor", label: "Become a Tutor" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;

export const STATS = [
  { value: "12+", label: "Subjects" },
  { value: "500+", label: "Expert Tutors" },
  { value: "8,200+", label: "Lessons Booked" },
  { value: "4.9", label: "Avg. Rating" },
] as const;

export const BENEFITS = [
  {
    title: "1-on-1 Teaching",
    description:
      "Personalized lessons tailored to your pace, goals, and learning style with dedicated attention.",
    icon: "users" as const,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Book lessons that fit your calendar. Morning, evening, or weekend — learn on your terms.",
    icon: "calendar" as const,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    title: "Verified Tutors",
    description:
      "Every tutor is vetted for expertise. Read reviews, compare profiles, and choose with confidence.",
    icon: "shield" as const,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    title: "Direct Communication",
    description:
      "Message tutors before and after booking. Coordinate payment and lesson details privately.",
    icon: "message" as const,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
] as const;

export const SUBJECTS_PREVIEW = [
  { name: "Mathematics", slug: "mathematics", tutors: 84 },
  { name: "English", slug: "english", tutors: 120 },
  { name: "Spanish", slug: "spanish", tutors: 67 },
  { name: "Physics", slug: "physics", tutors: 45 },
  { name: "Programming", slug: "programming", tutors: 93 },
  { name: "Chemistry", slug: "chemistry", tutors: 38 },
  { name: "Music", slug: "music", tutors: 52 },
  { name: "Business", slug: "business", tutors: 41 },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Find Your Tutor",
    description: "Search by subject, rate, rating, or availability. Compare profiles and read reviews.",
  },
  {
    step: "02",
    title: "Request a Lesson",
    description: "Send a booking request with your preferred time. The tutor accepts or suggests alternatives.",
  },
  {
    step: "03",
    title: "Learn & Grow",
    description: "Attend your lesson, arrange payment directly, and leave a review to help others.",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "University Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "I found an amazing calculus tutor within hours. The booking process was seamless, and my grades improved significantly in one semester.",
  },
  {
    name: "Marcus Johnson",
    role: "Working Professional",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "Learnly made it easy to find a Spanish tutor for business conversations. Flexible scheduling around my work hours was a game-changer.",
  },
  {
    name: "Emily Rodriguez",
    role: "High School Parent",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "My daughter's physics tutor is patient and knowledgeable. The review system helped us pick the right match on the first try.",
  },
] as const;
