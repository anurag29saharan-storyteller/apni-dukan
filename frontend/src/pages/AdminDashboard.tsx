import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { getToken, fetchMe } from "../api";
import { toast } from "sonner";
import type { User } from "../api";
import { useDocumentTitle } from "../useDocumentTitle";

const API_URL = "http://localhost:8000";

type Stats = {
  total_products: number;
  total_orders: number;
  total_revenue: string;
  low_stock: { id: number; name: string; stock: number }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useDocumentTitle("Admin · Dashboard");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    fetchMe()
      .then((me) => {
        if (me.role !== "admin") {
          toast.error("Admin access only");
          navigate("/");
          return;
        }
        setUser(me);
        const token = getToken();
        fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then(setStats)
          .catch(() => toast.error("Failed to load stats"));
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!stats || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-56 animate-pulse rounded bg-ink-100" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-ink-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-500">
            Welcome back, {user.email.split("@")[0]}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Total Products"
          value={stats.total_products}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Total Orders"
          value={stats.total_orders}
          accent="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<IndianRupee className="h-5 w-5" />}
          label="Total Revenue"
          value={`₹${Number(stats.total_revenue).toLocaleString()}`}
          accent="bg-brand-50 text-brand-700"
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/products"
          className="group flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-ink-900">Manage Products</p>
              <p className="text-sm text-ink-500">
                Add, edit, and update stock levels
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-ink-400 transition group-hover:translate-x-1 group-hover:text-brand-600" />
        </Link>

        <Link
          to="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-ink-900">Manage Orders</p>
              <p className="text-sm text-ink-500">
                Track and update order statuses
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-ink-400 transition group-hover:translate-x-1 group-hover:text-brand-600" />
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-ink-200 bg-white">
        <div className="flex items-center gap-2 border-b border-ink-100 px-6 py-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-ink-900">
            Low Stock Products
          </h2>
        </div>

        {stats.low_stock.length === 0 ? (
          <p className="px-6 py-8 text-sm text-ink-500">
            All products are well-stocked.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {stats.low_stock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-6 py-3.5"
              >
                <span className="text-sm font-medium text-ink-900">
                  {p.name}
                </span>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}