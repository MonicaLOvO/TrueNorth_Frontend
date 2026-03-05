"use client";

import AppShell from "@/components/AppShell";

import Link from "next/link";

import { useMemo, useState } from "react";

type Place = {

  id: string;

  name: string;

  cuisine: string;

  price: string;

  rating: number;

  reviews: number;

  distanceMi: number;

  openText: string;

  tags: string[];

};

const FILTERS = ["All", "Open Now", "Nearby", "Top Rated"] as const;

type Filter = (typeof FILTERS)[number];

export default function ExplorePage() {

  const [filter, setFilter] = useState<Filter>("All");

  const places: Place[] = useMemo(

    () => [

      {

        id: "1",

        name: "Trattoria Milano",

        cuisine: "Italian",

        price: "$$",

        rating: 4.8,

        reviews: 324,

        distanceMi: 0.4,

        openText: "Open until 10:00 PM",

        tags: ["Pasta", "Wine", "Romantic"],

      },

      {

        id: "2",

        name: "Bella Vista",

        cuisine: "Italian",

        price: "$$$",

        rating: 4.6,

        reviews: 189,

        distanceMi: 0.8,

        openText: "Open until 11:00 PM",

        tags: ["Fine Dining", "Seafood"],

      },

      {

        id: "3",

        name: "Osteria del Porto",

        cuisine: "Italian",

        price: "$$",

        rating: 4.7,

        reviews: 256,

        distanceMi: 1.5,

        openText: "Open until 9:30 PM",

        tags: ["Seafood", "Outdoor"],

      },

      {

        id: "4",

        name: "La Piazza",

        cuisine: "Italian",

        price: "$",

        rating: 4.5,

        reviews: 412,

        distanceMi: 1.8,

        openText: "Open until 10:30 PM",

        tags: ["Pizza", "Casual"],

      },

      {

        id: "5",

        name: "Cucina Verde",

        cuisine: "Italian",

        price: "$$",

        rating: 4.9,

        reviews: 567,

        distanceMi: 1.2,

        openText: "Closed",

        tags: ["Family Style", "Homemade"],

      },

    ],

    []

  );

  const filtered = useMemo(() => {

    if (filter === "All") return places;

    if (filter === "Open Now") {

      return places.filter((p) => !p.openText.toLowerCase().includes("closed"));

    }

    if (filter === "Nearby") {

      return places.filter((p) => p.distanceMi <= 1.0);

    }

    if (filter === "Top Rated") {

      return [...places].sort((a, b) => b.rating - a.rating).slice(0, 3);

    }

    return places;

  }, [filter, places]);

  return (
<AppShell>

      {/* Header */}
<div className="flex items-center justify-between">
<Link

          href="/home"

          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800"

          aria-label="Back"
>

          ←
</Link>
<div className="text-lg font-semibold">Explore Nearby</div>
<button

          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800"

          aria-label="Refine"

          onClick={() => alert("Refine (hook up later)")}
>

          ≡
</button>
</div>

      {/* Map card (placeholder) */}
<div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/20 shadow-sm dark:border-slate-800">
<div className="relative h-40 bg-[linear-gradient(90deg,rgba(56,189,248,0.15),rgba(14,165,233,0.08))]">

          {/* fake map pins */}
<div className="absolute left-10 top-10 h-8 w-8 rounded-full bg-sky-600/30 ring-2 ring-sky-400/50" />
<div className="absolute left-40 top-16 h-8 w-8 rounded-full bg-sky-600/30 ring-2 ring-sky-400/50" />
<div className="absolute right-16 top-24 h-8 w-8 rounded-full bg-sky-600/30 ring-2 ring-sky-400/50" />
<button

            className="absolute right-4 bottom-4 rounded-full bg-slate-900/70 px-4 py-2 text-sm text-white backdrop-blur hover:bg-slate-900"

            onClick={() => alert("Expand map (hook up later)")}
>

            ⦿ Expand map
</button>
</div>
</div>

      {/* Filter chips */}
<div className="mt-4 flex gap-2 overflow-x-auto pb-1">

        {FILTERS.map((f) => {

          const active = f === filter;

          return (
<button

              key={f}

              onClick={() => setFilter(f)}

              className={[

                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",

                active

                  ? "bg-sky-600 text-white"

                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",

              ].join(" ")}
>

              {f}
</button>

          );

        })}
</div>

      {/* Count */}
<div className="mt-4 text-sm text-slate-500">

        {filtered.length} places found nearby
</div>

      {/* Places list */}
<div className="mt-3 space-y-4">

        {filtered.map((p) => (
<button

            key={p.id}

            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"

            onClick={() => alert(`Open ${p.name} (details page later)`)}
>
<div className="flex items-center gap-4">

              {/* thumbnail placeholder */}
<div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800" />
<div className="flex-1">
<div className="flex items-start justify-between gap-3">
<div>
<div className="text-lg font-semibold">{p.name}</div>
<div className="text-sm text-slate-500 dark:text-slate-400">

                      {p.cuisine} · {p.price}
</div>
</div>
<div className="text-slate-400">›</div>
</div>
<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
<div className="text-amber-400">★</div>
<div className="text-slate-200 dark:text-slate-200">
<span className="font-semibold">{p.rating.toFixed(1)}</span>{" "}
<span className="text-slate-500 dark:text-slate-400">

                      ({p.reviews})
</span>
</div>
<div className="text-slate-500 dark:text-slate-400">

                    • {p.distanceMi} mi
</div>
</div>
<div className="mt-2 text-sm">

                  {p.openText.toLowerCase().includes("closed") ? (
<span className="text-slate-500 dark:text-slate-400">

                      ⏱ Closed
</span>

                  ) : (
<span className="text-emerald-500">🟢 {p.openText}</span>

                  )}
</div>
<div className="mt-3 flex flex-wrap gap-2">

                  {p.tags.map((t) => (
<span

                      key={t}

                      className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
>

                      {t}
</span>

                  ))}
</div>
</div>
</div>
</button>

        ))}
</div>
</AppShell>

  );

}
 