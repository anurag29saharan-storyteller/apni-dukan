import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Mail, Lock, AlertCircle } from "lucide-react";
import { login } from "../api";
import { useDocumentTitle } from "../useDocumentTitle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle("Sign in");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
      window.location.reload();
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="relative z-10 flex items-center gap-2 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 font-bold backdrop-blur">
            A
          </div>
          <span className="text-lg font-bold">Apni Dukan</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white">
            Fresh groceries,<br />delivered fast.
          </h2>
          <p className="mt-4 text-white/90">
            Sign in to order your daily essentials and track your deliveries in real time.
          </p>

          <div className="mt-8 flex items-center gap-3 text-white/90">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <ShoppingBasket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">1000+ products</p>
              <p className="text-xs text-white/80">Everyday essentials</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Apni Dukan
        </p>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-ink-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 font-bold text-white">
              A
            </div>
            <span className="text-lg font-bold text-ink-900">Apni Dukan</span>
          </Link>

          <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">
            Sign in to continue shopping.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              {loading && (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}