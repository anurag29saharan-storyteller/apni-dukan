import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageX } from "lucide-react";
import { fetchCategories, fetchProducts } from "../api";
import type { Category, Product } from "../api";
import Hero from "../components/Hero";
import CategoryPills from "../components/CategoryPills";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyState from "../components/EmptyState";
import { toast } from "sonner";
import { useDocumentTitle } from "../useDocumentTitle";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useDocumentTitle("Home");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ search, category })
      .then((data) => setProducts(data.items))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, [search, category]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    setSearchParams(q ? { search: q } : {});
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Hero />

      {/* Search + Categories */}
      <div className="mt-8 space-y-4">
        <form onSubmit={submitSearch} className="md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>

        <CategoryPills
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {/* Results */}
      <div className="mt-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-ink-900">
            {category ? category : "All Products"}
          </h2>
          {!loading && (
            <span className="text-sm text-ink-500">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<PackageX className="h-6 w-6" />}
            title="No products found"
            description={
              search
                ? `We couldn't find anything for "${search}". Try a different search.`
                : "There are no products in this category yet."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}