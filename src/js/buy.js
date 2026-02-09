/**
 * BRUME - Buy Page JavaScript Entry Point
 * Product detail page with color variant switching and slideshow
 */

import { initHeader } from './animations/header.js';
import { initBuyPageSlideshow } from './effects/buySlideshow.js';
import { initColorSelector } from './effects/colorSelector.js';
import { addToCart } from './cart.js';
import { initCartDrawer, openDrawer } from './cartDrawer.js';
import { initCartIcon } from './cartIcon.js';
import { initFaq } from './effects/faq.js';

document.addEventListener('DOMContentLoaded', () => {
  // Force header into scrolled state (no hero on this page)
  const header = document.getElementById('header');
  if (header) {
    header.classList.add('is-scrolled');
  }

  // Initialize header scroll behavior (for hide/show on scroll)
  initHeader();

  // Initialize slideshow with color-aware filtering
  initBuyPageSlideshow();

  // Initialize color selector
  initColorSelector();

  // Initialize cart system
  initCartDrawer();
  initCartIcon();

  // Initialize FAQ accordion
  initFaq();

  // Wire up Add to Cart button
  const addToCartBtn = document.querySelector('.btn-add-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      // Get currently selected color
      const activeSwatch = document.querySelector('.color-swatch.active');
      const colorKey = activeSwatch ? activeSwatch.dataset.color : 'silver';

      // Add to cart and open drawer
      addToCart(colorKey);
      openDrawer();

      // Button feedback
      addToCartBtn.textContent = 'Added!';
      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
      }, 1500);
    });
  }
});
