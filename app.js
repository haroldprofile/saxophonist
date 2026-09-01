/**
 * HAROLD TRINIDAD PORTFOLIO & BOOKING APP
 * Features: Harold Trinidad PDF Compliance, Client Details Parsing,
 * Deposit Calculation, Web Audio API Synth Player, Lightbox,
 * Scroll Fade Observer, and Booking Form Handler.
 */

function getSiteConfig() {
  const saved = localStorage.getItem('HAROLD_SITE_CONFIG');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e){}
  }
  return window.SITE_CONFIG || {};
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  loadClientDetails();
  initAudioPlayer();
  initGalleryLightbox();
  initScrollObserver();
  initBookingForm();
  initDepositCalculator();
  initMobileMenu();
  initMoreVideosToggle();
  initReviewLightbox();
  initReviewSwipeCarousel();
  initMobileStickyBar();
});

/* ==========================================
   1. CLIENT DETAILS PARSER (config.js & details.html)
   ========================================== */
async function loadClientDetails() {
  const config = getSiteConfig();
  const artist = config.artist || {};

  // Apply Config Data to DOM
  if (artist.name) {
    document.title = `${artist.name} | Professional Saxophonist - Wedding Rates 2026`;
    document.querySelectorAll('.cfg-target-artist-name').forEach(el => el.textContent = artist.name);
  }
  if (artist.tagline) {
    document.querySelectorAll('.cfg-target-tagline').forEach(el => el.textContent = artist.tagline);
  }
  if (artist.email) {
    document.querySelectorAll('.cfg-target-email').forEach(el => {
      el.textContent = artist.email;
      if (el.tagName === 'A') el.href = `mailto:${artist.email}`;
    });
  }
  if (artist.phone) {
    document.querySelectorAll('.cfg-target-phone').forEach(el => {
      el.textContent = artist.phone;
      if (el.tagName === 'A') el.href = `tel:${artist.phone.replace(/[^+\d]/g, '')}`;
    });
  }
  if (artist.location) {
    document.querySelectorAll('.cfg-target-location').forEach(el => el.textContent = artist.location);
  }

  // Also attempt loading details.html fallback
  try {
    const response = await fetch('details.html');
    if (response.ok) {
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const servicePs = doc.querySelectorAll('#cfg-services p[data-type]');
      servicePs.forEach(p => {
        const type = p.getAttribute('data-type');
        const desc = p.textContent.trim();
        const targetP = document.querySelector(`.service-desc[data-service-type="${type}"]`);
        if (targetP && desc) targetP.textContent = desc;
      });
    }
  } catch (err) {}
}

/* ==========================================
   2. DEPOSIT CALCULATOR FOR PACKAGES A & B
   ========================================== */
function initDepositCalculator() {
  const pkgSelect = document.getElementById('package-select');
  const summaryBox = document.getElementById('deposit-summary-box');
  const pkgTitle = document.getElementById('summary-pkg-title');
  const totalCost = document.getElementById('summary-total-cost');
  const depositCost = document.getElementById('summary-deposit-cost');

  if (!pkgSelect || !summaryBox) return;

  const config = getSiteConfig();
  const rates = config.rates || {};
  const pkga = rates.packageA || { totalPrice: 8500, depositAmount: 2550 };
  const pkgb = rates.packageB || { totalPrice: 5500, depositAmount: 1650 };
  const depPct = rates.depositPercentage || 30;

  pkgSelect.addEventListener('change', () => {
    const val = pkgSelect.value;
    if (val === 'Package A') {
      summaryBox.style.display = 'block';
      pkgTitle.textContent = `Package A (Church & Reception - 2 Sets / 2 Hours)`;
      totalCost.textContent = `₱ ${pkga.totalPrice.toLocaleString()} (Base ₱${(pkga.basePrice || 8000).toLocaleString()} + Transport ₱${(pkga.transportFee || 500).toLocaleString()})`;
      depositCost.textContent = `₱ ${pkga.depositAmount.toLocaleString()} (${depPct}% Non-Refundable Downpayment)`;
    } else if (val === 'Package B') {
      summaryBox.style.display = 'block';
      pkgTitle.textContent = `Package B (Single Location - 1 Set / 1 Hour)`;
      totalCost.textContent = `₱ ${pkgb.totalPrice.toLocaleString()} (Base ₱${(pkgb.basePrice || 5000).toLocaleString()} + Transport ₱${(pkgb.transportFee || 500).toLocaleString()})`;
      depositCost.textContent = `₱ ${pkgb.depositAmount.toLocaleString()} (${depPct}% Non-Refundable Downpayment)`;
    } else if (val.includes('Outside Pampanga')) {
      summaryBox.style.display = 'block';
      pkgTitle.textContent = 'Outside Pampanga / Custom Quotation';
      totalCost.textContent = 'Custom Rate + Travel Fees';
      depositCost.textContent = `${depPct}% of Total Custom Quote`;
    } else {
      summaryBox.style.display = 'none';
    }
  });
}

/* ==========================================
   3. EMBEDDED YOUTUBE VIDEO PLAYER & REPERTOIRE
   ========================================== */
