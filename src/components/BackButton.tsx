"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:bg-slate-800 dark:hover:text-sky-400"
    >
      <ArrowLeft size={14} strokeWidth={2.5} />
      Back
    </Link>
  );
}