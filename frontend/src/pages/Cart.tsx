import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  getToken,
  checkout,
} from "../api";
import type { Cart as CartType, CartItem } from "../api";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

export default function Cart() {
  const navigate = useNavigate();
  const { refresh } = useCart();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [busyItem, setBusyItem] = useState<number | null>(null);

  useDocumentTitle("Your Cart");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    fetchCart()
      .then(setCart)
      .catch(() => toast.error("Failed to load cart"))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function changeQty(itemId: number, qty: number) {
    if (!cart) return;
    setBusyItem(itemId);
    const prev = cart;
    setCart({
      ...cart,
      items: cart.items.map((it) =>
        it.id === itemId ? { ...it, quantity: qty } : it
      ),
    });
    try {
      const updated = await updateCartItem(itemId, qty);
      setCart(updated);
      await refresh();
    } catch {
      setCart(prev);
      toast.error("Failed to update quantity");
    } finally {
      setBusyItem(null);
    }
  }

  async function remove(itemId: number) {
    if (!cart) return;
    setBusyItem(itemId);
    try {
      const updated = await removeCartItem(itemId);
      setCart(updated);
      await refresh();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setBusyItem(null);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const order = await checkout();
      await refresh();
      toast.success("Order placed!");
      navigate(`/orders/${order.id}`);
    } catch (e: any) {
      toast.error(e.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="h-8 w-40 animate-pulse rounded bg-ink-100" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-ink-100"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-ink-100" />
        </div>
      </div>
    );
  }

  if (!cart) return null;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Your cart is empty"
          description="Add some products and they'll show up here."
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
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
          Your Cart
        </h1>
        <span className="text-sm text-ink-500">
          {cart.total_items} {cart.total_items === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              busy={busyItem === item.id}
              onChangeQty={(q) => changeQty(item.id, q)}
              onRemove={() => remove(item.id)}
            />
          ))}

          <div className="pt-2">
            <Link
              to="/"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-ink-900">
              Order Summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="font-medium text-ink-900">₹{cart.subtotal}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-600">Delivery</dt>
                <dd className="font-medium text-brand-700">
                  {Number(cart.subtotal) >= 199 ? "Free" : "₹29"}
                </dd>
              </div>
              <div className="border-t border-ink-100 pt-3 flex items-center justify-between text-base">
                <dt className="font-semibold text-ink-900">Total</dt>
                <dd className="font-bold text-ink-900">
                  ₹
                  {Number(cart.subtotal) >= 199
                    ? cart.subtotal
                    : (Number(cart.subtotal) + 29).toString()}
                </dd>
              </div>
            </dl>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              {checkingOut ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Placing order...
                </>
              ) : (
                <>
                  Place Order <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-6 space-y-3 border-t border-ink-100 pt-5 text-xs text-ink-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-600" />
                Delivered in 10 minutes
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                Secure checkout
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CartRow({
  item,
  busy,
  onChangeQty,
  onRemove,
}: {
  item: CartItem;
  busy: boolean;
  onChangeQty: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`flex gap-4 rounded-2xl border border-ink-200 bg-white p-4 transition ${
        busy ? "opacity-60" : ""
      }`}
    >
      <Link
        to={`/products/${item.product_id}`}
        className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-ink-100"
      >
        {item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-brand-300" strokeWidth={1.5} />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${item.product_id}`}
              className="line-clamp-1 text-sm font-semibold text-ink-900 hover:text-brand-700"
            >
              {item.product.name}
            </Link>
            <p className="mt-0.5 text-xs text-ink-500">
              ₹{item.product.price} each
            </p>
          </div>
          <button
            onClick={onRemove}
            disabled={busy}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-lg border border-ink-200">
            <button
              onClick={() => onChangeQty(item.quantity - 1)}
              disabled={item.quantity <= 1 || busy}
              className="grid h-8 w-8 place-items-center text-ink-700 hover:bg-ink-100 disabled:opacity-40"
              aria-label="Decrease"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => onChangeQty(item.quantity + 1)}
              disabled={busy || item.quantity >= item.product.stock}
              className="grid h-8 w-8 place-items-center text-ink-700 hover:bg-ink-100 disabled:opacity-40"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-base font-bold text-ink-900">₹{item.line_total}</p>
        </div>
      </div>
    </div>
  );
}