import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://readymetry.com"),
  title: {
    default: "Readymetry | Certification Readiness Engine",
    template: "%s | Readymetry",
  },
  description:
    "Know if you're ready before exam day. AI-powered certification prep with readiness scoring, analytics, and realistic simulations.",
  keywords: ["certification", "exam prep", "CWI", "AWS", "welding inspector", "readiness"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Readymetry | Certification Readiness Engine",
    description: "Realistic certification practice exams and readiness analytics for inspection professionals.",
    url: "/",
    siteName: "Readymetry",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Readymetry | Certification Readiness Engine",
    description: "Know if you are ready before exam day.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
