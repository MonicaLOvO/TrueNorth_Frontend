import Image from "next/image";
import { cn } from "@/lib/cn";

type TrueNorthLogoProps = {
  size?: number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  priority?: boolean;
};

export default function TrueNorthLogo({
  size = 36,
  showText = true,
  textClassName,
  className,
  priority = false,
}: TrueNorthLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} style={{ lineHeight: 1 }}>
      <Image
        src="/truenorth-compass.png"
        alt="TrueNorth compass"
        width={size}
        height={size}
        priority={priority}
        className="shrink-0"
      />
      {showText ? (
        <span
          className={cn(
            "text-xl font-bold tracking-tight text-slate-900 dark:text-white",
            textClassName,
          )}
        >
          TrueNorth
        </span>
      ) : null}
    </div>
  );
}