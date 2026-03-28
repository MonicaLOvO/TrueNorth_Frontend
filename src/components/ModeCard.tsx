import Link from "next/link";

export default function ModeCard({
  title,
  subtitle,
  href,
  recommended,
}: {
  title: string;
  subtitle: string;
  href: string;
  recommended?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
    >
      <div className="flex-1">
        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        {recommended ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            Recommended
          </span>
        ) : null}
        <span className="text-slate-300 transition group-hover:text-sky-500 dark:text-slate-600 dark:group-hover:text-sky-400">
          →
        </span>
      </div>
    </Link>
  );
}