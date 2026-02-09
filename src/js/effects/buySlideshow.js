/**
 * Buy Page Slideshow
 * Extended slideshow with color variant filtering + dot indicators
 */

let currentColor = 'silver';
let slideshow, prevBtn, nextBtn, dotsContainer;

function getVisibleImages() {
  if (!slideshow) return [];
  return Array.from(
    slideshow.querySelectorAll(`.slideshow-image[data-color="${currentColor}"]`)
  );
}

function getCurrentIndex() {
  const images = getVisibleImages();
  return images.findIndex(img => img.classList.contains('active'));
}

function createDots() {
  if (dotsContainer) dotsContainer.remove();

  const images = getVisibleImages();
  if (images.length <= 1) return;

  dotsContainer = document.createElement('div');
  dotsContainer.className = 'slideshow-dots';

  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  });

  slideshow.appendChild(dotsContainer);
}

function updateDots(index) {
  if (!dotsContainer) return;
  const dots = dotsContainer.querySelectorAll('.slideshow-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function goToSlide(index) {
  const images = getVisibleImages();
  if (images.length === 0) return;

  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;

  // Hide ALL images (both colors)
  slideshow.querySelectorAll('.slideshow-image').forEach(img => {
    img.classList.remove('active');
  });

  // Show the target image
  images[index].classList.add('active');

  // Sync dots
  updateDots(index);
}

export function switchColor(color) {
  currentColor = color;
  goToSlide(0);
  createDots();
}

export function initBuyPageSlideshow() {
  slideshow = document.querySelector('.product-slideshow');
  if (!slideshow) return;

  prevBtn = slideshow.querySelector('.slideshow-prev');
  nextBtn = slideshow.querySelector('.slideshow-next');

  // Create dot indicators
  createDots();

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(getCurrentIndex() - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(getCurrentIndex() + 1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!slideshow) return;
    const rect = slideshow.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') goToSlide(getCurrentIndex() - 1);
    else if (e.key === 'ArrowRight') goToSlide(getCurrentIndex() + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slideshow.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(getCurrentIndex() + 1); // Swipe left -> next
      } else {
        goToSlide(getCurrentIndex() - 1); // Swipe right -> prev
      }
    }
  }, { passive: true });
}
