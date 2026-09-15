import { clsx } from "clsx";
import type { InputHTMLAttributes, forwardRef } from "react";
import { forwardRef as fRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const Input = fRef<HTMLInputElement, Props>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900",
        "placeholder:text-ink-400",
        "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        className
      )}
      {...rest}
    />
  )
);

export default Input;