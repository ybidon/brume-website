/* ============================================
   CART DRAWER — Slide-out panel UI
   ============================================ */

import {
  getCart,
  getCartCount,
  getCartTotal,
  updateQuantity,
  removeItem,
  onCartChange
} from './cart.js';

let overlay, drawer, body, footer, totalAmount;

// ── Inject HTML ─────────────────────────────

function createDrawerHTML() {
  // Overlay
  overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'cartOverlay';

  // Drawer
  drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.id = 'cartDrawer';
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <h2 class="cart-drawer-title">Your Cart</h2>
      <button class="cart-drawer-close" aria-label="Close cart">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="cart-drawer-body" id="cartDrawerBody"></div>
    <div class="cart-drawer-footer" id="cartDrawerFooter">
      <div class="cart-drawer-total">
        <span class="cart-drawer-total-label">Total</span>
        <span class="cart-drawer-total-amount" id="cartTotalAmount">Dhs. 0.00</span>
      </div>
      <button class="cart-drawer-checkout">Checkout</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  body = document.getElementById('cartDrawerBody');
  footer = document.getElementById('cartDrawerFooter');
  totalAmount = document.getElementById('cartTotalAmount');
}

// ── Open / Close ────────────────────────────

function openDrawer() {
  overlay.classList.add('is-open');
  drawer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  overlay.classList.remove('is-open');
  drawer.classList.remove('is-open');
  document.body.style.overflow = '';
}

// ── Render ──────────────────────────────────

function renderCartItems() {
  const cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty</p>
        <a href="/buy.html" class="cart-empty-cta">Shop Now</a>
      </div>
    `;
    footer.classList.add('is-hidden');
    return;
  }

  footer.classList.remove('is-hidden');

  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-color="${item.id}">
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-color">${item.color}</span>
        <span class="cart-item-price">${item.currency} ${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-qty">
          <button class="cart-qty-btn cart-qty-minus" data-color="${item.id}" aria-label="Decrease quantity">&minus;</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="cart-qty-btn cart-qty-plus" data-color="${item.id}" aria-label="Increase quantity">&plus;</button>
        </div>
        <button class="cart-item-remove" data-color="${item.id}" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  totalAmount.textContent = `Dhs. ${getCartTotal().toFixed(2)}`;
}

// ── Event Handlers ──────────────────────────

function handleBodyClick(e) {
  const minus = e.target.closest('.cart-qty-minus');
  const plus = e.target.closest('.cart-qty-plus');
  const remove = e.target.closest('.cart-item-remove');

  if (minus) {
    const color = minus.dataset.color;
    const item = getCart().find(i => i.id === color);
    if (item) updateQuantity(color, item.quantity - 1);
  }

  if (plus) {
    const color = plus.dataset.color;
    const item = getCart().find(i => i.id === color);
    if (item) updateQuantity(color, item.quantity + 1);
  }

  if (remove) {
    removeItem(remove.dataset.color);
  }
}

function handleCheckoutClick() {
  alert('Checkout coming soon!');
}

// ── Init ────────────────────────────────────

function initCartDrawer() {
  createDrawerHTML();

  // Close handlers
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('.cart-drawer-close').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Item interaction handlers
  body.addEventListener('click', handleBodyClick);

  // Checkout placeholder
  drawer.querySelector('.cart-drawer-checkout').addEventListener('click', handleCheckoutClick);

  // Auto-render on cart changes
  onCartChange(renderCartItems);

  // Initial render
  renderCartItems();
}

export { initCartDrawer, openDrawer, closeDrawer };
