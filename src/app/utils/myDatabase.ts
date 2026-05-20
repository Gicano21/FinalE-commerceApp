export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  cart: CartItemData[];
}

export interface CartItemData {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: number; // stock quantity available
  featured?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

let usersCache: UserData[] = [];
let productsCache: Product[] = [];

// This function pulls data from the server and updates our local variable
async function sync() {
  const localData = localStorage.getItem("myDatabase");
  usersCache = localData ? JSON.parse(localData) : [];
  if (!Array.isArray(usersCache)) usersCache = [];

  try {
    const response = await fetch(`${API_URL}/users`);
    if (response.ok) {
      const data = await response.json();
      usersCache = Array.isArray(data) ? data : [];
      localStorage.setItem("myDatabase", JSON.stringify(usersCache));
    }
  } catch (e) {
    console.error("Server connection failed");
    window.alert("Server connection failed, check your internet connection and try again.");
  }
}

export async function refreshUsers(): Promise<UserData[]> {
  await sync();
  return usersCache;
}

// Start syncing as soon as the file is loaded
sync();

// --- USER OPERATIONS ---
export function getAllUsers(): UserData[] {
  if (usersCache.length === 0) {
    const localData = localStorage.getItem("myDatabase");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        usersCache = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.users) ? parsed.users : []);
      } catch {
        usersCache = [];
      }
    }
  }

  return usersCache;
}

export function getUserById(userId: string): UserData | null {
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find((u) => u.id === userId) || null;
}

export function getUserByEmail(email: string): UserData | null {
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserByUsername(username: string): UserData | null {
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function createUser(username: string, email: string, password: string): Promise<UserData | null> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    return null;
  }

  const newUser = await res.json();
  if (newUser && newUser.id) {
    usersCache.push(newUser);
    return newUser;
  }

  return null;
}

export async function authenticateUser(email: string, password: string): Promise<UserData | null> {
  await sync();
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) || null;
}

export async function updateUser(userId: string, updates: Partial<UserData>) {
  await fetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  await sync();
  return true;
}

export async function deleteUser(userId: string) {
  await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
  usersCache = usersCache.filter((u) => u.id !== userId);
  return true;
}

// --- CART OPERATIONS ---

export async function getUserCart(userId: string): Promise<CartItemData[]> {
  await sync();
  const user = getUserById(userId);
  return user ? user.cart : [];
}

export async function addToUserCart(userId: string, item: CartItemData) {
  await fetch(`${API_URL}/users/${userId}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  await sync();
  return true;
}

export async function removeFromUserCart(userId: string, itemId: number) {
  await fetch(`${API_URL}/users/${userId}/cart/${itemId}`, { method: 'DELETE' });
  await sync();
  return true;
}

export async function updateCartItemQuantity(userId: string, itemId: number, quantity: number) {
  await fetch(`${API_URL}/users/${userId}/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  await sync();
  return true;
}

export async function clearUserCart(userId: string) {
  await fetch(`${API_URL}/users/${userId}/cart`, { method: 'DELETE' });
  await sync();
  return true;
}

export async function checkoutCart(userId: string, items: CartItemData[]) {
  const response = await fetch(`${API_URL}/users/${userId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Checkout failed' }));
    throw new Error(errorData.error || 'Checkout failed');
  }

  await sync();
  return await response.json();
}

// --- PRODUCT OPERATIONS ---

async function syncProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (response.ok) {
      const data = await response.json();
      productsCache = Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error("Server connection failed for products");
    return;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  await syncProducts();
  return productsCache;
}

export async function getProductById(productId: number): Promise<Product | null> {
  // First check cache
  let cached = productsCache.find(p => p.id === productId);
  if (cached) return cached;

  // Otherwise fetch from server
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (response.ok) {
      const product = await response.json();
      // Add to cache if not already there
      if (!productsCache.find(p => p.id === product.id)) {
        productsCache.push(product);
      }
      return product;
    }
  } catch (e) {
    console.error("Server connection failed for product");
  }
  
  return null;
}

export function getProductCategories(): string[] {
  const categories = new Set(productsCache.map(p => p.category));
  return ["All", ...Array.from(categories).sort()];
}

// --- DEBUG & SETUP ---

export async function clearDatabase() {
  await fetch(`${API_URL}/database/clear`, { method: 'POST' });
  usersCache = [];
}

export function getDatabase() {
  return { users: usersCache, version: "1.0.0" };
}