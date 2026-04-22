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

const API_URL = "https://finale-commerceserver.onrender.com/api";

// Clear localStorage on startup - it will be populated by server data or user actions
localStorage.removeItem("myDatabase");
let usersCache: UserData[] = [];

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
    }
  } catch (e) {
    console.error("Server connection failed");
    localStorage.removeItem("myDatabase");
    window.alert("Server connection failed, check your internet connection and try again.");
    return;
  }

  localStorage.setItem("myDatabase", JSON.stringify(usersCache));
}


// Start syncing as soon as the file is loaded
sync();
// --- USER OPERATIONS ---
export function getAllUsers(): UserData[] {
sync();

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
sync();
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find(u => u.id === userId) || null;
}

export function getUserByEmail(email: string): UserData | null {
sync();
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserByUsername(username: string): UserData | null {
sync();
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
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

export function authenticateUser(email: string, password: string): UserData | null {
sync();
  if (!Array.isArray(usersCache)) usersCache = [];
  return usersCache.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) || null;
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
  usersCache = usersCache.filter(u => u.id !== userId);
  return true;
}

// --- CART OPERATIONS ---

export function getUserCart(userId: string): CartItemData[] {
  sync();
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

// RESTORING MISSING EXPORT
export async function removeFromUserCart(userId: string, itemId: number) {
  await fetch(`${API_URL}/users/${userId}/cart/${itemId}`, { method: 'DELETE' });
  await sync();
  return true;
}

// RESTORING MISSING EXPORT
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

// --- DEBUG & SETUP ---

export async function clearDatabase() {
  await fetch(`${API_URL}/database/clear`, { method: 'POST' });
  usersCache = [];
}

export function getDatabase() {
  return { users: usersCache, version: "1.0.0" };
}