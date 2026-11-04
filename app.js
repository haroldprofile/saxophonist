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
    document.querySelectorAll('.cfg-target-phone').forEach(el => {
      el.textContent = artist.phone;
      if (el.tagName === 'A') el.href = `tel:${artist.phone.replace(/[^+\d]/g, '')}`;
    });
    document.querySelectorAll('.cfg-target-phone-link').forEach(el => {
      el.href = `tel:${artist.phone.replace(/[^+\d]/g, '')}`;
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
   2. LIVE QUOTATION & MULTI-SONG SETLIST ENGINE
   ========================================== */
let currentQuoteRef = 'HT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

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
  const rows = document.querySelectorAll('#song-rows-list .song-row-card');
  const songs = [];
  rows.forEach((row, idx) => {
    const moment = row.querySelector('.song-moment-select')?.value || 'Performance Set';
    const title = row.querySelector('.song-title-input')?.value.trim() || '';
    const artist = row.querySelector('.song-artist-input')?.value.trim() || '';
    const ytLink = row.querySelector('.song-yt-input')?.value.trim() || '';
    const arrType = row.querySelector('.song-arr-select')?.value || 'standard';
    if (title || artist || ytLink) {
      songs.push({
        index: idx + 1,
        moment,
        title: title || 'Untitled Song',
        artist: artist || 'Standard Artist',
        ytLink,
        isCustom: arrType === 'custom'
      });
    }
  });
  return songs;
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
    pkgLabel = `Custom Event Quotation — ${settingVal}`;
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
  if (areaBadgeEl) areaBadgeEl.textContent = isOutside ? 'Outside Pampanga / Custom' : 'Pampanga Rate';
  if (areaLabelEl) areaLabelEl.textContent = areaVal;
  if (baseCostEl) baseCostEl.textContent = `₱${basePrice.toLocaleString()}`;
  if (transCostEl) transCostEl.textContent = isOutside ? 'Subject to Venue Distance' : `₱${transportCost.toLocaleString()}`;

  if (customRowEl) {
    customRowEl.style.display = customSongsCount > 0 ? 'flex' : 'none';
    if (customCountEl) customCountEl.textContent = customSongsCount;
    if (customCostEl) customCostEl.textContent = `₱${customSongsFee.toLocaleString()}`;
  }

  if (totalCostEl) {
    totalCostEl.textContent = isOutside
      ? `₱${totalAmount.toLocaleString()} + Travel Fee`
      : `₱${totalAmount.toLocaleString()}`;
  }
  if (depositCostEl) {
    depositCostEl.textContent = isOutside
      ? `₱${depositAmount.toLocaleString()} (${depPct}% Base Deposit)`
      : `₱${depositAmount.toLocaleString()} (${depPct}% Downpayment)`;
  }

  return {
    refId: currentQuoteRef,
    pkgVal,
    pkgLabel,
    settingVal,
    areaVal,
    isOutside,
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
      if (pkgSelect.value === 'Package A') {
        venueSetting.value = 'Church & Reception (2 Sets)';
      } else if (pkgSelect.value === 'Package B' && venueSetting.value.includes('2 Sets')) {
        venueSetting.value = 'Church Ceremony Only (1 Set)';
      }
      calculateLiveQuotation();
    });
  }

  if (venueSetting && pkgSelect) {
    venueSetting.addEventListener('change', () => {
      if (venueSetting.value.includes('2 Sets')) {
        pkgSelect.value = 'Package A';
      } else if (venueSetting.value.includes('1 Set')) {
        pkgSelect.value = 'Package B';
      }
      calculateLiveQuotation();
    });
  }

  if (locationArea) {
    locationArea.addEventListener('change', calculateLiveQuotation);
  }

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
   6. BESPOKE BOOKING FORM, SETLIST & PDF/IMAGE EXPORT
   ========================================== */
