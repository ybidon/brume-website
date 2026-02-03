/**
 * Water Cursor Effect
 * Custom cursor with ripple trail and click effects
 */

export function initWaterCursor() {
  // Check if touch device
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) return;

  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = `
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  `;
  document.body.appendChild(cursor);

  // Create ripple container
  const rippleContainer = document.createElement('div');
  rippleContainer.className = 'ripple-container';
  document.body.appendChild(rippleContainer);

  // Cursor position with smooth follow
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let ringX = 0;
  let ringY = 0;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation
  function animateCursor() {
    // Dot follows instantly
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;

    // Ring follows with lag
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    dot.style.left = `${cursorX}px`;
    dot.style.top = `${cursorY}px`;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover detection for interactive elements
  const interactiveElements = 'a, button, [role="button"], input, textarea, select, label, .feature-item, .testimonial-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursor.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursor.classList.remove('is-hovering');
    }
  });

  // Click ripple effect
  document.addEventListener('mousedown', (e) => {
    cursor.classList.add('is-clicking');
    createRipple(e.clientX, e.clientY, 'click');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('is-clicking');
  });

  // Create ripple element
  function createRipple(x, y, type = 'click') {
    const ripple = document.createElement('div');
    ripple.className = `ripple ripple-${type}`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleContainer.appendChild(ripple);

    // Remove after animation
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // Optional: Movement ripples (throttled)
  let lastRippleTime = 0;
  const rippleThrottle = 100; // ms between ripples

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastRippleTime > rippleThrottle) {
      // Only create move ripples occasionally for subtle effect
      if (Math.random() > 0.7) {
        createRipple(e.clientX, e.clientY, 'move');
      }
      lastRippleTime = now;
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.remove('is-hidden');
  });

  // Hide on input focus
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('focus', () => cursor.classList.add('is-hidden'));
    el.addEventListener('blur', () => cursor.classList.remove('is-hidden'));
  });
}
