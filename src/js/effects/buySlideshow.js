/**
 * Buy Page Slideshow
 * Extended slideshow with color variant filtering
 */

let currentColor = 'silver';
let slideshow, prevBtn, nextBtn;

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
}

export function switchColor(color) {
  currentColor = color;
  goToSlide(0);
}

export function initBuyPageSlideshow() {
  slideshow = document.querySelector('.product-slideshow');
  if (!slideshow) return;

  prevBtn = slideshow.querySelector('.slideshow-prev');
  nextBtn = slideshow.querySelector('.slideshow-next');

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
}
