import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, Check } from "lucide-react";
import { register } from "../api";
import { useDocumentTitle } from "../useDocumentTitle";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle("Create account");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate("/login");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
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

          <h1 className="text-2xl font-bold text-ink-900">Create account</h1>
          <p className="mt-1 text-sm text-ink-500">
            Get started in seconds.
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
                  placeholder="At least 6 characters"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="relative z-10 flex items-center gap-2 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 font-bold backdrop-blur">
            A
          </div>
          <span className="text-lg font-bold">Apni Dukan</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white">
            Join thousands of<br />happy customers.
          </h2>
          <p className="mt-4 text-white/90">
            Fresh produce, dairy, snacks and more — at your door in 10 minutes.
          </p>

          <ul className="mt-8 space-y-3 text-white/90">
            <li className="flex items-center gap-2 text-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5" />
              </span>
              Free delivery over ₹199
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5" />
              </span>
              Cash on delivery available
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5" />
              </span>
              Easy returns & refunds
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Apni Dukan
        </p>

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/5" />
      </div>
    </div>
  );
}