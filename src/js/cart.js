/* ============================================
   CART — Data layer with localStorage persistence
   ============================================ */

const STORAGE_KEY = 'brume_cart';

const colorLabels = {
  silver: 'Silver',
  white: 'Pearl White'
};

const PRODUCT = {
  name: 'brume filter',
  price: 395.00,
  currency: 'Dhs.'
};

let listeners = [];

// ── Read ────────────────────────────────────

function getCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ── Write ───────────────────────────────────

function save(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Private browsing or quota exceeded — cart lives in memory only
  }
  listeners.forEach(cb => cb());
}

function addToCart(colorKey) {
  const cart = getCart();
  const existing = cart.find(item => item.id === colorKey);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: colorKey,
      name: PRODUCT.name,
      color: colorLabels[colorKey] || colorKey,
      price: PRODUCT.price,
      currency: PRODUCT.currency,
      quantity: 1
    });
  }

  save(cart);
}

function updateQuantity(colorKey, newQty) {
  let cart = getCart();

  if (newQty <= 0) {
    cart = cart.filter(item => item.id !== colorKey);
  } else {
    const item = cart.find(item => item.id === colorKey);
    if (item) item.quantity = newQty;
  }

  save(cart);
}

function removeItem(colorKey) {
  const cart = getCart().filter(item => item.id !== colorKey);
  save(cart);
}

function clearCart() {
  save([]);
}

// ── Events ──────────────────────────────────

function onCartChange(callback) {
  listeners.push(callback);
}

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    listeners.forEach(cb => cb());
  }
});

export {
  getCart,
  getCartCount,
  getCartTotal,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  onCartChange
};
