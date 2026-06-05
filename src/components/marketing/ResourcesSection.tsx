import Link from "next/link";
import { ArrowRight, Building2, FileText, HelpCircle, Mail } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const RESOURCES = [
  {
    icon: HelpCircle,
    title: "How Readymetry works",
    description: "See the preparation flow from certification selection to readiness review.",
    href: "/#how-it-works",
  },
  {
    icon: Building2,
    title: "Workforce preparation",
    description: "Discuss team readiness, certification goals, and organizational rollout needs.",
    href: ROUTES.contact,
  },
  {
    icon: Mail,
    title: "Support",
    description: "Get help with accounts, exam access, billing questions, or technical issues.",
    href: ROUTES.contact,
  },
  {
    icon: FileText,
    title: "Policies",
    description: "Review terms, privacy, refund, accessibility, cookie, and exam-disclaimer pages.",
    href: ROUTES.terms,
  },
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-700">Resources</p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Find the next right page</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Every major menu item now points to a live section or page, so visitors can move through the site without dead ends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.title}
                href={resource.href}
                className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand-200 hover:bg-white hover:shadow-[0_8px_30px_rgba(109,40,217,0.10)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-700 group-hover:bg-brand-50">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{resource.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted">{resource.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition-all group-hover:gap-2">
                  Open <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
