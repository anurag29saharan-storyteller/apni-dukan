import { clsx } from "clsx";
import type { Category } from "../api";

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (name: string) => void;
}

export default function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => onSelect("")}
        className={clsx(
          "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
          selected === ""
            ? "border-brand-600 bg-brand-600 text-white shadow-sm"
            : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700"
        )}
      >
        All
      </button>

      {categories.map((c) => {
        const active = selected === c.name;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.name)}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
              active
                ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700"
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}