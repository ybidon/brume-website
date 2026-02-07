/**
 * Product Slideshow
 * Arrow and thumbnail navigation for purchase section
 */

export function initSlideshow() {
  const slideshow = document.querySelector('.product-slideshow');
  if (!slideshow) return;

  const images = slideshow.querySelectorAll('.slideshow-image');
  const thumbnails = slideshow.querySelectorAll('.slideshow-thumb');
  const prevBtn = slideshow.querySelector('.slideshow-prev');
  const nextBtn = slideshow.querySelector('.slideshow-next');

  if (images.length === 0) return;

  // Helper function to go to a specific slide
  function goToSlide(index) {
    // Wrap around
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    // Update images
    images.forEach((img) => img.classList.remove('active'));
    images[index].classList.add('active');

    // Update thumbnails
    thumbnails.forEach((thumb) => thumb.classList.remove('active'));
    if (thumbnails[index]) thumbnails[index].classList.add('active');
  }

  // Get current slide index
  function getCurrentIndex() {
    return Array.from(images).findIndex(img => img.classList.contains('active'));
  }

  // Handle thumbnail click
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index, 10);
      goToSlide(index);
    });
  });

  // Handle arrow clicks
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
    // Only handle if slideshow is in view
    const rect = slideshow.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      goToSlide(getCurrentIndex() - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(getCurrentIndex() + 1);
    }
  });
}