function collectFullFormData() {
  const quote = calculateLiveQuotation();
  const clientName = document.getElementById('client-name')?.value.trim() || 'Valued Client';
  const clientPhone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
  const clientEmail = document.getElementById('client-email')?.value.trim() || 'Not specified';
  const eventType = document.getElementById('event-type')?.value || 'Wedding Ceremony & Reception';
  const eventDate = document.getElementById('event-date')?.value || 'TBD';
  const eventTime = document.getElementById('event-time')?.value.trim() || 'Flexible / TBD';
  const eventVenue = document.getElementById('event-venue')?.value.trim() || 'TBD Venue';
  const eventNotes = document.getElementById('event-notes')?.value.trim() || 'Standard performance setup.';

  return {
    ...quote,
    clientName,
    clientPhone,
    clientEmail,
    eventType,
    eventDate,
    eventTime,
    eventVenue,
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
    `🏛️ Venue & Address: ${data.eventVenue} (${data.areaVal})`,
    ``,
    `🎵 REQUESTED SONG SETLIST (${data.songs.length}):`,
    songLines,
    ``,
    `📋 SPECIAL CONDITIONS & NOTES:`,
    `  ${data.eventNotes}`,
    ``,
    `💰 QUOTATION SUMMARY:`,
    `  • Base Package: ₱${data.basePrice.toLocaleString()}`,
    `  • Transport (${data.areaVal}): ${data.isOutside ? 'Subject to venue distance' : '₱' + data.transportCost.toLocaleString()}`,
    data.customSongsCount > 0 ? `  • Custom Song Arrangements (${data.customSongsCount}x): ₱${data.customSongsFee.toLocaleString()}` : null,
    `  • ESTIMATED TOTAL: ₱${data.totalAmount.toLocaleString()}${data.isOutside ? ' + Travel Fee' : ''}`,
    `  • 30% RESERVATION DEPOSIT: ₱${data.depositAmount.toLocaleString()}`
  ].filter(Boolean).join('\n');
}

