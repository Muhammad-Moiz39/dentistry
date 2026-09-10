/**
 * Duozhuamiao — landing page interactions
 * - Mobile nav toggle
 * - Close menu on link click / outside click / Escape
 * - Active nav-link highlighting based on scroll position
 * - Appointment CTA click handler (placeholder for future booking flow)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAppointmentCTAs();
});

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openNav = () => {
    nav.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  // Close the menu after a nav link is tapped (mobile UX)
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Close on outside click
  document.addEventListener('click', (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = toggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  // Reset state if the viewport grows back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
}

function initAppointmentCTAs() {
  const ctaButtons = document.querySelectorAll('a[href="#appointment"]');

  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      // No #appointment section exists yet on this single-section page.
      // Prevent a dead jump and surface a clear next step instead.
      const target = document.getElementById('appointment');
      if (!target) {
        event.preventDefault();
        console.info('Booking flow not wired up yet — hook this button to your appointment form or modal.');
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track || !prevBtn || !nextBtn) return;
  // Calculate the scroll distance (card width + gap)
  function getScrollStep() {
    const card = track.querySelector('.doctor-card');
    if (!card) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 24;
    return card.offsetWidth + gap;
  }
  // Update navigation button active / disabled states
  function updateNavState() {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    
    // Disable prev button when at the start
    prevBtn.disabled = track.scrollLeft <= 5;
    // Disable next button when at the end
    nextBtn.disabled = track.scrollLeft >= maxScrollLeft - 5;
  }
  // Button clicks
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });
  // Track scroll event to update button states
  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateNavState);
  }, { passive: true });
  updateNavState();
  window.addEventListener('resize', updateNavState);
  // Mouse Drag-to-Scroll (Desktop Swipe)
  let isDown = false;
  let startX;
  let scrollStart;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
  });
  const stopDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
  };
  track.addEventListener('mouseleave', stopDrag);
  track.addEventListener('mouseup', stopDrag);
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollStart - walk;
  });
  // Keyboard navigation (Arrow keys)
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    }
  });
});