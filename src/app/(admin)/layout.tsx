import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";

const ADMIN_ROLES = ["admin", "super_admin", "content_manager", "support_agent"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).single() as any;
  if (!profile || !ADMIN_ROLES.includes(profile.role)) redirect("/dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5FA]">
      <div className="w-[220px] shrink-0">
        <AdminSidebar name={profile.full_name ?? profile.email} role={profile.role} />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
