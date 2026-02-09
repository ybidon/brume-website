/* ============================================
   FAQ ACCORDION — Expand / collapse logic
   ============================================ */

export function initFaq() {
  const accordion = document.querySelector('.faq-accordion');
  if (!accordion) return;

  accordion.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('is-open');

    // Close all other items (accordion behaviour — one open at a time)
    accordion.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      }
    });

    // Toggle the clicked item
    if (isOpen) {
      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0';
    } else {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
}
