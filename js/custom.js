/**
 * Duozhuamiao Dental Clinic — Interactive Features
 * - Mobile navigation menu
 * - Smooth scrollspy for active navigation links
 * - Dentists Swiper Carousel
 * - Interactive Testimonials switcher
 * - Dynamic Leaflet Map with User's Geolocation & reverse-geocoded address
 * - Appointment booking modal & consultation form with validation and toast alerts
 * - Video modal for clinic tour
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollspy();
  initDentistSlider();
  initTestimonials();
  initUserLocationMap();
  initBookingModal();
  initConsultationForm();
  initVideoModal();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
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

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
}

/* ==========================================================================
   2. Scrollspy (Highlight active nav link on scroll)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('main > section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.pageYOffset + 150;
    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. Dentists Slider (Swiper)
   ========================================================================== */
function initDentistSlider() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.dentist-slider', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    speed: 500,
    navigation: {
      nextEl: '#dentist-next',
      prevEl: '#dentist-prev',
    },
    breakpoints: {
      520: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3.2,
        spaceBetween: 20,
      },
      1080: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  });
}

/* ==========================================================================
   4. Interactive Testimonials Switcher
   ========================================================================== */
function initTestimonials() {
  const avatarButtons = document.querySelectorAll('.avatar-btn');
  const quoteText = document.getElementById('testimonial-text');
  const quoteAuthor = document.getElementById('testimonial-author');
  const quoteAvatar = document.getElementById('testimonial-avatar');
  const quoteCard = document.getElementById('testimonial-card');

  if (!avatarButtons.length || !quoteText || !quoteAuthor || !quoteAvatar) return;

  const reviews = [
    {
      name: 'Courtney Henry',
      avatar: 'assets/center.png',
      quote: 'The latest equipment, high-precision digital technologies and the best achievements of modern world medicine have allowed us to create a completely new, unprecedented level of painlessness, safety and comfort for patients.',
    },
    {
      name: 'Emily Clark',
      avatar: 'assets/patient-2.png',
      quote: 'I had dental implants placed last month and the entire experience was so smooth and gentle. The doctor explained every step clearly and I had zero pain throughout the procedure!',
    },
    {
      name: 'Sofia Rodriguez',
      avatar: 'assets/patient-1.png',
      quote: 'Duozhuamiao changed my whole perspective on dental clinics. The clinic ambiance is relaxing, the team is genuinely warm, and my braces treatment gave me back my confident smile.',
    },
    {
      name: 'Mia Chen',
      avatar: 'assets/patient-3.png',
      quote: 'Professional and thorough teeth whitening and hygiene cleaning. The results exceeded my expectations and my teeth felt remarkably clean without any sensitivity afterwards.',
    },
    {
      name: 'Alisha Vance',
      avatar: 'assets/patient-4.png',
      quote: 'Brought my 6-year-old here for pediatric dental care. Dr. Jacob was so gentle and playful that my child actually enjoyed the visit and asked when we could return!',
    },
  ];

  avatarButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index') || '0', 10);
      const data = reviews[index];
      if (!data) return;

      avatarButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (quoteCard) {
        quoteCard.style.opacity = '0.4';
        quoteCard.style.transition = 'opacity 0.2s ease';
      }

      setTimeout(() => {
        quoteText.textContent = data.quote;
        quoteAuthor.textContent = data.name;
        quoteAvatar.src = data.avatar;
        quoteAvatar.alt = data.name;
        if (quoteCard) quoteCard.style.opacity = '1';
      }, 200);
    });
  });
}

/* ==========================================================================
   5. Leaflet Map with User's Geolocation
   ========================================================================== */
