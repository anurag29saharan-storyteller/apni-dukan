import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut } from "lucide-react";
import { logout } from "../api";
import { clsx } from "clsx";

export default function AdminNavbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
    window.location.reload();
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-white/20 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    );

  return (
    <header className="sticky top-0 z-40 bg-ink-900 text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 font-bold">
              A
            </div>
            <span className="font-semibold">Admin</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={linkClass}>
              <Package className="h-4 w-4" /> Products
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              <ShoppingBag className="h-4 w-4" /> Orders
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}