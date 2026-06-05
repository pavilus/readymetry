import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

const LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: ROUTES.pricing },
    { label: "Certifications", href: "/#certifications" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Resources", href: "/#resources" },
  ],
  Company: [
    { label: "About", href: ROUTES.about },
    { label: "Contact", href: ROUTES.contact },
  ],
  Legal: [
    { label: "Terms of Service", href: ROUTES.terms },
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Cookie Policy", href: ROUTES.cookies },
    { label: "Refund Policy", href: ROUTES.refund },
    { label: "Accessibility", href: ROUTES.accessibility },
    { label: "Exam Disclaimer", href: ROUTES.examDisclaimer },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Readymetry"
                width={480}
                height={144}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-[180px]">
              Certification Readiness Engine. Know if you&apos;re ready before exam day.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Readymetry. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built for welding professionals worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
