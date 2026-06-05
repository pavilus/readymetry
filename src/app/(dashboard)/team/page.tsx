import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { inviteWorkforceMember } from "@/lib/actions/team";
import { ROUTES } from "@/lib/constants";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const db = adminClient();
  const { data: org } = await db
    .from("workforce_organizations")
    .select("id, name, seat_limit, owner_user_id, created_at")
    .or(`owner_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: memberOrg } = org ? { data: null } : await db
    .from("workforce_members")
    .select("workforce_organizations(id, name, seat_limit, owner_user_id, created_at)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  const organization = org ?? (memberOrg as unknown as { workforce_organizations?: typeof org } | null)?.workforce_organizations;
  const { data: members } = organization
    ? await db
      .from("workforce_members")
      .select("id, email, role, status, invited_at, joined_at")
      .eq("organization_id", organization.id)
      .order("role", { ascending: false })
      .order("invited_at", { ascending: true })
    : { data: [] };

  const usedSeats = members?.filter((member: { status: string }) => member.status !== "removed").length ?? 0;
  const activeSeats = members?.filter((member: { status: string }) => member.status === "active").length ?? 0;
  const pendingSeats = members?.filter((member: { status: string }) => member.status === "pending").length ?? 0;
  const isOwner = organization?.owner_user_id === user.id;

  if (!organization) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <div className="rounded-2xl border border-border bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Team access</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Workforce is now self-serve. Purchase a team tier from pricing to create an organization, invite members, and give them Readiness Pack access.
          </p>
          <a href={ROUTES.pricing} className="mt-6 inline-flex rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
            View Workforce tiers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Workforce</p>
          <h1 className="mt-2 text-2xl font-extrabold text-foreground">{organization.name}</h1>
          <p className="mt-1 text-sm text-muted">Manage team seats and access.</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <span className="font-bold text-foreground">{usedSeats}</span>
          <span className="text-muted"> / {organization.seat_limit} seats assigned</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Active</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{activeSeats}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Pending</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{pendingSeats}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Available</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{Math.max(0, organization.seat_limit - usedSeats)}</p>
        </div>
      </div>

      {isOwner && (
        <section className="mb-6 rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-bold text-foreground">Invite a team member</h2>
          <form action={inviteWorkforceMember} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              required
              placeholder="member@example.com"
              className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-600"
            />
            <button type="submit" className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
              Add seat
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">
            Existing Readymetry users are activated immediately. New users are marked pending and receive access after signing in with the invited email.
          </p>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-bold text-foreground">Members</h2>
        </div>
        <div className="divide-y divide-border">
          {(members ?? []).map((member: { id: string; email: string; role: string; status: string; joined_at: string | null }) => (
            <div key={member.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{member.email}</p>
                <p className="text-xs capitalize text-muted">{member.role}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                member.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {member.status === "active" ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
