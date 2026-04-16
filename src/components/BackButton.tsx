"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;
  fallbackHref?: string;
  useHistory?: boolean;
  label?: string;
};

const baseClassName =
  "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:bg-slate-800 dark:hover:text-sky-400";

export default function BackButton({
  href = "/home",
  fallbackHref,
  useHistory = false,
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  if (useHistory) {
    return (
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
          }

          router.push(fallbackHref ?? href);
        }}
        className={baseClassName}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      <ArrowLeft size={14} strokeWidth={2.5} />
      {label}
    </Link>
  );
}