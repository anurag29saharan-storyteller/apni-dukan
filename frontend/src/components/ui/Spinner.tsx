export default function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-full border-2 border-ink-300 border-t-brand-600 animate-spin`}
    />
  );
}