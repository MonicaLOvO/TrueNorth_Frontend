"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Home, Compass, Mic, MessageCircle, User } from "lucide-react";

const items = [
 { href: "/home", label: "Home", icon: Home },
 { href: "/explore", label: "Explore", icon: Compass },
 { href: "/category/food/voice", label: "", icon: Mic }, // center mic
 { href: "/chat", label: "Chat", icon: MessageCircle },
 { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
 const pathname = usePathname();
 return (
<div className="fixed bottom-4 left-0 right-0 z-50">
<div className="mx-auto w-full max-w-[560px] px-4">
<nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
         {items.map((item) => {
           const Icon = item.icon;
           //avoids /home highlighting everything
           const active =
             pathname === item.href ||
             (item.href !== "/home" && pathname?.startsWith(item.href));
           if (item.icon === Mic) {
             return (
<Link
                 key={item.href}
                 href={item.href}
                 className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-md hover:bg-sky-700"
                 aria-label="Voice"
>
<Icon size={22} />
</Link>
             );
           }
           return (
<Link
               key={item.label}
               href={item.href}
               className={cn(
                 "flex flex-col items-center gap-1 text-xs text-slate-500",
                 active && "text-sky-600 dark:text-sky-400"
               )}
>
<Icon size={18} />
               {item.label}
</Link>
           );
         })}
</nav>
</div>
</div>
 );
}