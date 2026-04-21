import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  color = "#1d1d1f",
  size = 32,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-medium select-none",
        className
      )}
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
