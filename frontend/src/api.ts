const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  stock: number;
  category_id: number;
  created_at: string;
  category: Category;
};

export type ProductList = {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
};

export type User = {
  id: number;
  email: string;
  role: string;
};

// ---- Catalog ----

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProducts(params: {
  search?: string;
  category?: string;
  page?: number;
}): Promise<ProductList> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category);
  if (params.page) qs.set("page", String(params.page));
  const res = await fetch(`${API_URL}/products?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

// ---- Auth ----

export async function register(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function fetchMe(): Promise<User> {
  const token = getToken();
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

// ---- Shared auth header helper ----

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// ---- Cart ----

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    stock: number;
  };
  line_total: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: string;
  total_items: number;
};

export async function fetchCart(): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(product_id: number, quantity = 1): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ product_id, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCartItem(item_id: number, quantity: number): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${item_id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function removeCartItem(item_id: number): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/items/${item_id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
}

// ---- Orders ----

export type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  price: string;
  quantity: number;
  line_total: string;
};

export type Order = {
  id: number;
  status: string;
  total: string;
  created_at: string;
  items: OrderItem[];
};

export type OrderSummary = {
  id: number;
  status: string;
  total: string;
  created_at: string;
};

export async function checkout(): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/checkout`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Checkout failed");
  }
  return res.json();
}

export async function fetchOrders(): Promise<OrderSummary[]> {
  const res = await fetch(`${API_URL}/orders`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function fetchOrder(id: number): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load order");
  return res.json();
}