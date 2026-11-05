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

// Listen for live updates from admin.html across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'HAROLD_SITE_CONFIG' || e.key === 'HAROLD_CACHE_VERSION') {
    window.location.reload();
  }
});
if ('BroadcastChannel' in window) {
  const bc = new BroadcastChannel('harold_site_sync');
  bc.onmessage = (e) => {
    if (e.data && (e.data.type === 'CONFIG_UPDATED' || e.data.type === 'CACHE_CLEARED')) {
      window.location.reload();
    }
  };
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
  const rates = config.rates || {};
  const cacheBust = localStorage.getItem('HAROLD_CACHE_VERSION');

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
    const cleanTel = artist.phone.replace(/[^+\d]/g, '');
    document.querySelectorAll('.cfg-target-phone').forEach(el => {
      el.textContent = artist.phone;
      if (el.tagName === 'A') el.href = `tel:${cleanTel}`;
    });
    document.querySelectorAll('.cfg-target-phone-link').forEach(el => {
      el.href = `tel:${cleanTel}`;
    });
    document.querySelectorAll('.cfg-target-call-label').forEach(el => {
      el.textContent = `Call ${artist.phone}`;
    });
  }
  if (artist.location) {
    document.querySelectorAll('.cfg-target-location').forEach(el => el.textContent = artist.location);
  }
  if (artist.profilePhoto) {
    const photoUrl = cacheBust ? `${artist.profilePhoto}?v=${cacheBust}` : artist.profilePhoto;
    document.querySelectorAll('img[src*="harold-soprano"], .artist-avatar, #header-logo img').forEach(img => {
      img.src = photoUrl;
    });
  }

  // Sync Package A & B Rates dynamically across Hero, Cards, Table & Select
  const pkga = rates.packageA;
  const pkgb = rates.packageB;
  const depPct = rates.depositPercentage || 30;
  if (pkga && pkgb) {
    const statNums = document.querySelectorAll('.card-stats-grid .stat-num');
    if (statNums[0]) statNums[0].textContent = `₱${pkga.totalPrice.toLocaleString()}`;
    if (statNums[1]) statNums[1].textContent = `₱${pkgb.totalPrice.toLocaleString()}`;
    if (statNums[2]) statNums[2].textContent = `${depPct}%`;

    const pkgACard = document.getElementById('package-a-card');
    if (pkgACard) {
      const priceEl = pkgACard.querySelector('div[style*="2.25rem"]');
      if (priceEl) priceEl.innerHTML = `₱ ${pkga.totalPrice.toLocaleString()} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">Total</span>`;
      const depItem = pkgACard.querySelectorAll('.service-feature-item')[3];
      if (depItem) depItem.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Reservation Deposit: ₱ ${pkga.depositAmount.toLocaleString()} (${depPct}%)`;
    }

    const pkgBCard = document.getElementById('package-b-card');
    if (pkgBCard) {
      const priceEl = pkgBCard.querySelector('div[style*="2.25rem"]');
      if (priceEl) priceEl.innerHTML = `₱ ${pkgb.totalPrice.toLocaleString()} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">Total</span>`;
      const depItem = pkgBCard.querySelectorAll('.service-feature-item')[3];
      if (depItem) depItem.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Reservation Deposit: ₱ ${pkgb.depositAmount.toLocaleString()} (${depPct}%)`;
    }
  }

  // Sync Dynamic Client Reviews if modified in Admin
  if (Array.isArray(config.reviews) && config.reviews.length > 0) {
    const reviewCarousel = document.getElementById('reviews-carousel');
    if (reviewCarousel) {
      reviewCarousel.innerHTML = config.reviews.map((r, idx) => `
        <div class="review-card review-card-slide fade-in-element visible" style="background: #262320; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); transition: transform 300ms ease;">
          <a href="${r.image}" class="review-lightbox-trigger" target="_blank" style="display: block; position: relative;">
            <img src="${cacheBust ? r.image + '?v=' + cacheBust : r.image}" alt="${r.title || 'Client Recommendation ' + (idx + 1)}" style="width: 100%; height: auto; display: block;" loading="lazy">
            <div class="gallery-card-overlay" style="background: rgba(0,0,0,0.65); display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--accent-gold); color: var(--primary-dark); display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                <svg class="svg-icon" viewBox="0 0 24 24" style="width: 20px; height: 20px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <div class="gallery-title">${r.title || 'Facebook Recommendation'}</div>
              <div class="gallery-category">${r.category || 'Click to Expand Review'}</div>
            </div>
          </a>
        </div>
      `).join('');
    }
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
   2. LIVE QUOTATION & MODAL SONG TABLE ENGINE
   ========================================== */
let currentQuoteRef = 'HT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

let requestedSongsState = [
  {
    moment: 'Dinner / Reception',
    title: 'Through The Years',
    artist: 'Kenny Rogers',
    ytLink: 'https://youtu.be/ShtHM_xGZwg',
    isCustom: false
  }
];

function showSiteToast(title, message) {
  const toast = document.getElementById('toast-notification');
  const tTitle = document.getElementById('toast-title');
  const tMsg = document.getElementById('toast-message');
  if (toast && tTitle && tMsg) {
    tTitle.textContent = title;
    tMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 4500);
  }
}

function getRequestedSongsList() {
  return requestedSongsState.map((s, idx) => ({
    ...s,
    index: idx + 1
  }));
}

function renderRequestedSongsTable() {
  const tbody = document.getElementById('song-table-body');
  const countBadge = document.getElementById('song-count-badge');
  if (!tbody) return;

  if (countBadge) {
    countBadge.textContent = requestedSongsState.length;
  }

  if (requestedSongsState.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 1.35rem; color: var(--text-muted); font-style: italic;">
          No songs in your list yet. Click <strong>"+ Add Song (Open Song Modal)"</strong> or tap a popular song above!
        </td>
      </tr>
    `;
    calculateLiveQuotation();
    return;
  }

  tbody.innerHTML = requestedSongsState.map((s, idx) => `
    <tr>
      <td style="font-weight: 700; color: var(--accent-gold-hover);">#${idx + 1}</td>
      <td><span style="background: #FAF6EE; border: 1px solid rgba(176,138,62,0.35); padding: 0.18rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">${s.moment}</span></td>
      <td style="font-weight: 700;">${s.title}</td>
      <td>${s.artist}</td>
      <td>${s.ytLink ? `<a href="${s.ytLink}" target="_blank" rel="noopener" style="color: var(--accent-gold-hover); font-weight: 600; text-decoration: underline;">▶ YouTube Link</a>` : '<span style="color: var(--text-muted); font-size: 0.78rem;">Standard</span>'}</td>
      <td>${s.isCustom ? '<span style="color: #B45309; font-weight: 700; font-size: 0.78rem;">+₱500 Custom</span>' : '<span style="color: #15803D; font-weight: 600; font-size: 0.78rem;">Repertoire (Free)</span>'}</td>
      <td style="text-align: center;">
        <button type="button" class="song-table-delete-btn" data-del-idx="${idx}" aria-label="Delete song">✕ Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.song-table-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.getAttribute('data-del-idx'), 10);
      const removed = requestedSongsState.splice(i, 1);
      renderRequestedSongsTable();
      if (removed[0]) {
        showSiteToast('Song Removed', `Removed "${removed[0].title}" from your setlist table.`);
      }
    });
  });

  calculateLiveQuotation();
}

function updateVenueBlocksUI() {
  const venueSetting = document.getElementById('venue-setting');
  const venue2Block = document.getElementById('venue-2-block');
  const venue1Heading = document.getElementById('venue-1-heading');
  const venue1Label = document.getElementById('venue-1-label');
  if (!venueSetting) return;

  const val = venueSetting.value;
  const isDualVenue = val.includes('2 Sets') || val.includes('+');

  if (venue2Block) {
    venue2Block.style.display = isDualVenue ? 'block' : 'none';
  }

  if (venue1Heading && venue1Label) {
    if (isDualVenue) {
      venue1Heading.textContent = '📍 Venue 1: Ceremony Location (Church / Garden / School)';
      venue1Label.textContent = 'Ceremony Venue Name & Full Address *';
    } else if (val.includes('Church')) {
      venue1Heading.textContent = '⛪ Church Ceremony Location';
      venue1Label.textContent = 'Church Name & Full Address *';
    } else if (val.includes('Reception')) {
      venue1Heading.textContent = '🥂 Reception / Banquet Hall Location';
      venue1Label.textContent = 'Reception Venue Name & Full Address *';
    } else if (val.includes('Garden')) {
      venue1Heading.textContent = '🌿 Garden / Outdoor Venue Location';
      venue1Label.textContent = 'Garden Venue Name & Full Address *';
    } else if (val.includes('Hotel')) {
      venue1Heading.textContent = '🏨 Hotel / Ballroom Location';
      venue1Label.textContent = 'Hotel Name & Full Address *';
    } else if (val.includes('School')) {
      venue1Heading.textContent = '🎓 School / University Campus Location';
      venue1Label.textContent = 'School / Campus Name & Full Address *';
    } else {
      venue1Heading.textContent = '📍 Event Venue Location';
      venue1Label.textContent = 'Venue Name & Full Address *';
    }
  }
}

function calculateLiveQuotation() {
  const config = getSiteConfig();
  const rates = config.rates || {};
  const pkga = rates.packageA || { basePrice: 8000, transportFee: 500, totalPrice: 8500, depositAmount: 2550 };
  const pkgb = rates.packageB || { basePrice: 5000, transportFee: 500, totalPrice: 5500, depositAmount: 1650 };
  const depPct = rates.depositPercentage || 30;
  const transFee = rates.transportFeePampanga || 500;

  const pkgSelect = document.getElementById('package-select');
  const venueSetting = document.getElementById('venue-setting');
  const locationArea = document.getElementById('location-area');

  const pkgVal = pkgSelect?.value || 'Package A';
  const settingVal = venueSetting?.value || 'Church & Reception (2 Sets)';
  const areaVal = locationArea?.value || 'Within Pampanga';

  const songs = getRequestedSongsList();
  const customSongsCount = songs.filter(s => s.isCustom).length;
  const customSongsFee = customSongsCount * 500;

  let basePrice = pkga.basePrice || 8000;
  let pkgLabel = `Package A — ${settingVal}`;
  let isCustomQuote = false;

  if (pkgVal === 'Package B') {
    basePrice = pkgb.basePrice || 5000;
    pkgLabel = `Package B — ${settingVal}`;
  } else if (pkgVal.includes('Custom')) {
    isCustomQuote = true;
    basePrice = pkga.basePrice || 8000;
    pkgLabel = `Custom Quotation — ${settingVal}`;
  }

  const isOutside = areaVal === 'Outside Pampanga' || isCustomQuote;
  const transportCost = isOutside ? 0 : transFee;
  const totalAmount = basePrice + transportCost + customSongsFee;
  const depositAmount = Math.round(totalAmount * (depPct / 100));

  // Update DOM
  const pkgTitleEl = document.getElementById('summary-pkg-title');
  const areaBadgeEl = document.getElementById('summary-area-badge');
  const areaLabelEl = document.getElementById('summary-area-label');
  const baseCostEl = document.getElementById('summary-base-cost');
  const transCostEl = document.getElementById('summary-transport-cost');
  const customRowEl = document.getElementById('summary-custom-songs-row');
  const customCountEl = document.getElementById('summary-custom-songs-count');
  const customCostEl = document.getElementById('summary-custom-songs-cost');
  const totalCostEl = document.getElementById('summary-total-cost');
  const depositCostEl = document.getElementById('summary-deposit-cost');

  if (pkgTitleEl) pkgTitleEl.textContent = pkgLabel;
  if (areaBadgeEl) areaBadgeEl.textContent = isOutside ? 'Custom / Price Varies' : 'Pampanga Rate';
  if (areaLabelEl) areaLabelEl.textContent = areaVal;
  if (baseCostEl) baseCostEl.textContent = isCustomQuote ? `₱${basePrice.toLocaleString()} (Starting Base — Varies)` : `₱${basePrice.toLocaleString()}`;
  if (transCostEl) transCostEl.textContent = isOutside ? 'Varies by Venue Distance' : `₱${transportCost.toLocaleString()}`;

  if (customRowEl) {
    customRowEl.style.display = customSongsCount > 0 ? 'flex' : 'none';
    if (customCountEl) customCountEl.textContent = customSongsCount;
    if (customCostEl) customCostEl.textContent = `₱${customSongsFee.toLocaleString()}`;
  }

  if (totalCostEl) {
    totalCostEl.textContent = isOutside
      ? `₱${totalAmount.toLocaleString()}+ (Price Varies by Location/Setup)`
      : `₱${totalAmount.toLocaleString()}`;
  }
  if (depositCostEl) {
    depositCostEl.textContent = isOutside
      ? `₱${depositAmount.toLocaleString()}+ (${depPct}% of Final Agreed Quote)`
      : `₱${depositAmount.toLocaleString()} (${depPct}% Downpayment)`;
  }

  return {
    refId: currentQuoteRef,
    pkgVal,
    pkgLabel,
    settingVal,
    areaVal,
    isOutside,
    isCustomQuote,
    basePrice,
    transportCost,
    customSongsCount,
    customSongsFee,
    totalAmount,
    depositAmount,
    depPct,
    songs
  };
}

function initDepositCalculator() {
  const refBadge = document.getElementById('quote-ref-display');
  if (refBadge) refBadge.textContent = `REF: ${currentQuoteRef}`;

  const pkgSelect = document.getElementById('package-select');
  const venueSetting = document.getElementById('venue-setting');
  const locationArea = document.getElementById('location-area');

  if (pkgSelect && venueSetting) {
    pkgSelect.addEventListener('change', () => {
      if (pkgSelect.value === 'Package A' && !venueSetting.value.includes('2 Sets')) {
        venueSetting.value = 'Church & Reception (2 Sets)';
      } else if (pkgSelect.value === 'Package B' && venueSetting.value.includes('2 Sets')) {
        venueSetting.value = 'Church Ceremony Only (1 Set)';
      }
      updateVenueBlocksUI();
      calculateLiveQuotation();
    });
  }

  if (venueSetting && pkgSelect) {
    venueSetting.addEventListener('change', () => {
      if (venueSetting.value.includes('2 Sets') && pkgSelect.value === 'Package B') {
        pkgSelect.value = 'Package A';
      } else if (venueSetting.value.includes('1 Set') && pkgSelect.value === 'Package A') {
        pkgSelect.value = 'Package B';
      }
      updateVenueBlocksUI();
      calculateLiveQuotation();
    });
  }

  if (locationArea) {
    locationArea.addEventListener('change', calculateLiveQuotation);
  }

  updateVenueBlocksUI();
  calculateLiveQuotation();
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
  const playlistContainer = document.getElementById('playlist-container');
  const galleryGrid = document.getElementById('youtube-gallery-grid');

  // Dynamically render Playlist & Gallery Grid from config.videos
  if (playlistContainer && videos.length > 0) {
    playlistContainer.innerHTML = videos.map((v, idx) => `
      <li class="playlist-item ${idx === 0 ? 'active' : ''}" data-index="${idx}" data-videoid="${v.videoId}" data-title="${v.title}">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <svg class="svg-icon" viewBox="0 0 24 24" style="color: var(--accent-gold);"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span class="playlist-item-title">${idx + 1}. ${v.title}</span>
        </div>
        <span class="playlist-item-duration">${idx === 0 ? 'Featured • Play Video' : 'Play Video'}</span>
      </li>
    `).join('');
  }

  if (galleryGrid && videos.length > 0) {
    galleryGrid.innerHTML = videos.map((v, idx) => `
      <div class="gallery-card video-select-card fade-in-element visible ${idx >= 6 ? 'video-extra-card' : ''}" data-index="${idx}" data-videoid="${v.videoId}" data-title="${v.title}" style="${idx >= 6 ? 'display: none;' : ''}">
        <img src="https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg" alt="${v.title}" loading="lazy">
        <div class="video-play-btn-overlay">
          <svg class="svg-icon" viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: currentColor;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <div class="gallery-card-overlay">
          <div class="gallery-title">${v.title.split('|')[0].split('-')[0].trim()}</div>
          <div class="gallery-category">${idx === 0 ? 'Featured Saxophone Cover' : 'Saxophone Cover'}</div>
        </div>
      </div>
    `).join('');
  }

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

  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.08
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
   6. BESPOKE BOOKING FORM, MODAL SONG TABLE, GOOGLE MAPS & PDF/IMAGE EXPORT
   ========================================== */
function collectFullFormData() {
  const quote = calculateLiveQuotation();
  const clientName = document.getElementById('client-name')?.value.trim() || 'Valued Client';
  const clientPhone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
  const clientEmail = document.getElementById('client-email')?.value.trim() || 'Not specified';
  const eventType = document.getElementById('event-type')?.value || 'Wedding Ceremony & Reception';
  const eventDate = document.getElementById('event-date')?.value || 'TBD';
  const eventTime = document.getElementById('event-time')?.value.trim() || 'Flexible / TBD';
  const eventVenue1 = document.getElementById('event-venue')?.value.trim() || 'TBD Venue';
  const venue1Map = document.getElementById('venue-1-map')?.value.trim() || '';
  const eventVenue2 = document.getElementById('event-venue-2')?.value.trim() || '';
  const venue2Map = document.getElementById('venue-2-map')?.value.trim() || '';
  const eventNotes = document.getElementById('event-notes')?.value.trim() || 'Standard performance setup.';

  const isDualVenue = quote.settingVal.includes('2 Sets') || quote.settingVal.includes('+');
  const combinedVenue = (isDualVenue && eventVenue2)
    ? `Venue 1: ${eventVenue1} | Venue 2: ${eventVenue2}`
    : eventVenue1;

  return {
    ...quote,
    clientName,
    clientPhone,
    clientEmail,
    eventType,
    eventDate,
    eventTime,
    eventVenue: combinedVenue,
    eventVenue1,
    venue1Map,
    eventVenue2: isDualVenue ? eventVenue2 : '',
    venue2Map: isDualVenue ? venue2Map : '',
    eventNotes,
    generatedAt: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  };
}

function buildTextSummary(data) {
  const songLines = data.songs.length > 0
    ? data.songs.map((s, i) => `  ${i + 1}. [${s.moment}] "${s.title}" by ${s.artist}${s.ytLink ? ' (' + s.ytLink + ')' : ''}${s.isCustom ? ' [+₱500 Custom]' : ''}`).join('\n')
    : '  - Song lineup to be finalized (1 month prior)';

  return [
    `🎷 HAROLD TRINIDAD — EVENT QUOTATION & SETLIST (${data.refId})`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 Client: ${data.clientName}`,
    `📱 Contact: ${data.clientPhone} | ${data.clientEmail}`,
    `🎉 Event Type: ${data.eventType}`,
    `📅 Event Date & Time: ${data.eventDate} (${data.eventTime})`,
    `📍 Set Coverage: ${data.settingVal} (${data.pkgVal || 'Package A'})`,
    `🏛️ Venue 1: ${data.eventVenue1}${data.venue1Map ? ' | Map: ' + data.venue1Map : ''}`,
    data.eventVenue2 ? `🥂 Venue 2 (Reception): ${data.eventVenue2}${data.venue2Map ? ' | Map: ' + data.venue2Map : ''}` : null,
    `🗺️ Area: ${data.areaVal}`,
    ``,
    `🎵 REQUESTED SONG SETLIST (${data.songs.length}):`,
    songLines,
    ``,
    `📋 SPECIAL CONDITIONS & NOTES:`,
    `  ${data.eventNotes}`,
    ``,
    `💰 QUOTATION SUMMARY:`,
    `  • Base Package: ₱${data.basePrice.toLocaleString()}`,
    `  • Transport (${data.areaVal}): ${data.isOutside ? 'Varies by venue distance' : '₱' + data.transportCost.toLocaleString()}`,
    data.customSongsCount > 0 ? `  • Custom Song Arrangements (${data.customSongsCount}x): ₱${data.customSongsFee.toLocaleString()}` : null,
    `  • ESTIMATED TOTAL: ₱${data.totalAmount.toLocaleString()}${data.isOutside ? '+ (Final price varies by location/setup)' : ''}`,
    `  • 30% RESERVATION DEPOSIT: ₱${data.depositAmount.toLocaleString()}`,
    `  * Note: Custom quotations and events outside Pampanga may vary in price depending on travel distance, venue logistics, and total sets.*`
  ].filter(Boolean).join('\n');
}