function exportQuotationAsImage() {
  const data = collectFullFormData();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const W = 1200;
  const songCount = Math.max(1, data.songs.length);
  const H = 880 + (songCount * 58);
  canvas.width = W;
  canvas.height = H;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#141210');
  bgGrad.addColorStop(1, '#1F1B17');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Outer Gold Border
  ctx.strokeStyle = '#D9B45A';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = 'rgba(217, 180, 90, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  // Header Banner
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('OFFICIAL EVENT QUOTATION & PERFORMANCE SETLIST', 64, 82);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.fillText('HAROLD TRINIDAD — LIVE SAXOPHONIST', 64, 128);

  ctx.fillStyle = '#A8A29E';
  ctx.font = '17px sans-serif';
  ctx.fillText('Pampanga & Nationwide | FB: facebook.com/harold.calotrinidad | Email: haroldcalo.trinidad@gmail.com', 64, 158);

  // Ref Badge
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

  // Divider
  ctx.strokeStyle = 'rgba(217, 180, 90, 0.35)';
  ctx.beginPath();
  ctx.moveTo(64, 182);
  ctx.lineTo(W - 64, 182);
  ctx.stroke();

  // Client & Event Details Grid
  const drawField = (label, value, x, y, maxW = 500) => {
    ctx.fillStyle = '#D9B45A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 19px sans-serif';
    const clipped = value.length > 48 ? value.slice(0, 45) + '...' : value;
    ctx.fillText(clipped, x, y + 25, maxW);
  };

  drawField('Client Name', data.clientName, 64, 218);
  drawField('Contact / Email', `${data.clientPhone}  |  ${data.clientEmail}`, 600, 218);

  drawField('Event Type / Occasion', data.eventType, 64, 284);
  drawField('Event Date & Time', `${data.eventDate}  (${data.eventTime})`, 600, 284);

  drawField('Selected Set & Coverage', `${data.settingVal}  [${data.pkgVal || 'Package A'}]`, 64, 350);
  drawField('Venue Address & Area', `${data.eventVenue} (${data.areaVal})`, 600, 350);

  // Song List Section
  let curY = 420;
  ctx.fillStyle = 'rgba(217, 180, 90, 0.14)';
  ctx.fillRect(64, curY, W - 128, 38);
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`REQUESTED PERFORMANCE SETLIST (${data.songs.length} SONG${data.songs.length === 1 ? '' : 'S'})`, 80, curY + 25);
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

  // Special Conditions
  curY += 12;
  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('SPECIAL CONDITIONS & EVENT INSTRUCTIONS:', 64, curY);
  ctx.fillStyle = '#E7E5E4';
  ctx.font = '16px sans-serif';
  const notesClipped = data.eventNotes.length > 115 ? data.eventNotes.slice(0, 112) + '...' : data.eventNotes;
  ctx.fillText(notesClipped, 64, curY + 26);

  // Quotation Box at Bottom
  curY += 58;
  ctx.fillStyle = '#1C1814';
  ctx.fillRect(64, curY, W - 128, 195);
  ctx.strokeStyle = '#D9B45A';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, curY, W - 128, 195);

  ctx.fillStyle = '#D9B45A';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('ITEMIZED QUOTATION BREAKDOWN', 92, curY + 36);

  ctx.fillStyle = '#D6D3D1';
  ctx.font = '17px sans-serif';
  ctx.fillText(`Base Package (${data.pkgLabel}):`, 92, curY + 70);
  ctx.fillText(`₱${data.basePrice.toLocaleString()}`, W - 260, curY + 70);

  ctx.fillText(`Transport & Logistics (${data.areaVal}):`, 92, curY + 100);
  ctx.fillText(data.isOutside ? 'Custom Travel Fee' : `₱${data.transportCost.toLocaleString()}`, W - 260, curY + 100);

  ctx.fillText(`Custom Song Arrangements (${data.customSongsCount} song${data.customSongsCount === 1 ? '' : 's'}):`, 92, curY + 130);
  ctx.fillText(`₱${data.customSongsFee.toLocaleString()}`, W - 260, curY + 130);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ESTIMATED TOTAL QUOTATION:', 92, curY + 170);
  ctx.fillStyle = '#D9B45A';
  ctx.fillText(`₱${data.totalAmount.toLocaleString()}${data.isOutside ? ' + Travel' : ''}   |   30% DEPOSIT: ₱${data.depositAmount.toLocaleString()}`, 460, curY + 170);

  // Trigger PNG Download
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
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #181512; margin: 0; padding: 32px; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; border: 2px solid #B08A3E; padding: 28px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #B08A3E; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; margin: 4px 0; color: #181512; }
    .badge { background: #181512; color: #D9B45A; padding: 6px 12px; border-radius: 4px; font-weight: 700; font-size: 13px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .box { background: #FAF8F5; border: 1px solid #E5E0D8; padding: 10px 14px; border-radius: 6px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #8C6D2F; font-weight: 700; }
    .val { font-size: 15px; font-weight: 600; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th { background: #181512; color: #D9B45A; text-align: left; padding: 9px 10px; font-size: 12px; text-transform: uppercase; }
    .summary { background: #181512; color: #fff; padding: 18px 22px; border-radius: 8px; margin-top: 16px; }
    .sum-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
    .sum-total { border-top: 1px dashed #D9B45A; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 700; color: #D9B45A; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print" style="max-width:820px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; background:#FAF6EE; padding:12px 16px; border:1px solid #D9B45A; border-radius:6px;">
    <strong>Ready to Save as PDF: Choose "Save as PDF" in your printer destination.</strong>
    <button onclick="window.print()" style="background:#181512; color:#D9B45A; border:none; padding:8px 16px; border-radius:4px; font-weight:700; cursor:pointer;">Print / Save PDF</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div>
        <div style="font-size:12px; font-weight:700; color:#8C6D2F; letter-spacing:0.08em;">OFFICIAL EVENT QUOTATION &amp; SETLIST</div>
        <div class="title">Harold Trinidad — Live Saxophonist</div>
        <div style="font-size:13px; color:#57534E;">Pampanga Area &amp; Nationwide | haroldcalo.trinidad@gmail.com | fb.com/harold.calotrinidad</div>
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
      <div class="box"><div class="label">Selected Set &amp; Setting</div><div class="val">${data.settingVal} (${data.pkgVal || 'Package A'})</div></div>
      <div class="box"><div class="label">Venue Location &amp; Address</div><div class="val">${data.eventVenue} (${data.areaVal})</div></div>
    </div>

    <h4 style="margin: 16px 0 8px; text-transform: uppercase; font-size: 13px; color: #8C6D2F;">Requested Song Setlist (${data.songs.length})</h4>
    <table>
      <thead>
        <tr><th>#</th><th>Set / Moment</th><th>Song Title</th><th>Artist</th><th>YouTube Reference</th><th>Arrangement</th></tr>
      </thead>
      <tbody>${songsRowsHtml}</tbody>
    </table>

    <div class="box" style="margin-bottom:16px;">
      <div class="label">Special Conditions &amp; Event Instructions</div>
      <div class="val" style="font-weight:400; font-size:14px;">${data.eventNotes}</div>
    </div>

    <div class="summary">
      <div class="sum-row"><span>Base Performance Package (${data.pkgLabel}):</span><strong>₱${data.basePrice.toLocaleString()}</strong></div>
      <div class="sum-row"><span>Transport &amp; Logistics (${data.areaVal}):</span><strong>${data.isOutside ? 'Custom Travel Quote' : '₱' + data.transportCost.toLocaleString()}</strong></div>
      <div class="sum-row"><span>Custom Song Arrangements (${data.customSongsCount} × ₱500):</span><strong>₱${data.customSongsFee.toLocaleString()}</strong></div>
      <div class="sum-row sum-total"><span>ESTIMATED TOTAL QUOTATION:</span><span>₱${data.totalAmount.toLocaleString()}${data.isOutside ? ' + Travel' : ''}</span></div>
      <div class="sum-row" style="color:#FFF8DC; font-weight:700; margin-top:6px;"><span>30% Required Deposit to Reserve Date:</span><span>₱${data.depositAmount.toLocaleString()}</span></div>
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
    showSiteToast('PDF Quotation Ready!', 'Choose "Save as PDF" in the print dialog to save your quotation.');
  } else {
    showSiteToast('Popup Blocked — Downloading Image Instead', 'Your browser blocked the PDF print tab, downloading high-res PNG quotation.');
    exportQuotationAsImage();
  }
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-booking-btn');
  const spinner = document.getElementById('submit-spinner');
  const btnText = document.getElementById('submit-btn-text');
  const songListContainer = document.getElementById('song-rows-list');
  const addSongBtn = document.getElementById('add-song-row-btn');
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  const exportImgBtn = document.getElementById('export-img-btn');

  if (!form) return;

  function renumberSongRows() {
    const cards = songListContainer.querySelectorAll('.song-row-card');
    cards.forEach((card, idx) => {
      const badge = card.querySelector('.song-row-badge');
      if (badge) badge.textContent = `Song #${idx + 1}`;
    });
    calculateLiveQuotation();
  }

  function addSongRow(prefill = {}) {
    if (!songListContainer) return;
    const count = songListContainer.querySelectorAll('.song-row-card').length + 1;
    const card = document.createElement('div');
    card.className = 'song-row-card';
    card.innerHTML = `
      <div class="song-row-top">
        <span class="song-row-badge">Song #${count}</span>
        <button type="button" class="song-row-remove" aria-label="Remove song">✕ Remove</button>
      </div>
      <div class="song-row-grid">
        <input type="text" class="form-input song-title-input" placeholder="Song Title (e.g. Through The Years)" value="${prefill.title || ''}">
        <input type="text" class="form-input song-artist-input" placeholder="Artist (e.g. Kenny Rogers)" value="${prefill.artist || ''}">
        <input type="url" class="form-input song-yt-input" placeholder="YouTube Link (Optional: https://youtu.be/...)" value="${prefill.yt || ''}">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem;">
          <select class="form-select song-moment-select" aria-label="Event Moment">
            <option value="Bridal Entrance">Bridal Entrance</option>
            <option value="Church / Ceremony">Church / Ceremony</option>
            <option value="Garden / Cocktail">Garden / Cocktail</option>
            <option value="Couple Entrance">Couple Entrance</option>
            <option value="First Dance">First Dance</option>
            <option value="Dinner / Reception" selected>Dinner / Reception</option>
            <option value="Special Dedication">Special Dedication</option>
          </select>
          <select class="form-select song-arr-select" aria-label="Arrangement Type">
            <option value="standard" selected>Repertoire (Free)</option>
            <option value="custom">Custom (+₱500)</option>
          </select>
        </div>
      </div>
    `;

    card.querySelector('.song-row-remove').addEventListener('click', () => {
      card.remove();
      renumberSongRows();
    });

    card.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calculateLiveQuotation);
      el.addEventListener('change', calculateLiveQuotation);
    });

    songListContainer.appendChild(card);
    calculateLiveQuotation();
  }

  // Initialize with 1 default song row
  if (songListContainer && songListContainer.children.length === 0) {
    addSongRow({
      title: 'Through The Years',
      artist: 'Kenny Rogers',
      yt: 'https://youtu.be/ShtHM_xGZwg'
    });
  }

  if (addSongBtn) {
    addSongBtn.addEventListener('click', () => addSongRow());
  }

  // Quick-Add Song Chips
  document.querySelectorAll('.song-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const title = chip.getAttribute('data-title') || '';
      const artist = chip.getAttribute('data-artist') || '';
      const yt = chip.getAttribute('data-yt') || '';

      // Check if first row is empty
      const existingCards = songListContainer.querySelectorAll('.song-row-card');
      if (existingCards.length === 1) {
        const firstTitle = existingCards[0].querySelector('.song-title-input');
        if (firstTitle && !firstTitle.value.trim()) {
          firstTitle.value = title;
          existingCards[0].querySelector('.song-artist-input').value = artist;
          existingCards[0].querySelector('.song-yt-input').value = yt;
          calculateLiveQuotation();
          showSiteToast(`Added "${title}"`, 'Song added to your event setlist.');
          return;
        }
      }
      addSongRow({ title, artist, yt });
      showSiteToast(`Added "${title}"`, 'Song added to your event setlist.');
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

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', exportQuotationAsPDF);
  }
  if (exportImgBtn) {
    exportImgBtn.addEventListener('click', exportQuotationAsImage);
  }

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

    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (btnText) btnText.textContent = 'Submit Quotation & Send Setlist to Harold';

      showSiteToast(
        'Quotation & Setlist Copied!',
        'Opening Messenger — paste your complete setlist & quotation to confirm your date.'
      );

      window.open(`https://m.me/harold.calotrinidad?text=${encodeURIComponent(summaryText)}`, '_blank', 'noopener');
    }, 600);
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
