import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 text-center">
      <div>
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-ink-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link
            to="/?focus=search"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-100"
          >
            <Search className="h-4 w-4" /> Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}