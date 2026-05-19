import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 justify-center mb-8">
        <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shadow-[0_4px_14px_rgba(109,40,217,0.4)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="white" fillOpacity="0.9" />
            <path d="M12 7l-4 2.5v5L12 17l4-2.5v-5L12 7z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-foreground tracking-tight">Readymetry</span>
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-8">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        {children}
      </div>

      {footer && (
        <div className="text-center mt-5 text-sm text-muted">{footer}</div>
      )}
    </div>
  );
}
