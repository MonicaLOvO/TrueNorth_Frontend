import Link from "next/link";

import { Category } from "@/lib/categories";

export default function CategoryCard({ cat }: { cat: Category }) {

  return (
<Link

      href={`/category/${cat.slug}/guided`}

      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
>
<div className="flex items-start gap-3">
<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">

          {cat.emoji}
</div>
<div>
<div className="text-base font-semibold">{cat.title}</div>
<div className="text-sm text-slate-500 dark:text-slate-400">

            {cat.subtitle}
</div>
</div>
</div>
</Link>

  );

}
 