import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRaw } = await supabase.from("user_profiles").select("role, full_name").eq("id", user.id).single();
  const profile = profileRaw as { role: "user" | "admin"; full_name: string | null } | null;
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5FA]">
      <div className="w-[220px] shrink-0">
        <AdminSidebar name={profile.full_name ?? user.email ?? "Admin"} role={profile.role} />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
