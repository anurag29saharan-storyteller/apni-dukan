import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, LogOut, Package, Shield, Home as HomeIcon } from "lucide-react";
import { logout } from "../api";
import { useCurrentUser } from "../useCurrentUser";
import { useCart } from "../context/CartContext";
import { clsx } from "clsx";

export default function Navbar() {
  const { user } = useCurrentUser();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}` : "/");
  }

  function handleLogout() {
    logout();
    navigate("/");
    window.location.reload();
  }

  const linkBase =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      linkBase,
      isActive
        ? "text-brand-700 bg-brand-50"
        : "text-ink-700 hover:text-ink-900 hover:bg-ink-100"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white font-bold">
            A
          </div>
          <span className="hidden text-lg font-bold text-ink-900 sm:block">
            Apni Dukan
          </span>
        </Link>

        {/* Search (desktop) */}
        <form
          onSubmit={submitSearch}
          className="hidden flex-1 max-w-xl md:flex"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for milk, snacks, beverages..."
              className="w-full rounded-full border border-ink-200 bg-ink-50 py-2 pl-10 pr-4 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>

        {/* Desktop right side */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>
            <HomeIcon className="h-4 w-4" />
            Home
          </NavLink>

          {user && (
            <NavLink to="/orders" className={linkClass}>
              <Package className="h-4 w-4" />
              Orders
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                clsx(
                  linkBase,
                  "text-brand-700 bg-brand-50 hover:bg-brand-100",
                  isActive && "bg-brand-100"
                )
              }
            >
              <Shield className="h-4 w-4" />
              Admin
            </NavLink>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative ml-1" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-lg pl-1 pr-3 hover:bg-ink-100"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-ink-800">
                  {user.email.split("@")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="text-xs text-ink-500">Signed in as</p>
                    <p className="truncate text-sm font-medium text-ink-900">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                    >
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-ink-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile right side */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <form onSubmit={submitSearch} className="px-4 pt-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-ink-200 bg-ink-50 py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          </form>

          <nav className="flex flex-col p-3">
            <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100">
              <HomeIcon className="h-4 w-4" /> Home
            </Link>
            {user && (
              <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100">
                <Package className="h-4 w-4" /> My Orders
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50">
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            <div className="my-2 border-t border-ink-100" />
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}