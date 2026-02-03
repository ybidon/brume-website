/**
 * Hero Text Reveal Animation
 * Letter-by-letter staggered animation with wave effect
 */

export function initTextReveal() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  const text = headline.textContent.trim();

  // Clear and rebuild with spans
  headline.innerHTML = '';
  headline.classList.add('text-reveal');

  // Create span for each letter
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.setProperty('--letter-index', index);
    span.style.animationDelay = `${0.5 + index * 0.08}s`;
    headline.appendChild(span);
  });

  // Add wave animation after initial reveal
  setTimeout(() => {
    headline.classList.add('wave-active');
  }, 1500 + text.length * 80);
}

/**
 * Split any text element into animated letters
 */
export function splitTextToLetters(element, options = {}) {
  const {
    staggerDelay = 0.05,
    initialDelay = 0,
    className = 'split-letter'
  } = options;

  const text = element.textContent.trim();
  element.innerHTML = '';
  element.classList.add('split-text');

  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${initialDelay + index * staggerDelay}s`;
    element.appendChild(span);
  });
}
