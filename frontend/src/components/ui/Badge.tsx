import { clsx } from "clsx";
import type { ReactNode } from "react";

const statusStyles: Record<string, string> = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-amber-50 text-amber-700 border-amber-200",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-brand-50 text-brand-700 border-brand-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-ink-100 text-ink-700 border-ink-200"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-700",
        className
      )}
    >
      {children}
    </span>
  );
}