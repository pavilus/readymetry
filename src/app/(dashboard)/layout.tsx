export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar — built in dashboard phase */}
      <aside className="w-64 shrink-0 border-r border-border bg-surface-raised" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
