"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, BarChart2, Settings, LogOut, LifeBuoy } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/account";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: ROUTES.dashboard },
  { icon: BookOpen, label: "Practice Tests", href: ROUTES.exams },
  { icon: BarChart2, label: "Analytics", href: ROUTES.analytics },
  { icon: LifeBuoy, label: "Support", href: ROUTES.support },
  { icon: Settings, label: "Settings", href: ROUTES.settings },
];

export default function DashboardSidebar({ name, subtitle }: { name: string; subtitle: string }) {
  const pathname = usePathname();
  const initial = name.trim().charAt(0).toUpperCase() || "R";

  return (
    <aside className="w-full bg-[#2E1065] flex flex-col h-full">
      <div className="p-4 pb-3">
        <div className="bg-white rounded-xl px-3 py-2 inline-block">
          <Image src="/logo.png" alt="Readymetry" width={480} height={144} className="h-10 w-auto" />
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5 mt-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              active ? "bg-brand-700 text-white" : "text-purple-300 hover:bg-purple-900/40 hover:text-white"
            )}>
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-purple-900">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[11px] text-purple-400 truncate">{subtitle}</p>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit" title="Sign out" className="text-purple-400 hover:text-white transition-colors">
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
