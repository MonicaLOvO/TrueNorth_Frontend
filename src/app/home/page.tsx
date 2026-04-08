import Link from "next/link";
import AppShell from "@/components/AppShell";
import BottomNav from "@/components/BottomNav";
import CategoryCard from "@/components/CategoryCard";
import TrueNorthLogo from "@/components/TrueNorthLogo";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3">
        <TrueNorthLogo size={42} priority />
        <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Home
        </div>
      </div>

      <p className="mt-3 text-slate-500 dark:text-slate-400">
        What would you like help deciding today?
      </p>

      <Link
        href="/chat"
        className="mt-6 flex items-center gap-4 rounded-2xl bg-sky-600 px-5 py-4 text-white shadow-md transition hover:bg-sky-700 active:scale-[0.98]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl">
          💬
        </div>
        <div>
          <div className="text-base font-semibold">Ask anything</div>
          <div className="text-sm text-white/75">
            Open the live AI chat and send your decision to the backend
          </div>
        </div>
      </Link>

      <div className="mt-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Categories
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 pb-28">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>

      <BottomNav />
    </AppShell>
  );
}