import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";
import { fetchProducts, getToken } from "../api";
import type { Product } from "../api";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

const API_URL = "http://localhost:8000";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState<number | null>(null);

  useDocumentTitle("Admin · Products");

  async function load() {
    try {
      const data = await fetchProducts({ page: 1 });
      setProducts(data.items);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
    );
  }, [products, query]);

  async function saveStock(id: number) {
    const newStock = edits[id];
    if (newStock === undefined) return;
    setSaving(id);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: updated.stock } : p))
      );
      setEdits((e) => {
        const next = { ...e };
        delete next[id];
        return next;
      });
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Products</h1>
          <p className="text-sm text-ink-500">
            Manage catalog and stock levels
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-ink-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto h-8 w-8 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Product</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-right font-medium">Price</th>
                  <th className="px-6 py-3 text-left font-medium">Stock</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((p) => {
                  const edited = edits[p.id] !== undefined;
                  const low = p.stock < 10;
                  return (
                    <tr key={p.id} className="hover:bg-ink-50">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-ink-100">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-brand-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-ink-900">
                              {p.name}
                            </p>
                            <p className="text-xs text-ink-500">#{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-ink-600">
                        {p.category.name}
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium text-ink-900">
                        ₹{p.price}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            defaultValue={p.stock}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (v !== p.stock) {
                                setEdits((s) => ({ ...s, [p.id]: v }));
                              } else {
                                setEdits((s) => {
                                  const n = { ...s };
                                  delete n[p.id];
                                  return n;
                                });
                              }
                            }}
                            className="w-20 rounded-lg border border-ink-200 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          />
                          {low && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {edited && (
                            <button
                              onClick={() => saveStock(p.id)}
                              disabled={saving === p.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                            >
                              {saving === p.id ? (
                                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                              Save
                            </button>
                          )}
                          <button
                            onClick={() => remove(p.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}