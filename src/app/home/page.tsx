import AppShell from "@/components/AppShell";
import BottomNav from "@/components/BottomNav";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white">
          🧭
        </div>
        <div className="text-xl font-semibold">TrueNorth</div>
      </div>

      <p className="mt-2 text-slate-600 dark:text-slate-400">
        What would you like help deciding today?
      </p>

      <Link
        href="/category/food/chat"
        className="mt-6 block rounded-2xl bg-sky-600 px-5 py-4 text-white shadow hover:bg-sky-700"
      >
        <div className="text-base font-semibold">Ask anything</div>
        <div className="text-sm text-white/80">
          Get personalized AI recommendations
        </div>
      </Link>

      <div className="mt-7 text-xs font-semibold tracking-widest text-slate-500">
        CATEGORIES
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 pb-24">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>

      <BottomNav />
    </AppShell>
  );
}