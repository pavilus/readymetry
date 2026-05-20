import Link from "next/link";
import Image from "next/image";

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
      <Link href="/" className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="Readymetry"
          width={480}
          height={144}
          className="h-[134px] w-auto"
          priority
        />
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
