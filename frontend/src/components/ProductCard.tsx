import { Link } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import { useState } from "react";
import { addToCart, getToken } from "../api";
import type { Product } from "../api";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { refresh } = useCart();
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      await refresh();
      toast.success(`Added ${product.name}`);
    } catch {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  }

  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
    >
      {/* Image / placeholder */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-50 to-ink-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-brand-300">
            <Package className="h-16 w-16" strokeWidth={1.5} />
          </div>
        )}

        {outOfStock && (
          <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
            Out of stock
          </div>
        )}

        {!outOfStock && product.stock < 10 && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-brand-600">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-1 text-xs text-ink-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-lg font-bold text-ink-900">₹{product.price}</p>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || outOfStock}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300"
            aria-label="Add to cart"
          >
            {adding ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}