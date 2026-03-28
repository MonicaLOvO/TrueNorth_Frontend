export default function TrueNorthLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5" style={{ lineHeight: 1 }}>
      <div
        className="flex items-center justify-center rounded-full bg-sky-600 shadow-sm"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 20 20"
          fill="none"
        >
          <polygon points="10,2 12,11 10,9 8,11" fill="white" opacity="0.95" />
          <polygon points="10,18 12,11 10,13 8,11" fill="white" opacity="0.4" />
          <circle cx="10" cy="11" r="1.5" fill="white" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        TrueNorth
      </span>
    </div>
  );
}