// =========================================================
// RULEMYHOLIDAY — Application Logic & Event Handlers
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Header Badges
  if (typeof Store !== 'undefined') {
    Store.updateHeaderBadges();
    Store.updateUserUI();
  }

  /* ---------------------------------------------------------
     Hero Video Controls (Autoplay, Mute/Unmute & Play/Pause)
     --------------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroSoundBtn = document.getElementById('heroSoundBtn');
  const heroPlayBtn = document.getElementById('heroPlayBtn');

  if (heroVideo) {
    // Attempt auto-play programmatically for mobile & desktop compatibility
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log("Autoplay prevented by browser, waiting for user gesture:", err);
      });
    }

    // Touch & Scroll listener fallback for mobile devices
    const playVideoOnGesture = () => {
      if (heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
      window.removeEventListener('touchstart', playVideoOnGesture);
      window.removeEventListener('scroll', playVideoOnGesture);
    };
    window.addEventListener('touchstart', playVideoOnGesture, { passive: true });
    window.addEventListener('scroll', playVideoOnGesture, { passive: true });

    if (heroSoundBtn) {
      heroSoundBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        const iconSpan = heroSoundBtn.querySelector('.sound-icon');
        const labelSpan = heroSoundBtn.querySelector('.control-label');
        if (heroVideo.muted) {
          if (iconSpan) iconSpan.textContent = '🔇';
          if (labelSpan) labelSpan.textContent = 'Sound Off';
          window.showToast('Audio Muted');
        } else {
          if (iconSpan) iconSpan.textContent = '🔊';
          if (labelSpan) labelSpan.textContent = 'Sound On';
          window.showToast('Audio Enabled 🔊');
        }
      });
    }

    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', () => {
        const iconSpan = heroPlayBtn.querySelector('.play-icon');
        const labelSpan = heroPlayBtn.querySelector('.control-label');
        if (heroVideo.paused) {
          heroVideo.play();
          if (iconSpan) iconSpan.textContent = '⏸';
          if (labelSpan) labelSpan.textContent = 'Pause';
        } else {
          heroVideo.pause();
          if (iconSpan) iconSpan.textContent = '▶';
          if (labelSpan) labelSpan.textContent = 'Play';
        }
      });
    }
  }

  /* ---------------------------------------------------------
     1. Toast System
     --------------------------------------------------------- */
  window.showToast = function(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  /* ---------------------------------------------------------
     2. Mobile Navigation Drawer
     --------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openMobileNav() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.add('open');
      mobileNavBackdrop.classList.add('open');
    }
  }
  function closeMobileNav() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.remove('open');
      mobileNavBackdrop.classList.remove('open');
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  /* ---------------------------------------------------------
     3. Enquire Now Modal
     --------------------------------------------------------- */
  const enquireModal = document.getElementById('enquireModal');
  const headerEnquireBtn = document.getElementById('headerEnquireBtn');
  const mobileEnquireBtn = document.getElementById('mobileEnquireBtn');
  const enquireForm = document.getElementById('enquireForm');

  function openEnquireModal(e) {
    if (e) e.preventDefault();
    if (enquireModal) enquireModal.classList.add('open');
  }

  const heroRequestQuoteBtn = document.getElementById('heroRequestQuoteBtn');

  if (headerEnquireBtn) headerEnquireBtn.addEventListener('click', openEnquireModal);
  if (mobileEnquireBtn) mobileEnquireBtn.addEventListener('click', openEnquireModal);
  if (heroRequestQuoteBtn) heroRequestQuoteBtn.addEventListener('click', openEnquireModal);

  if (enquireForm) {
    enquireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('enqName').value;
      const phone = document.getElementById('enqPhone').value;
      if (enquireModal) enquireModal.classList.remove('open');
      window.showToast(`Thank you, ${name}! Our travel expert will call you shortly on ${phone}. 📞`);
    });
  }

  /* ---------------------------------------------------------
     4. Floating AI Trip Planner Button ("Plan My Trip")
     --------------------------------------------------------- */
  const btnPlanTrip = document.getElementById('btnPlanTrip');
  if (btnPlanTrip) {
    btnPlanTrip.addEventListener('click', () => {
      const searchWidget = document.querySelector('.search-widget');
      if (searchWidget) searchWidget.scrollIntoView({ behavior: 'smooth' });
      window.showToast("Select your destination & dates to plan your trip! ✈");
    });
  }

  /* ---------------------------------------------------------
     5. Wishlist Modal Handlers
     --------------------------------------------------------- */
  const wishlistModal = document.getElementById('wishlistModal');
  document.querySelectorAll('.wishlist-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderWishlistModal();
      if (wishlistModal) wishlistModal.classList.add('open');
    });
  });

  function renderWishlistModal() {
    const body = document.getElementById('wishlistModalBody');
    if (!body) return;
    const wishlistIds = Store.getWishlist();
    if (!wishlistIds.length) {
      body.innerHTML = `<p style="text-align:center;color:var(--text-mute);padding:20px;">Your wishlist is empty. Explore packages!</p>`;
      return;
    }
    const savedPkgs = PACKAGES_DATA.filter(p => wishlistIds.includes(p.id));
    body.innerHTML = savedPkgs.map(p => `
      <div style="display:flex;gap:12px;align-items:center;background:var(--paper);padding:12px;border-radius:8px;border:1px solid var(--line);">
        <img src="${p.photos[0]}" style="width:70px;height:55px;object-fit:cover;border-radius:6px;" alt="${p.title}">
        <div style="flex:1;">
          <h4 style="font-size:14px;margin:0;">${p.title}</h4>
          <span style="font-size:12px;color:var(--text-mute);">${p.durationDays}D/${p.durationNights}N · ₹${p.priceDiscounted.toLocaleString('en-IN')}</span>
        </div>
        <a href="package-details.html?id=${p.id}" class="btn-solid" style="padding:6px 12px;font-size:12px;">View</a>
        <button onclick="Store.toggleWishlist('${p.id}'); renderWishlistModal();" style="background:none;border:none;color:#B5453A;font-size:16px;">✕</button>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     6. Package Card Generator & Wishlist Toggle
     --------------------------------------------------------- */
  function createPackageCardHTML(p) {
    const isSaved = Store.isWishlisted(p.id);
    return `
      <article class="pkg-card" data-id="${p.id}">
        <div class="pkg-photo">
          <img src="${p.photos[0]}" alt="${p.title}" loading="lazy">
          ${p.badge ? `<span class="pkg-badge">${p.badge}</span>` : ''}
          <button class="pkg-wish" data-id="${p.id}">${isSaved ? '❤️' : '🤍'}</button>
        </div>
        <div class="pkg-body">
          <div class="pkg-route">${p.route}</div>
          <h3>${p.title}</h3>
          <div class="pkg-duration">${p.durationNights}N/${p.durationDays}D · ★ ${p.rating} (${p.reviewsCount} reviews)</div>
          <div class="pkg-incl">
            ${p.inclusions.slice(0,3).map(inc => `<span>${inc.split(' ')[0]} ${inc.split(' ')[1] || ''}</span>`).join('')}
          </div>
          <div class="pkg-foot">
            <div class="pkg-price">
              <span class="was">₹${p.priceOriginal.toLocaleString('en-IN')}</span>
              <div class="now">₹${p.priceDiscounted.toLocaleString('en-IN')}</div>
              <span class="pp">per person</span>
            </div>
            <div class="pkg-actions">
              <a href="package-details.html?id=${p.id}" class="btn-ghost">View</a>
              <a href="package-details.html?id=${p.id}&book=true" class="btn-solid">Book</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.pkg-wish');
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = wishBtn.dataset.id;
      const added = Store.toggleWishlist(id);
      wishBtn.textContent = added ? '❤️' : '🤍';
      window.showToast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    }
  });

  /* ---------------------------------------------------------
     7. Hero Search Widget & Tabs
     --------------------------------------------------------- */
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    const heroTabs = document.querySelectorAll('#heroSearchTabs button');
    heroTabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        heroTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('destInput').value.trim();
      let params = new URLSearchParams();
      if (dest) params.append('dest', dest);
      window.location.href = `packages.html?${params.toString()}`;
    });

    // Render domestic grid on home page
    const domesticGrid = document.getElementById('domesticPkgGrid');
    if (domesticGrid && typeof PACKAGES_DATA !== 'undefined') {
      domesticGrid.innerHTML = PACKAGES_DATA.slice(0, 6).map(createPackageCardHTML).join('');
    }
  }

  /* ---------------------------------------------------------
     8. Packages Listing Page Logic (packages.html)
     --------------------------------------------------------- */
  const mainPkgGrid = document.getElementById('mainPkgGrid');
  if (mainPkgGrid && typeof PACKAGES_DATA !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const initialDest = urlParams.get('dest');

    if (initialDest) {
      document.querySelectorAll('[data-filter="dest"]').forEach(cb => {
        if (cb.value.toLowerCase() === initialDest.toLowerCase()) cb.checked = true;
      });
    }

    function filterAndRenderPackages() {
      const selectedDests = Array.from(document.querySelectorAll('[data-filter="dest"]:checked')).map(cb => cb.value.toLowerCase());
      const maxPrice = document.getElementById('priceRangeInput') ? parseInt(document.getElementById('priceRangeInput').value, 10) : 150000;
      const keyword = document.getElementById('pkgKeywordInput') ? document.getElementById('pkgKeywordInput').value.toLowerCase().trim() : '';

      let filtered = PACKAGES_DATA.filter(p => {
        if (selectedDests.length && !selectedDests.includes(p.destination.toLowerCase())) return false;
        if (p.priceDiscounted > maxPrice) return false;
        if (keyword && !`${p.title} ${p.destination} ${p.route}`.toLowerCase().includes(keyword)) return false;
        return true;
      });

      const resultCount = document.getElementById('resultCount');
      if (resultCount) resultCount.textContent = `${filtered.length} holiday package${filtered.length === 1 ? '' : 's'} found`;

      mainPkgGrid.innerHTML = filtered.map(createPackageCardHTML).join('');
    }

    document.querySelectorAll('[data-filter]').forEach(inp => inp.addEventListener('change', filterAndRenderPackages));
    const priceRangeInput = document.getElementById('priceRangeInput');
    if (priceRangeInput) priceRangeInput.addEventListener('input', filterAndRenderPackages);
    const pkgKeywordInput = document.getElementById('pkgKeywordInput');
    if (pkgKeywordInput) pkgKeywordInput.addEventListener('input', filterAndRenderPackages);

    filterAndRenderPackages();
  }

});
