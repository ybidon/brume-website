/**
 * Header Navigation Behavior
 * - Show/hide on scroll (Rhode-style)
 * - Only show sticky header when scrolling up AFTER passing hero
 * - Mobile menu toggle
 */

export function initHeader() {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  const hero = document.querySelector('.hero');

  if (!header) return;

  // Get hero height to know when we've passed it
  const getHeroBottom = () => {
    if (hero) {
      return hero.offsetTop + hero.offsetHeight;
    }
    return window.innerHeight; // Fallback to viewport height
  };

  // Scroll behavior - hide on scroll down, show on scroll up (only after hero)
  let lastScroll = 0;
  let heroBottom = getHeroBottom();

  // Update hero bottom on resize
  window.addEventListener('resize', () => {
    heroBottom = getHeroBottom();
  });

  const isMobile = () => window.innerWidth <= 768;

  function handleScroll() {
    const currentScroll = window.scrollY;

    // On mobile, header is always fixed and visible — never hide
    if (isMobile()) {
      header.classList.remove('is-hidden');
      if (currentScroll > 50) {
        header.classList.add('is-scrolled');
      } else if (hero) {
        header.classList.remove('is-scrolled');
      }
      lastScroll = currentScroll;
      return;
    }

    // If no hero exists, always stay in scrolled state
    if (!hero) {
      header.classList.add('is-scrolled');
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastScroll = currentScroll;
      return;
    }

    // While in hero section - keep header visible, no sticky behavior
    if (currentScroll < heroBottom - 100) {
      header.classList.remove('is-hidden');
      header.classList.remove('is-scrolled');
      lastScroll = currentScroll;
      return;
    }

    // Past hero section - enable sticky behavior
    header.classList.add('is-scrolled');

    // Scrolling down - hide header
    if (currentScroll > lastScroll) {
      header.classList.add('is-hidden');
    }
    // Scrolling up - show header (sticky)
    else if (currentScroll < lastScroll) {
      header.classList.remove('is-hidden');
    }

    lastScroll = currentScroll;
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  handleScroll();

  // Mobile menu toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
}