function initAudioPlayer() {
  const config = getSiteConfig();
  const videos = (config.videos && config.videos.length > 0) ? config.videos : [
    { title: "THROUGH THE YEARS - Saxophone Cover", videoId: "ShtHM_xGZwg" }
  ];

  let currentVideoIdx = 0;

  const iframe = document.getElementById('main-youtube-iframe');
  const titleEl = document.getElementById('active-video-title');
  const prevBtn = document.getElementById('prev-video-btn');
  const nextBtn = document.getElementById('next-video-btn');
  const playlistItems = document.querySelectorAll('.playlist-item[data-videoid]');
  const videoCards = document.querySelectorAll('.video-select-card');

  function loadVideo(index, autoPlay = true) {
    currentVideoIdx = (index + videos.length) % videos.length;
    const selected = videos[currentVideoIdx];

    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${selected.videoId}${autoPlay ? '?autoplay=1' : ''}`;
    }
    if (titleEl) {
      titleEl.textContent = selected.title;
    }

    // Update active playlist state
    playlistItems.forEach((item, idx) => {
      if (idx === currentVideoIdx) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active video card state
    videoCards.forEach((card, idx) => {
      if (idx === currentVideoIdx) {
        card.style.border = '2px solid var(--accent-gold)';
      } else {
        card.style.border = 'none';
      }
    });
  }

  // Prev / Next Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => loadVideo(currentVideoIdx - 1, true));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => loadVideo(currentVideoIdx + 1, true));
  }

  // Playlist Item Click Handler
  playlistItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      loadVideo(idx, true);
    });
  });

  // Gallery Cards Click Handler (plays embedded video directly on page and scrolls to player)
  videoCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      loadVideo(idx, true);
      const container = document.getElementById('featured-video-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* ==========================================
   4. GALLERY LIGHTBOX MODAL
   ========================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.gallery-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      if (modal && modalImg && modalCaption) {
        modalImg.src = imgSrc;
        modalCaption.textContent = caption;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================
   5. INTERSECTION OBSERVER (SCROLL FADE)
   ========================================== */
function initScrollObserver() {
  const fadeElements = document.querySelectorAll('.fade-in-element');
  fadeElements.forEach(el => el.classList.add('visible'));

  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

/* ==========================================
   6. BESPOKE BOOKING FORM HANDLER
   ========================================== */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-booking-btn');
  const spinner = document.getElementById('submit-spinner');
  const btnText = document.getElementById('submit-btn-text');
  const toast = document.getElementById('toast-notification');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // UI Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Processing Reservation...';

    // Simulate server submission delay
    setTimeout(() => {
      // Reset button state
      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (btnText) btnText.textContent = 'Submit Reservation Inquiry';

      // Show Toast Notification
      if (toast) {
        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 4500);
      }

      form.reset();
      const summaryBox = document.getElementById('deposit-summary-box');
      if (summaryBox) summaryBox.style.display = 'none';
    }, 1200);
  });
}

/* ==========================================
   7. ACCESSIBLE MOBILE MENU DRAWER
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const overlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    if (overlay) {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closeMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================
   8. SEE MORE VIDEOS TOGGLE (REPERTOIRE GRID)
   ========================================== */
function initMoreVideosToggle() {
  const toggleBtn = document.getElementById('toggle-more-videos-btn');
  const hiddenCards = document.querySelectorAll('.video-extra-card');
  const icon = document.getElementById('see-more-icon');
  let isExpanded = false;

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    hiddenCards.forEach(card => {
      card.style.display = isExpanded ? 'block' : 'none';
      if (isExpanded) {
        card.classList.add('visible');
      }
    });

    if (isExpanded) {
      toggleBtn.querySelector('span').textContent = 'Show Fewer Videos';
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      toggleBtn.querySelector('span').textContent = 'See More Videos (9 More)';
      if (icon) icon.style.transform = 'rotate(0deg)';
      document.getElementById('youtube-gallery-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ==========================================
   9. CLIENT REVIEWS LIGHTBOX MODAL
   ========================================== */
function initReviewLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  const reviewTriggers = document.querySelectorAll('.review-lightbox-trigger');

  reviewTriggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('href');
      if (modal && modalImg && modalCaption) {
        modalImg.src = imgSrc;
        modalCaption.textContent = `Harold Trinidad Client Recommendation #${idx + 1} (Facebook Feedback)`;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================
   10. MOBILE CLIENT REVIEWS SWIPE CAROUSEL
   ========================================== */
function initReviewSwipeCarousel() {
  const carousel = document.getElementById('reviews-carousel');
  const dotsContainer = document.getElementById('review-dots-container');
  if (!carousel || !dotsContainer) return;

  const slides = carousel.querySelectorAll('.review-card-slide');
  if (slides.length === 0) return;

  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to review slide ${idx + 1}`);
    dot.addEventListener('click', () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      carousel.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  let isScrolling = false;
  carousel.addEventListener('scroll', () => {
    if (isScrolling) return;
    isScrolling = true;
    requestAnimationFrame(() => {
      const scrollPos = carousel.scrollLeft;
      const slideWidth = slides[0].getBoundingClientRect().width || 1;
      const activeIdx = Math.round(scrollPos / slideWidth);

      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      isScrolling = false;
    });
  });
}

/* ==========================================
   11. PERSISTENT MOBILE STICKY BAR CONTROLLER
   ========================================== */
function initMobileStickyBar() {
  const stickyBar = document.getElementById('mobile-sticky-bar');
  const contactSection = document.getElementById('contact');
  if (!stickyBar || !contactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyBar.classList.add('hidden');
      } else {
        stickyBar.classList.remove('hidden');
      }
    });
  }, { threshold: 0.15 });

  observer.observe(contactSection);
}