function initUserLocationMap() {
  const mapElement = document.getElementById('map');
  const locationText = document.getElementById('user-location-text');
  const locationSub = document.getElementById('user-location-sub');
  const recenterBtn = document.getElementById('btn-recenter-location');

  if (!mapElement || typeof L === 'undefined') return;

  // Default fallback location (e.g. London / Central)
  let currentLat = 51.5074;
  let currentLng = -0.1278;

  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([currentLat, currentLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Custom dental icon marker
  const createPinIcon = () => {
    return L.divIcon({
      className: 'custom-pin-container',
      html: `
        <div class="clinic-map-pin">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/>
          </svg>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  };

  let marker = L.marker([currentLat, currentLng], { icon: createPinIcon() }).addTo(map);
  marker.bindPopup('<strong>Duozhuamiao Dental Clinic</strong><br>Your nearest certified branch.').openPopup();

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!response.ok) throw new Error('Geocoding request failed');
      const data = await response.json();
      
      const addr = data.address || {};
      const street = addr.road || addr.suburb || addr.neighbourhood || '';
      const city = addr.city || addr.town || addr.village || addr.county || addr.state || 'Local Clinic';
      const country = addr.country || '';

      const readableLocation = [street, city].filter(Boolean).join(', ') || city || 'Nearest Branch';
      
      if (locationText) {
        locationText.textContent = `${readableLocation}${country ? ' (' + country + ')' : ''}`;
      }
      if (locationSub) {
        locationSub.textContent = 'Clinic branch within 1.2 km • Open today until 8:00 PM';
      }

      marker.setPopupContent(`
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #3167d9; font-size: 14px;">Duozhuamiao Dental Clinic</strong><br>
          <span style="font-size: 12px; color: #4b5563;">${readableLocation}</span><br>
          <span style="font-size: 11px; color: #10b981; font-weight: 700;">● Open Now (8:00 AM - 8:00 PM)</span>
        </div>
      `).openPopup();
    } catch (err) {
      console.warn('Reverse geocode lookup error:', err);
      if (locationText) {
        locationText.textContent = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
      }
    }
  };

  // Locate User via Browser HTML5 Geolocation
  const locateUser = () => {
    if (locationText) locationText.textContent = 'Locating your nearest clinic...';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLat = position.coords.latitude;
          currentLng = position.coords.longitude;

          map.flyTo([currentLat, currentLng], 15, { duration: 1.5 });
          marker.setLatLng([currentLat, currentLng]);
          reverseGeocode(currentLat, currentLng);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // Try IP-based fallback if available
          fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((ipData) => {
              if (ipData.latitude && ipData.longitude) {
                currentLat = ipData.latitude;
                currentLng = ipData.longitude;
                map.flyTo([currentLat, currentLng], 14);
                marker.setLatLng([currentLat, currentLng]);
                if (locationText) {
                  locationText.textContent = `${ipData.city || 'Your Area'}, ${ipData.country_name || ''}`;
                }
                if (locationSub) {
                  locationSub.textContent = 'Clinic branch in your area • Open today until 8:00 PM';
                }
              } else {
                fallbackLocationNotice();
              }
            })
            .catch(() => {
              fallbackLocationNotice();
            });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else {
      fallbackLocationNotice();
    }
  };

  const fallbackLocationNotice = () => {
    if (locationText) locationText.textContent = 'Central Clinic Branch';
    if (locationSub) locationSub.textContent = 'Click "Locate On Map" to enable GPS location';
  };

  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      locateUser();
      showToast('Searching for your nearest clinic branch...');
    });
  }

  // Trigger geolocation on initial load
  locateUser();
}

/* ==========================================================================
   6. Appointment Modal & CTAs
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('appointment-modal');
  const overlay = document.getElementById('appointment-modal-overlay');
  const closeBtn = document.getElementById('appointment-modal-close');
  const form = document.getElementById('booking-modal-form');
  const ctaButtons = document.querySelectorAll('a[href="#appointment"], .header__cta');

  if (!modal) return;

  const openModal = (serviceName) => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (serviceName) {
      const select = document.getElementById('modal-service');
      if (select) select.value = serviceName;
    }

    const dateInput = document.getElementById('modal-date');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
      dateInput.min = new Date().toISOString().split('T')[0];
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Wire up "Read more" links in service cards to open modal for that service
  document.querySelectorAll('.service-card').forEach((card) => {
    const link = card.querySelector('.service-card__link');
    const title = card.querySelector('.service-card__title')?.textContent?.trim();
    if (link && title) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(title);
      });
    }
  });

  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value?.trim();
      const phone = document.getElementById('modal-phone')?.value?.trim();

      if (!name || !phone) {
        showToast('Please fill in your name and phone number.', true);
        return;
      }

      closeModal();
      form.reset();
      showToast(`Thank you, ${name}! Your appointment request has been confirmed. Our clinic coordinator will call you shortly.`);
    });
  }
}

/* ==========================================================================
   7. Consultation Form ("Are you still not sure?")
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const successMsg = document.getElementById('contact-form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput?.value?.trim();
    const phone = phoneInput?.value?.trim();

    if (!name || !phone) {
      showToast('Please enter both your name and phone number.', true);
      return;
    }

    form.reset();
    if (successMsg) {
      successMsg.textContent = '✓ Request sent! Our specialist will call you in 15 minutes.';
      setTimeout(() => {
        successMsg.textContent = '';
      }, 6000);
    }
    showToast(`Thank you, ${name}! We will call you back within 15 minutes.`);
  });
}

/* ==========================================================================
   8. Video Modal
   ========================================================================== */
function initVideoModal() {
  const playBtn = document.getElementById('play-video');
  const modal = document.getElementById('video-modal');
  const overlay = document.getElementById('video-modal-overlay');
  const closeBtn = document.getElementById('video-modal-close');
  const iframe = document.getElementById('video-iframe');

  if (!playBtn || !modal) return;

  const videoUrl = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1';

  const openVideo = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (iframe) iframe.src = videoUrl;
  };

  const closeVideo = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (iframe) iframe.src = '';
  };

  playBtn.addEventListener('click', openVideo);
  if (overlay) overlay.addEventListener('click', closeVideo);
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeVideo();
    }
  });
}

/* ==========================================================================
   9. Toast Notification Helper
   ========================================================================== */
let toastTimeout;
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.style.backgroundColor = isError ? '#ef4444' : '#059669';
  toast.classList.add('is-visible');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4500);
}