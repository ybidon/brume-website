/**
 * Color Selector
 * Manages color variant switching for the buy page
 */

import { switchColor } from './buySlideshow.js';

const colorLabels = {
  silver: 'Silver',
  white: 'Pearl White'
};

export function initColorSelector() {
  const swatches = document.querySelectorAll('.color-swatch');
  const label = document.querySelector('.color-selector-label');
  if (swatches.length === 0) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.dataset.color;

      // Update active state on swatches
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Update label text
      if (label) {
        label.textContent = colorLabels[color] || color;
      }

      // Switch slideshow images
      switchColor(color);
    });
  });
}
