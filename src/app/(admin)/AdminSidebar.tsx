"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, MessageSquare, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Overview",  href: "/admin" },
  { icon: Users,           label: "Users",     href: "/admin/users" },
  { icon: BookOpen,        label: "Questions", href: "/admin/questions" },
  { icon: MessageSquare,   label: "Tickets",   href: "/admin/tickets" },
  { icon: FileText,        label: "Audit Logs",href: "/admin/logs" },
];

export default function AdminSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full bg-[#2E1065] flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="bg-white rounded-xl px-2 py-1.5 inline-block">
          <Image src="/logo.png" alt="Readymetry" width={120} height={36} className="h-8 w-auto" />
        </div>
        <div className="mt-2 px-1">
          <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5 mt-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-purple-700 text-white"
                  : "text-purple-300 hover:bg-purple-900/40 hover:text-white"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-purple-900 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
        >
          <ExternalLink size={13} /> Back to App
        </Link>
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-white truncate">{name}</p>
          <p className="text-[10px] text-purple-400 capitalize">{role.replace("_", " ")}</p>
        </div>
      </div>
    </aside>
  );
}
