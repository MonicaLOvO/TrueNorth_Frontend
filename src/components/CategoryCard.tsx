import Link from "next/link";
import { Category } from "@/lib/categories";

export default function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/category/${cat.slug}/guided`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md active:scale-[0.97] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-sky-50 dark:bg-slate-800 dark:group-hover:bg-sky-950">
        {cat.emoji}
      </div>
      <div className="mt-3">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {cat.title}
        </div>
        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {cat.subtitle}
        </div>
        <div className="mt-3 text-xs font-semibold text-sky-600 dark:text-sky-400">
          Open guided mode →
        </div>
      </div>
    </Link>
  );
}