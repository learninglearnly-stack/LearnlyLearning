import { GraduationCap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { APP_DESCRIPTION, APP_NAME, FOOTER_LINKS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="bg-primary-foreground/10 flex h-9 w-9 items-center justify-center rounded-xl">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-primary-foreground/80 mb-6 max-w-sm text-sm leading-relaxed">
              {APP_DESCRIPTION}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="accent" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-6">
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide uppercase">Platform</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide uppercase">Company</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide uppercase">Legal</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20 my-10" />

        <div className="text-primary-foreground/70 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Payments arranged directly between students and tutors.</p>
        </div>
      </div>
    </footer>
  );
}
