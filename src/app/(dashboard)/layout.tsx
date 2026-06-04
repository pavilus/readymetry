import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";
import DashboardSidebar from "./DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const [{ data: profileRaw }, { data: enrollment }] = await Promise.all([
    supabase.from("user_profiles").select("full_name, subscription_tier").eq("id", user.id).maybeSingle(),
    supabase.from("user_certifications").select("certifications(code)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const profile = profileRaw as { full_name: string | null; subscription_tier: string } | null;
  const enrollmentRow = enrollment as unknown as { certifications: { code: string } | null } | null;

  const certification = enrollmentRow?.certifications;
  const name = profile?.full_name || user.email || "Readymetry User";
  const subtitle = certification?.code
    ? `${certification.code} Candidate`
    : `${profile?.subscription_tier ?? "starter"} plan`;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5FA]">
      <div className="w-[460px] shrink-0">
        <DashboardSidebar name={name} subtitle={subtitle} />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
