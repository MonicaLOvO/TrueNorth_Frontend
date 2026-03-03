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
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">{title}</div>
        {recommended ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            Recommended
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {subtitle}
      </div>
    </Link>
  );
}