function exportQuotationAsImage() {
  const data = collectFullFormData();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const W = 1200;
  const songCount = Math.max(1, data.songs.length);
  const H = 940 + (songCount * 58);
  canvas.width = W;
  canvas.height = H;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#141210');
  bgGrad.addColorStop(1, '#1F1B17');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#D9B45A';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = 'rgba(217, 180, 90, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('OFFICIAL EVENT QUOTATION & PERFORMANCE SETLIST', 64, 82);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('HAROLD TRINIDAD — LIVE SAXOPHONIST', 64, 126);

  ctx.fillStyle = '#A8A29E';
  ctx.font = '16px sans-serif';
  ctx.fillText('Call/Viber: 0928 798 9977 | FB: facebook.com/harold.calotrinidad | Email: haroldcalo.trinidad@gmail.com', 64, 156);

  ctx.fillStyle = 'rgba(217, 180, 90, 0.16)';
  ctx.fillRect(W - 310, 62, 246, 68);
  ctx.strokeStyle = '#D9B45A';
  ctx.strokeRect(W - 310, 62, 246, 68);
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(data.refId, W - 290, 92);
  ctx.fillStyle = '#E7E5E4';
  ctx.font = '14px sans-serif';
  ctx.fillText('Issued: ' + data.generatedAt, W - 290, 116);

  ctx.strokeStyle = 'rgba(217, 180, 90, 0.35)';
  ctx.beginPath();
  ctx.moveTo(64, 180);
  ctx.lineTo(W - 64, 180);
  ctx.stroke();

  const drawField = (label, value, x, y, maxW = 500) => {
    ctx.fillStyle = '#D9B45A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    const clipped = value.length > 52 ? value.slice(0, 49) + '...' : value;
    ctx.fillText(clipped, x, y + 24, maxW);
  };

  drawField('Client Name', data.clientName, 64, 214);
  drawField('Contact / Email', `${data.clientPhone}  |  ${data.clientEmail}`, 600, 214);
  drawField('Event Type / Occasion', data.eventType, 64, 278);
  drawField('Event Date & Time', `${data.eventDate}  (${data.eventTime})`, 600, 278);
  drawField('Selected Set & Coverage', `${data.settingVal}  [${data.pkgVal || 'Package A'}]`, 64, 342);
  drawField('Venue Location(s)', `${data.eventVenue} (${data.areaVal})`, 600, 342);

  let curY = 410;
  ctx.fillStyle = 'rgba(217, 180, 90, 0.14)';
  ctx.fillRect(64, curY, W - 128, 38);
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`REQUESTED PERFORMANCE SETLIST TABLE (${data.songs.length} SONG${data.songs.length === 1 ? '' : 'S'})`, 80, curY + 25);
  curY += 58;

  if (data.songs.length === 0) {
    ctx.fillStyle = '#D6D3D1';
    ctx.font = 'italic 17px sans-serif';
    ctx.fillText('No custom songs listed yet — standard romantic & pop saxophone repertoire applies.', 80, curY + 12);
    curY += 50;
  } else {
    data.songs.forEach((s, i) => {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)';
      ctx.fillRect(64, curY - 18, W - 128, 50);

      ctx.fillStyle = '#D9B45A';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`#${i + 1} [${s.moment}]`, 80, curY + 12);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText(`"${s.title}" — ${s.artist}`, 290, curY + 12);

      ctx.fillStyle = '#A8A29E';
      ctx.font = '14px sans-serif';
      const ytShort = s.ytLink ? (s.ytLink.length > 36 ? s.ytLink.slice(0, 34) + '...' : s.ytLink) : 'Standard Repertoire';
      ctx.fillText(ytShort, 760, curY + 12);

      if (s.isCustom) {
        ctx.fillStyle = '#E8C972';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('+₱500 Custom', W - 190, curY + 12);
      }
      curY += 56;
    });
  }

  curY += 12;
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('SPECIAL CONDITIONS & EVENT INSTRUCTIONS:', 64, curY);
  ctx.fillStyle = '#E7E5E4';
  ctx.font = '16px sans-serif';
  const notesClipped = data.eventNotes.length > 115 ? data.eventNotes.slice(0, 112) + '...' : data.eventNotes;
  ctx.fillText(notesClipped, 64, curY + 25);

  curY += 54;
  ctx.fillStyle = '#1C1814';
  ctx.fillRect(64, curY, W - 128, 225);
  ctx.strokeStyle = '#D9B45A';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, curY, W - 128, 225);

  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('ITEMIZED QUOTATION BREAKDOWN', 92, curY + 34);

  ctx.fillStyle = '#D6D3D1';
  ctx.font = '17px sans-serif';
  ctx.fillText(`Base Package (${data.pkgLabel}):`, 92, curY + 66);
  ctx.fillText(`₱${data.basePrice.toLocaleString()}`, W - 260, curY + 66);

  ctx.fillText(`Transport & Logistics (${data.areaVal}):`, 92, curY + 96);
  ctx.fillText(data.isOutside ? 'Varies by Distance' : `₱${data.transportCost.toLocaleString()}`, W - 260, curY + 96);

  ctx.fillText(`Custom Song Arrangements (${data.customSongsCount} song${data.customSongsCount === 1 ? '' : 's'}):`, 92, curY + 126);
  ctx.fillText(`₱${data.customSongsFee.toLocaleString()}`, W - 260, curY + 126);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('ESTIMATED TOTAL QUOTATION:', 92, curY + 164);
  ctx.fillStyle = '#D9B45A';
  ctx.fillText(`₱${data.totalAmount.toLocaleString()}${data.isOutside ? '+ (Price Varies)' : ''}   |   30% DEPOSIT: ₱${data.depositAmount.toLocaleString()}`, 440, curY + 164);

  ctx.fillStyle = '#A8A29E';
  ctx.font = 'italic 13px sans-serif';
  ctx.fillText('* Note: Final quotation price may vary for events outside Pampanga, multi-venue setups, extra sets, or special technical requirements.', 92, curY + 200);

  const safeName = data.clientName.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
  const link = document.createElement('a');
  link.download = `Harold-Trinidad-Quotation-${safeName || data.refId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  showSiteToast('Quotation Image Downloaded!', 'Saved high-resolution PNG quotation & setlist to your device.');
}

function exportQuotationAsPDF() {
  const data = collectFullFormData();
  const songsRowsHtml = data.songs.length > 0
    ? data.songs.map((s, i) => `
        <tr>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd; font-weight:700;">#${i + 1}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd;">${s.moment}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd; font-weight:700;">${s.title}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd;">${s.artist}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd; font-size:12px;">${s.ytLink ? `<a href="${s.ytLink}">${s.ytLink}</a>` : 'Standard'}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #ddd;">${s.isCustom ? '+₱500 Custom' : 'Included'}</td>
        </tr>`).join('')
    : `<tr><td colspan="6" style="padding:12px; text-align:center; color:#666;">Song lineup to be finalized 1 month prior to the event.</td></tr>`;

  const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Harold Trinidad Quotation - ${data.refId}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #181512; margin: 0; padding: 28px; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; border: 2px solid #B08A3E; padding: 28px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #B08A3E; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; margin: 4px 0; color: #181512; }
    .badge { background: #181512; color: #D9B45A; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 13px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
    .box { background: #FAF8F5; border: 1px solid #E5E0D8; padding: 10px 14px; border-radius: 6px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #8C6D2F; font-weight: 700; }
    .val { font-size: 14px; font-weight: 600; margin-top: 3px; word-break: break-word; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 13px; }
    th { background: #181512; color: #D9B45A; text-align: left; padding: 9px 10px; font-size: 12px; text-transform: uppercase; }
    .summary { background: #181512; color: #fff; padding: 18px 22px; border-radius: 8px; margin-top: 14px; }
    .sum-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
    .sum-total { border-top: 1px dashed #D9B45A; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 700; color: #D9B45A; }
    .vary-note { margin-top: 10px; padding: 8px 12px; background: rgba(217,180,90,0.15); border-left: 3px solid #D9B45A; font-size: 12px; color: #E7E5E4; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width:820px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; background:#FAF6EE; padding:12px 16px; border:1px solid #D9B45A; border-radius:6px;">
    <strong>Save Official Quotation as PDF: Select "Save as PDF" in your print destination.</strong>
    <button onclick="window.print()" style="background:#181512; color:#D9B45A; border:none; padding:8px 16px; border-radius:4px; font-weight:700; cursor:pointer;">Print / Save Quotation PDF</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div>
        <div style="font-size:12px; font-weight:700; color:#8C6D2F; letter-spacing:0.08em;">OFFICIAL EVENT QUOTATION &amp; PERFORMANCE DETAILS</div>
        <div class="title">Harold Trinidad — Live Saxophonist</div>
        <div style="font-size:13px; color:#57534E;">Call / Viber: 0928 798 9977 | haroldcalo.trinidad@gmail.com | fb.com/harold.calotrinidad</div>
      </div>
      <div style="text-align:right;">
        <div class="badge">${data.refId}</div>
        <div style="font-size:12px; color:#57534E; margin-top:6px;">Date: ${data.generatedAt}</div>
      </div>
    </div>

    <div class="grid">
      <div class="box"><div class="label">Client Name</div><div class="val">${data.clientName}</div></div>
      <div class="box"><div class="label">Contact &amp; Email</div><div class="val">${data.clientPhone} | ${data.clientEmail}</div></div>
      <div class="box"><div class="label">Event Type / Occasion</div><div class="val">${data.eventType}</div></div>
      <div class="box"><div class="label">Event Date &amp; Time</div><div class="val">${data.eventDate} (${data.eventTime})</div></div>
      <div class="box"><div class="label">Selected Set &amp; Coverage</div><div class="val">${data.settingVal} (${data.pkgVal || 'Package A'})</div></div>
      <div class="box"><div class="label">Coverage Area</div><div class="val">${data.areaVal}</div></div>
      <div class="box" style="grid-column: span 2;">
        <div class="label">Venue 1 (Primary / Ceremony Location)</div>
        <div class="val">${data.eventVenue1} ${data.venue1Map ? `— <a href="${data.venue1Map}">Google Map Link</a>` : ''}</div>
      </div>
      ${data.eventVenue2 ? `
      <div class="box" style="grid-column: span 2;">
        <div class="label">Venue 2 (Reception / Second Location)</div>
        <div class="val">${data.eventVenue2} ${data.venue2Map ? `— <a href="${data.venue2Map}">Google Map Link</a>` : ''}</div>
      </div>` : ''}
    </div>

    <h4 style="margin: 16px 0 8px; text-transform: uppercase; font-size: 13px; color: #8C6D2F;">Requested Song Setlist (${data.songs.length})</h4>
    <table>
      <thead>
        <tr><th>#</th><th>Set / Moment</th><th>Song Title</th><th>Artist</th><th>YouTube Reference</th><th>Arrangement</th></tr>
      </thead>
      <tbody>${songsRowsHtml}</tbody>
    </table>

    <div class="box" style="margin-bottom:14px;">
      <div class="label">Special Conditions &amp; Event Instructions</div>
      <div class="val" style="font-weight:400; font-size:14px;">${data.eventNotes}</div>
    </div>

    <div class="summary">
      <div class="sum-row"><span>Base Performance Package (${data.pkgLabel}):</span><strong>₱${data.basePrice.toLocaleString()}</strong></div>
      <div class="sum-row"><span>Transport &amp; Logistics (${data.areaVal}):</span><strong>${data.isOutside ? 'Varies by Venue Distance' : '₱' + data.transportCost.toLocaleString()}</strong></div>
      <div class="sum-row"><span>Custom Song Arrangements (${data.customSongsCount} × ₱500):</span><strong>₱${data.customSongsFee.toLocaleString()}</strong></div>
      <div class="sum-row sum-total"><span>ESTIMATED TOTAL QUOTATION:</span><span>₱${data.totalAmount.toLocaleString()}${data.isOutside ? '+ (Price Varies)' : ''}</span></div>
      <div class="sum-row" style="color:#FFF8DC; font-weight:700; margin-top:6px;"><span>30% Required Deposit to Reserve Date:</span><span>₱${data.depositAmount.toLocaleString()}</span></div>
      <div class="vary-note"><strong>Important Quotation Note:</strong> For Custom Quotations, events outside Pampanga, or multi-venue setups (Church, Reception, Hotel, School, Garden), final pricing will vary depending on exact travel distance, total sets/hours, sound system requirements, and custom song arrangements.</div>
    </div>
  </div>
  <script>setTimeout(() => { window.print(); }, 350);</script>
</body>
</html>`;

  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
    showSiteToast('Quotation PDF Ready!', 'Select "Save as PDF" in the print window.');
  } else {
    exportQuotationAsImage();
  }
}

