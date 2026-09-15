import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white py-16 px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}