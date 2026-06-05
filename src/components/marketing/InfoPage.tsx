import type { ReactNode } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function InfoPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <header className="border-b border-border bg-surface px-4 pb-16 pt-52 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-foreground">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{intro}</p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="space-y-8 text-sm leading-relaxed text-muted">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
