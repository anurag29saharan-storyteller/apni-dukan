import { ShoppingBasket, Truck, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-8 sm:p-12">
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5" /> Delivered in 10 minutes
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
          Groceries at your door,<br />
          faster than you think.
        </h1>
        <p className="mt-4 max-w-lg text-sm text-white/90 sm:text-base">
          Fresh produce, snacks, dairy, and daily essentials. Order now and get them delivered in minutes.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            <Truck className="h-4 w-4" /> Free delivery over ₹199
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            <ShoppingBasket className="h-4 w-4" /> 1000+ products
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-white/5" />
    </section>
  );
}