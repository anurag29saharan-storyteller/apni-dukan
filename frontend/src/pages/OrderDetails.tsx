import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Package,
  Truck,
  Home as HomeIcon,
  XCircle,
} from "lucide-react";
import { fetchOrder, getToken } from "../api";
import type { Order } from "../api";
import { StatusBadge } from "../components/ui/Badge";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

const STEPS = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(`Order #${id}`);

  useEffect(() => {
    if (!id || !getToken()) return;
    fetchOrder(Number(id))
      .then(setOrder)
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-6 w-24 animate-pulse rounded bg-ink-100" />
        <div className="mt-4 h-10 w-56 animate-pulse rounded bg-ink-100" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-ink-100" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-ink-500">Order not found.</p>
        <Link
          to="/orders"
          className="mt-4 inline-block text-brand-600 hover:underline"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const cancelled = order.status === "CANCELLED";
  const currentStep = STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-500">
        <Link to="/orders" className="hover:text-brand-600">
          My Orders
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-900">#{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            Order #{order.id}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {cancelled ? (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <XCircle className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">Order cancelled</p>
            <p className="text-sm text-red-700">
              This order was cancelled and will not be delivered.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-ink-200 bg-white p-6">
          <div className="relative flex items-center justify-between">
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const icons = [Package, Package, Truck, HomeIcon];
              const Icon = icons[i];
              return (
                <div
                  key={step}
                  className="relative z-10 flex flex-1 flex-col items-center"
                >
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${
                      done
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-ink-200 bg-white text-ink-400"
                    }`}
                  >
                    {done && i < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-center text-xs font-medium ${
                      done ? "text-brand-700" : "text-ink-400"
                    }`}
                  >
                    {step.replace(/_/g, " ")}
                  </p>
                </div>
              );
            })}

            <div className="absolute left-[12.5%] right-[12.5%] top-5 -z-0 h-0.5 bg-ink-200">
              <div
                className="h-full bg-brand-600 transition-all"
                style={{
                  width: `${
                    currentStep <= 0
                      ? 0
                      : (currentStep / (STEPS.length - 1)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="text-base font-semibold text-ink-900">
            Items in this order
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Product</th>
              <th className="px-6 py-3 text-right font-medium">Price</th>
              <th className="px-6 py-3 text-right font-medium">Qty</th>
              <th className="px-6 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {order.items.map((it) => (
              <tr key={it.id}>
                <td className="px-6 py-4 text-ink-900">
                  {it.product_id ? (
                    <Link
                      to={`/products/${it.product_id}`}
                      className="font-medium hover:text-brand-700"
                    >
                      {it.product_name}
                    </Link>
                  ) : (
                    <span className="font-medium">{it.product_name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-ink-700">₹{it.price}</td>
                <td className="px-6 py-4 text-right text-ink-700">
                  {it.quantity}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-ink-900">
                  ₹{it.line_total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-6 py-4">
          <span className="text-sm font-semibold text-ink-900">Total</span>
          <span className="text-lg font-bold text-ink-900">₹{order.total}</span>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}