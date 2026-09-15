import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { getToken } from "../api";
import type { OrderSummary } from "../api";
import { StatusBadge } from "../components/ui/Badge";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

const API_URL = "http://localhost:8000";
const STATUSES = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [error, setError] = useState("");

  useDocumentTitle("Admin · Orders");

  async function load() {
    const token = getToken();
    const res = await fetch(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError("Failed to load orders");
      return;
    }
    setOrders(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id: number, status_value: string) {
    const token = getToken();
    const res = await fetch(
      `${API_URL}/admin/orders/${id}/status?status_value=${status_value}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      load();
      toast.success(`Order #${id} updated`);
    } else {
      toast.error("Update failed");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Orders</h1>
      <p className="text-sm text-ink-500">Track and manage all orders</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Order</th>
                  <th className="px-6 py-3 text-left font-medium">Placed</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-50">
                    <td className="px-6 py-3.5 font-semibold text-ink-900">
                      #{o.id}
                    </td>
                    <td className="px-6 py-3.5 text-ink-600">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium text-ink-900">
                      ₹{o.total}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}