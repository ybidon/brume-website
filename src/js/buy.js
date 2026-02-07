/**
 * BRUME - Buy Page JavaScript Entry Point
 * Product detail page with color variant switching and slideshow
 */

import { initHeader } from './animations/header.js';
import { initBuyPageSlideshow } from './effects/buySlideshow.js';
import { initColorSelector } from './effects/colorSelector.js';

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
});
