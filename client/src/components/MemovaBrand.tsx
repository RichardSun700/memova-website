import { cn } from "@/lib/utils";

type MemovaBrandProps = {
  className?: string;
  compact?: boolean;
};

export default function MemovaBrand({
  className,
  compact = false,
}: MemovaBrandProps) {
  return (
    <span
      className={cn(
        "memova-brand-lockup",
        compact && "memova-brand-lockup--compact",
        className
      )}
    >
      <img
        className="memova-brand-icon"
        src="/brand/memova-app-icon-liquid-blue.svg"
        alt=""
        aria-hidden="true"
        width="32"
        height="32"
      />
      <img
        className="memova-brand-wordmark"
        src="/brand/memova-wordmark-blue.svg"
        alt="Memova"
        width="110"
        height="14"
      />
    </span>
  );
}
