"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Certifications", href: "#certifications" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Readymetry"
              width={480}
              height={144}
              className="h-[134px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-muted hover:text-foreground rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.login}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href={ROUTES.signup}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-border bg-white transition-all duration-200",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm text-muted hover:text-foreground rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <Link
              href={ROUTES.login}
              className="text-sm font-medium text-center py-2.5 rounded-lg border border-border hover:bg-surface transition-colors"
            >
              Log In
            </Link>
            <Link
              href={ROUTES.signup}
              className="text-sm font-semibold text-center py-2.5 rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
