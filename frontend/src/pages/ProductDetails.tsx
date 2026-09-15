import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Package,
  Check,
} from "lucide-react";
import { fetchProduct, addToCart, getToken } from "../api";
import type { Product } from "../api";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { refresh } = useCart();

  useDocumentTitle(product?.name || "Product");

  useEffect(() => {
    if (!id) return;
    fetchProduct(Number(id))
      .then((p) => {
        setProduct(p);
        setQty(1);
      })
      .catch(() => setError("Product not found"));
  }, [id]);

  async function handleAdd() {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      await refresh();
      toast.success(`Added ${qty} × ${product.name}`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-ink-500">{error}</p>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
          ← Back to store
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-ink-100" />
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-ink-100" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-ink-100" />
            <div className="h-10 w-24 animate-pulse rounded bg-ink-100" />
            <div className="h-20 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      </div>
    );

  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, Math.min(product.stock, 20));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-700">{product.category.name}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-ink-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-ink-200 bg-gradient-to-br from-brand-50 to-ink-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-brand-300">
              <Package className="h-32 w-32" strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {product.category.name}
          </span>

          <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-ink-900">₹{product.price}</p>

          {product.description && (
            <p className="mt-4 text-sm text-ink-600">{product.description}</p>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  <Check className="h-3 w-3" /> In stock
                </span>
                <span className="text-ink-500">{product.stock} available</span>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-lg border border-ink-200 bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="grid h-11 w-11 place-items-center text-ink-700 hover:bg-ink-100 disabled:opacity-40"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                className="grid h-11 w-11 place-items-center text-ink-700 hover:bg-ink-100 disabled:opacity-40"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={adding || outOfStock}
              className="inline-flex h-11 flex-1 min-w-[180px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              {adding ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              {adding ? "Adding..." : outOfStock ? "Out of stock" : "Add to Cart"}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6 text-xs text-ink-600">
            <div className="text-center">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
                ⚡
              </div>
              <p className="mt-1.5">10 min delivery</p>
            </div>
            <div className="text-center">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
                💵
              </div>
              <p className="mt-1.5">Cash on delivery</p>
            </div>
            <div className="text-center">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
                ↩️
              </div>
              <p className="mt-1.5">Easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}