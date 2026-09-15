import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">
              A
            </div>
            <span className="font-bold text-ink-900">Apni Dukan</span>
          </div>
          <p className="mt-3 text-sm text-ink-500">
            Fresh groceries delivered to your door in minutes.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/" className="hover:text-brand-600">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-brand-600">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-brand-600">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/login" className="hover:text-brand-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-600">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><span className="cursor-default">About</span></li>
            <li><span className="cursor-default">Contact</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-ink-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Apni Dukan. Built with FastAPI, React, PostgreSQL.
        </div>
      </div>
    </footer>
  );
}