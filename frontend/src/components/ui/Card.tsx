import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export default function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-white border border-ink-200 rounded-xl shadow-sm",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}