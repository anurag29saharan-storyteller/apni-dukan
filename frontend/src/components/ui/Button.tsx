import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
    secondary:
      "bg-white text-ink-800 border border-ink-200 hover:bg-ink-100",
    ghost:
      "bg-transparent text-ink-700 hover:bg-ink-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<Size, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}