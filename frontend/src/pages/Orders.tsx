import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { fetchOrders, getToken } from "../api";
import type { OrderSummary } from "../api";
import EmptyState from "../components/EmptyState";
import { StatusBadge } from "../components/ui/Badge";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

export default function Orders() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useDocumentTitle("My Orders");

  useEffect(() => {
    if (!getToken()) return;
    fetchOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-ink-100" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-ink-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">My Orders</h1>
      <p className="mt-1 text-sm text-ink-500">
        View and track all your past orders.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="No orders yet"
            description="Once you place an order, it'll show up here."
            action={
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Package className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink-900">
                    Order #{o.id}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  Placed on {new Date(o.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-base font-bold text-ink-900">₹{o.total}</p>
                <ChevronRight className="ml-auto mt-1 h-4 w-4 text-ink-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}