function exportSongListAsPDF() {
  const data = collectFullFormData();
  const songsRowsHtml = data.songs.length > 0
    ? data.songs.map((s, i) => `
        <tr>
          <td style="padding:10px; border-bottom:1px solid #ddd; font-weight:700;">#${i + 1}</td>
          <td style="padding:10px; border-bottom:1px solid #ddd; font-weight:600; color:#8C6D2F;">${s.moment}</td>
          <td style="padding:10px; border-bottom:1px solid #ddd; font-weight:700; font-size:15px;">${s.title}</td>
          <td style="padding:10px; border-bottom:1px solid #ddd;">${s.artist}</td>
          <td style="padding:10px; border-bottom:1px solid #ddd; font-size:12px;">${s.ytLink ? `<a href="${s.ytLink}">${s.ytLink}</a>` : 'Standard Repertoire'}</td>
          <td style="padding:10px; border-bottom:1px solid #ddd;">${s.isCustom ? '+₱500 Custom' : 'Standard'}</td>
        </tr>`).join('')
    : `<tr><td colspan="6" style="padding:18px; text-align:center; color:#666;">No songs added yet.</td></tr>`;

  const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Harold Trinidad Requested Song List - ${data.clientName}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #181512; margin: 0; padding: 28px; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; border: 2px solid #B08A3E; padding: 28px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #B08A3E; padding-bottom: 14px; margin-bottom: 18px; }
    .title { font-family: Georgia, serif; font-size: 24px; font-weight: 700; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th { background: #181512; color: #D9B45A; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width:820px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; background:#FAF6EE; padding:12px 16px; border:1px solid #D9B45A; border-radius:6px;">
    <strong>Save Requested Song List as PDF: Select "Save as PDF" in your printer destination.</strong>
    <button onclick="window.print()" style="background:#181512; color:#D9B45A; border:none; padding:8px 16px; border-radius:4px; font-weight:700; cursor:pointer;">Print / Save Song List PDF</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div>
        <div style="font-size:12px; font-weight:700; color:#8C6D2F; letter-spacing:0.08em;">OFFICIAL EVENT PERFORMANCE SETLIST</div>
        <div class="title">Requested Song List — Harold Trinidad</div>
        <div style="font-size:13px; color:#57534E;">Client: <strong>${data.clientName}</strong> | Event: <strong>${data.eventType}</strong> | Date: <strong>${data.eventDate}</strong></div>
        <div style="font-size:13px; color:#57534E; margin-top:2px;">Venue: ${data.eventVenue} (${data.settingVal})</div>
      </div>
      <div style="text-align:right; font-size:12px; color:#57534E;">
        <strong>${data.refId}</strong><br>Total Songs: ${data.songs.length}
      </div>
    </div>
    <table>
      <thead>
        <tr><th>#</th><th>Set / Moment</th><th>Song Title</th><th>Artist</th><th>YouTube Link</th><th>Type</th></tr>
      </thead>
      <tbody>${songsRowsHtml}</tbody>
    </table>
    <div style="margin-top:18px; font-size:13px; color:#57534E; background:#FAF8F5; padding:12px; border:1px solid #E5E0D8; border-radius:6px;">
      <strong>Special Conditions / Cues:</strong> ${data.eventNotes}
    </div>
  </div>
  <script>setTimeout(() => { window.print(); }, 350);</script>
</body>
</html>`;

  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
    showSiteToast('Song List PDF Ready!', 'Select "Save as PDF" in the print window.');
  }
}

function resolveMapSearchQuery(addressVal, mapVal) {
  const raw = (mapVal || addressVal || '').trim();
  if (!raw) return '';
  // Extract coordinates or query if full google maps url is pasted
  const qMatch = raw.match(/[?&]q=([^&]+)/);
  if (qMatch) return decodeURIComponent(qMatch[1]);
  const placeMatch = raw.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
  if (raw.startsWith('http')) {
    return addressVal.trim() || 'Pampanga, Philippines';
  }
  return raw;
}

function locateOnGoogleMap(venueNum) {
  const addrInput = document.getElementById(venueNum === 1 ? 'event-venue' : 'event-venue-2');
  const mapInput = document.getElementById(venueNum === 1 ? 'venue-1-map' : 'venue-2-map');
  const wrap = document.getElementById(venueNum === 1 ? 'map-preview-1-wrap' : 'map-preview-2-wrap');
  const iframe = document.getElementById(venueNum === 1 ? 'map-preview-1-iframe' : 'map-preview-2-iframe');
  const extLink = document.getElementById(venueNum === 1 ? 'open-map-1-link' : 'open-map-2-link');

  const addrVal = addrInput?.value.trim() || '';
  const mapVal = mapInput?.value.trim() || '';
  if (!addrVal && !mapVal) {
    showSiteToast('Enter Venue or Map Link', 'Please type the venue name/address or paste a Google Maps link first.');
    return;
  }

  const query = resolveMapSearchQuery(addrVal, mapVal);
  if (iframe && wrap) {
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    wrap.style.display = 'block';
  }
  if (extLink) {
    extLink.href = mapVal.startsWith('http')
      ? mapVal
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  showSiteToast('Location Preview Loaded!', `Showing Google Map for "${query}".`);
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-booking-btn');
  const spinner = document.getElementById('submit-spinner');
  const btnText = document.getElementById('submit-btn-text');

  // Song Modal Elements
  const songModal = document.getElementById('add-song-modal');
  const openSongModalBtn = document.getElementById('open-song-modal-btn');
  const closeSongModalBtn = document.getElementById('close-song-modal-btn');
  const cancelSongModalBtn = document.getElementById('cancel-song-modal-btn');
  const saveSongModalBtn = document.getElementById('save-song-modal-btn');
  const clearAllSongsBtn = document.getElementById('clear-all-songs-btn');

  const modalTitleInput = document.getElementById('modal-song-title');
  const modalArtistInput = document.getElementById('modal-song-artist');
  const modalYtInput = document.getElementById('modal-song-yt');
  const modalMomentSelect = document.getElementById('modal-song-moment');
  const modalArrSelect = document.getElementById('modal-song-arr');

  // Export Buttons
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  const exportSongsPdfBtn = document.getElementById('export-songs-pdf-btn');
  const exportSongsPdfTopBtn = document.getElementById('export-songs-pdf-top-btn');
  const exportImgBtn = document.getElementById('export-img-btn');

  // Map Buttons
  const locateMap1Btn = document.getElementById('locate-map-1-btn');
  const gpsMap1Btn = document.getElementById('gps-map-1-btn');
  const locateMap2Btn = document.getElementById('locate-map-2-btn');

  if (!form) return;

  // Render initial song table
  renderRequestedSongsTable();

  function openSongModal() {
    if (!songModal) return;
    songModal.classList.add('active');
    songModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modalTitleInput?.focus(), 80);
  }

  function closeSongModal() {
    if (!songModal) return;
    songModal.classList.remove('active');
    songModal.setAttribute('aria-hidden', 'true');
  }

  if (openSongModalBtn) openSongModalBtn.addEventListener('click', openSongModal);
  if (closeSongModalBtn) closeSongModalBtn.addEventListener('click', closeSongModal);
  if (cancelSongModalBtn) cancelSongModalBtn.addEventListener('click', closeSongModal);
  if (songModal) {
    songModal.addEventListener('click', (e) => {
      if (e.target === songModal) closeSongModal();
    });
  }

  if (saveSongModalBtn) {
    saveSongModalBtn.addEventListener('click', () => {
      const title = modalTitleInput?.value.trim() || '';
      const artist = modalArtistInput?.value.trim() || '';
      const ytLink = modalYtInput?.value.trim() || '';
      const moment = modalMomentSelect?.value || 'Dinner / Reception';
      const isCustom = modalArrSelect?.value === 'custom';

      if (!title) {
        showSiteToast('Missing Song Title', 'Please enter the song title in the modal.');
        modalTitleInput?.focus();
        return;
      }

      requestedSongsState.push({
        moment,
        title,
        artist: artist || 'Original Artist',
        ytLink,
        isCustom
      });

      if (modalTitleInput) modalTitleInput.value = '';
      if (modalArtistInput) modalArtistInput.value = '';
      if (modalYtInput) modalYtInput.value = '';
      if (modalArrSelect) modalArrSelect.value = 'standard';

      renderRequestedSongsTable();
      closeSongModal();
      showSiteToast('Song Added to Table!', `Added "${title}" to your requested song list.`);
    });
  }

  if (clearAllSongsBtn) {
    clearAllSongsBtn.addEventListener('click', () => {
      if (requestedSongsState.length === 0) {
        showSiteToast('List Already Empty', 'There are no songs to clear.');
        return;
      }
      requestedSongsState = [];
      renderRequestedSongsTable();
      showSiteToast('Cleared All Songs', 'All songs have been removed from the table.');
    });
  }

  // Quick-Add Song Chips -> Add directly to Table
  document.querySelectorAll('.song-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const title = chip.getAttribute('data-title') || '';
      const artist = chip.getAttribute('data-artist') || '';
      const ytLink = chip.getAttribute('data-yt') || '';

      requestedSongsState.push({
        moment: 'Dinner / Reception',
        title,
        artist,
        ytLink,
        isCustom: false
      });
      renderRequestedSongsTable();
      showSiteToast(`Added "${title}"`, 'Added directly to your Requested Songs Table.');
    });
  });

  // Quick-Add Special Condition Chips
  document.querySelectorAll('.cond-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const cond = chip.getAttribute('data-cond') || '';
      const notesEl = document.getElementById('event-notes');
      if (notesEl && cond) {
        if (!notesEl.value.includes(cond)) {
          notesEl.value = notesEl.value.trim()
            ? `${notesEl.value.trim()}\n• ${cond}`
            : `• ${cond}`;
        }
        showSiteToast('Condition Added', `Added "${cond}" to special instructions.`);
      }
    });
  });

  // Google Maps Handlers
  if (locateMap1Btn) locateMap1Btn.addEventListener('click', () => locateOnGoogleMap(1));
  if (locateMap2Btn) locateMap2Btn.addEventListener('click', () => locateOnGoogleMap(2));

  if (gpsMap1Btn) {
    gpsMap1Btn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        showSiteToast('GPS Not Supported', 'Your browser does not support GPS geolocation.');
        return;
      }
      showSiteToast('Locating via GPS...', 'Please allow location access when prompted.');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapInput = document.getElementById('venue-1-map');
          const addrInput = document.getElementById('event-venue');
          const gpsUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
          if (mapInput) mapInput.value = gpsUrl;
          if (addrInput && !addrInput.value.trim()) {
            addrInput.value = `Pinned GPS Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
          }
          const wrap = document.getElementById('map-preview-1-wrap');
          const iframe = document.getElementById('map-preview-1-iframe');
          const extLink = document.getElementById('open-map-1-link');
          if (iframe && wrap) {
            iframe.src = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
            wrap.style.display = 'block';
          }
          if (extLink) extLink.href = gpsUrl;
          showSiteToast('GPS Location Pinned!', 'Your current location is now linked on Google Maps.');
        },
        () => {
          showSiteToast('Could Not Pin GPS', 'Location permission denied or unavailable. Paste a Google Maps link instead.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Export Buttons
  if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportQuotationAsPDF);
  if (exportSongsPdfBtn) exportSongsPdfBtn.addEventListener('click', exportSongListAsPDF);
  if (exportSongsPdfTopBtn) exportSongsPdfTopBtn.addEventListener('click', exportSongListAsPDF);
  if (exportImgBtn) exportImgBtn.addEventListener('click', exportQuotationAsImage);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = collectFullFormData();
    const summaryText = buildTextSummary(data);

    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Preparing Quotation & Setlist...';

    try {
      await navigator.clipboard.writeText(summaryText);
    } catch (_) {}

    // Send booking email via EmailJS - report the REAL result, never fake success
    const sec = (getSiteConfig().adminSecurity) || {};
    const emailjsKey = sec.emailjsPublicKey || "1fzy7njkATDe4UUfw";
    const serviceId = sec.emailjsServiceId || "service_tpm1twd";
    const bookingTemplateId = sec.emailjsBookingTemplateId || "template_booking";
    let emailError = '';

    if (!window.emailjs) {
      emailError = 'EmailJS library did not load (blocked or offline)';
    } else {
      const songLines = data.songs.length > 0
        ? data.songs.map((s, i) => `${i + 1}. [${s.moment}] "${s.title}" by ${s.artist}${s.ytLink ? ' (' + s.ytLink + ')' : ''}${s.isCustom ? ' [+₱500 Custom]' : ''}`).join('\n')
        : 'None specified yet (Standard repertoire)';
      try {
        await Promise.race([
          emailjs.send(serviceId, bookingTemplateId, {
            client_name: data.clientName,
            client_phone: data.clientPhone,
            client_email: data.clientEmail,
            event_type: data.eventType,
            event_date: data.eventDate,
            event_time: data.eventTime,
            set_coverage: `${data.settingVal} (${data.pkgVal || 'Package A'})`,
            event_venue: data.eventVenue,
            coverage_area: data.areaVal,
            total_quotation: `₱${data.totalAmount.toLocaleString()}${data.isOutside ? ' + Travel' : ''}`,
            deposit_amount: `₱${data.depositAmount.toLocaleString()}`,
            song_list: songLines,
            special_notes: data.eventNotes,
            quote_ref: data.refId,
            to_email: sec.adminEmail || "haroldcalo.trinidad@gmail.com"
          }, emailjsKey),
          new Promise((_, rej) => setTimeout(() => rej({ text: 'timed out after 8s' }), 8000))
        ]);
      } catch (err) {
        emailError = `${err && err.status ? err.status + ' ' : ''}${(err && (err.text || err.message)) || 'unknown error'}`;
        console.error('Booking email failed:', err);
      }
    }

    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.style.display = 'none';
    if (btnText) btnText.textContent = 'Submit Quotation & Send Setlist to Harold';

    if (emailError) {
      showSiteToast('Email not delivered', `${emailError}. Opening Messenger instead - paste the copied setlist and send.`);
    } else {
      showSiteToast('Inquiry Sent to Harold!', 'Email delivered. Opening Messenger so you can also chat directly...');
    }
    setTimeout(() => window.open(`https://m.me/harold.calotrinidad?text=${encodeURIComponent(summaryText)}`, '_blank', 'noopener'), 900);
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


/* Special Request Cover: copy request text, open Messenger (m.me can't prefill reliably) */
(function initCoverForm() {
  const form = document.getElementById('cover-form');
  if (!form) return;
  const cfg = (typeof getSiteConfig === 'function' ? getSiteConfig() : window.SITE_CONFIG) || {};
  const price = cfg.rates?.specialCover ?? 1000;
  document.querySelectorAll('.cfg-cover-price').forEach(el => el.textContent = price.toLocaleString());
  const buildMsg = () => {
    const d = new FormData(form);
    return `Hi Harold! Special Request Cover (₱${price.toLocaleString()})\nName: ${d.get('name')}\nSong: ${d.get('song')}\nDedication: ${d.get('msg') || '-'}`;
  };
  form.addEventListener('input', () => {
    document.getElementById('cover-mail').href =
      `mailto:haroldcalo.trinidad@gmail.com?subject=${encodeURIComponent('Special Request Cover')}&body=${encodeURIComponent(buildMsg())}`;
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = buildMsg();
    try {
      await navigator.clipboard.writeText(msg);
      const toast = document.getElementById('toast-notification');
      const tTitle = document.getElementById('toast-title');
      const tMsg = document.getElementById('toast-message');
      if (toast && tTitle && tMsg) {
        tTitle.textContent = 'Request Copied to Clipboard!';
        tMsg.textContent = 'Opening Messenger — paste your cover request and send.';
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 4000);
      }
    } catch (_) {}
    window.open(`https://m.me/harold.calotrinidad?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
