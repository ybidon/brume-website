/* ============================================
   CART ICON — Header shopping bag + badge
   ============================================ */

import { getCartCount, onCartChange } from './cart.js';
import { openDrawer } from './cartDrawer.js';

let badge;

// ── Create Icon Element ─────────────────────

function createCartButton() {
  const btn = document.createElement('button');
  btn.className = 'header-cart';
  btn.id = 'headerCartBtn';
  btn.setAttribute('aria-label', 'Open cart');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
    <span class="header-cart-badge" id="cartBadge">0</span>
  `;
  return btn;
}

// ── Update Badge ────────────────────────────

function updateCartBadge() {
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;

  if (count > 0) {
    badge.classList.add('has-items');
    // Pop animation
    badge.classList.remove('cart-badge-pop');
    void badge.offsetWidth; // force reflow
    badge.classList.add('cart-badge-pop');
    setTimeout(() => badge.classList.remove('cart-badge-pop'), 300);
  } else {
    badge.classList.remove('has-items');
  }
}

// ── Init ────────────────────────────────────

function initCartIcon() {
  const header = document.querySelector('.header');
  if (!header) return;

  const cartBtn = createCartButton();
  const existingCta = header.querySelector('.header-cta');
  const menuToggle = header.querySelector('.mobile-menu-toggle');

  // Create .header-actions wrapper
  const actions = document.createElement('div');
  actions.className = 'header-actions';

  // Move existing CTA into wrapper (if it exists, like on index.html)
  if (existingCta) {
    existingCta.parentNode.insertBefore(actions, existingCta);
    actions.appendChild(existingCta);
  } else {
    // Buy page — insert before mobile toggle
    if (menuToggle) {
      header.insertBefore(actions, menuToggle);
    } else {
      header.appendChild(actions);
    }
  }

  // Append cart button into actions
  actions.appendChild(cartBtn);

  // Store badge reference
  badge = document.getElementById('cartBadge');

  // Click opens drawer
  cartBtn.addEventListener('click', openDrawer);

  // Keep badge in sync
  onCartChange(updateCartBadge);

  // Initial badge state
  updateCartBadge();
}

export { initCartIcon, updateCartBadge };
