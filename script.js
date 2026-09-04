// =========================================================
// RULEMYHOLIDAY — Core Dynamic Application Engine
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Header State (Wishlist & Bookings count)
  if (typeof Store !== 'undefined') {
    Store.updateHeaderBadges();
    Store.updateUserUI();
  }

  /* ---------------------------------------------------------
     1. Toast Notification System
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

  // Close drawer on mobile nav link click
  document.querySelectorAll('.mobile-nav-links a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });

  // Sticky Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  });

  /* ---------------------------------------------------------
     3. Global Modals (Wishlist, Bookings, Login)
     --------------------------------------------------------- */
  const wishlistModal = document.getElementById('wishlistModal');
  const bookingsModal = document.getElementById('bookingsModal');
  const loginModal = document.getElementById('loginModal');

  // Open Wishlist Modal
  document.querySelectorAll('.wishlist-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderWishlistModal();
      if (wishlistModal) wishlistModal.classList.add('open');
    });
  });

  // Open Bookings Modal
  document.querySelectorAll('.bookings-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderBookingsModal();
      if (bookingsModal) bookingsModal.classList.add('open');
    });
  });

  // Open Login Modal
  document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const user = Store.getUser();
      if (user) {
        if (confirm(`Logged in as ${user.name}. Do you want to logout?`)) {
          localStorage.removeItem('rmh_user');
          Store.updateUserUI();
          window.showToast("Logged out successfully");
        }
      } else {
        if (loginModal) loginModal.classList.add('open');
      }
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const name = email.split('@')[0];
      Store.setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email });
      if (loginModal) loginModal.classList.remove('open');
      window.showToast(`Welcome back, ${name}! 👋`);
    });
  }

  function renderWishlistModal() {
    const body = document.getElementById('wishlistModalBody');
    if (!body) return;
    const wishlistIds = Store.getWishlist();
    if (!wishlistIds.length) {
      body.innerHTML = `<p style="text-align:center;color:var(--text-mute);padding:20px;">Your wishlist is currently empty. Start exploring packages!</p>`;
      return;
    }
    const savedPkgs = PACKAGES_DATA.filter(p => wishlistIds.includes(p.id));
    body.innerHTML = savedPkgs.map(p => `
      <div style="display:flex;gap:12px;align-items:center;background:var(--sage);padding:12px;border-radius:var(--radius-s);border:1px solid var(--line);">
        <img src="${p.photos[0]}" style="width:70px;height:55px;object-fit:cover;border-radius:6px;" alt="${p.title}">
        <div style="flex:1;">
          <h4 style="font-size:14px;margin:0;">${p.title}</h4>
          <span style="font-size:12px;color:var(--text-mute);">${p.durationDays}D/${p.durationNights}N · ₹${p.priceDiscounted.toLocaleString('en-IN')}</span>
        </div>
        <a href="package-details.html?id=${p.id}" class="btn-solid" style="padding:6px 12px;font-size:12px;">View</a>
        <button onclick="Store.toggleWishlist('${p.id}'); renderWishlistModal();" style="background:none;border:none;color:#B5453A;font-size:16px;" title="Remove">✕</button>
      </div>
    `).join('');
  }

  function renderBookingsModal() {
    const body = document.getElementById('bookingsModalBody');
    if (!body) return;
    const bookings = Store.getBookings();
    if (!bookings.length) {
      body.innerHTML = `<p style="text-align:center;color:var(--text-mute);padding:20px;">No bookings found yet. Book your first trip today!</p>`;
      return;
    }
    body.innerHTML = bookings.map(b => `
      <div style="background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-s);padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:12px;font-weight:700;color:var(--sunset);">${b.bookingId}</span>
          <span style="background:var(--green);color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;">${b.status}</span>
        </div>
        <h4 style="font-size:15px;margin:0 0 4px;">${b.title}</h4>
        <div style="font-size:12.5px;color:var(--text-mute);">
          <span>Travel Date: <strong>${b.date || 'TBD'}</strong></span> · <span>${b.travelers} Travelers (${b.roomType})</span>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:700;color:var(--ink);">Paid: ₹${(b.totalPaid || 0).toLocaleString('en-IN')}</span>
          <a href="package-details.html?id=${b.packageId}" style="font-size:12px;color:var(--ocean);font-weight:600;">View Itinerary →</a>
        </div>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     4. Helper: Package Card HTML Generator
     --------------------------------------------------------- */
  function createPackageCardHTML(p) {
    const isSaved = Store.isWishlisted(p.id);
    return `
      <article class="pkg-card" data-id="${p.id}" data-price="${p.priceDiscounted}" data-duration="${p.durationDays}" data-rating="${p.rating}">
        <div class="pkg-photo">
          <img src="${p.photos[0]}" alt="${p.title}" loading="lazy">
          ${p.badge ? `<span class="pkg-badge">${p.badge}</span>` : ''}
          <button class="pkg-wish" data-id="${p.id}" aria-label="Save to wishlist">${isSaved ? '❤️' : '🤍'}</button>
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

  // Delegate Wishlist Heart Click Event
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
     5. HOME PAGE LOGIC (index.html)
     --------------------------------------------------------- */
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    // Tab switching inside search card
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
      const dur = document.getElementById('durInput').value;
      const activeTab = document.querySelector('#heroSearchTabs button.active');
      const type = activeTab ? activeTab.dataset.type : 'all';

      let params = new URLSearchParams();
      if (dest) params.append('dest', dest);
      if (dur) params.append('duration', dur);
      if (type && type !== 'all') {
        if (type === 'honeymoon') params.append('theme', 'honeymoon');
        else params.append('type', type);
      }
      window.location.href = `packages.html?${params.toString()}`;
    });

    // Render domestic packages on index.html
    const domesticGrid = document.getElementById('domesticPkgGrid');
    if (domesticGrid && typeof PACKAGES_DATA !== 'undefined') {
      const domPkgs = PACKAGES_DATA.filter(p => p.type === 'domestic').slice(0, 3);
      domesticGrid.innerHTML = domPkgs.map(createPackageCardHTML).join('');
    }

    // Render international packages on index.html
    const intlGrid = document.getElementById('intlPkgGrid');
    if (intlGrid && typeof PACKAGES_DATA !== 'undefined') {
      const intlPkgs = PACKAGES_DATA.filter(p => p.type === 'international').slice(0, 3);
      intlGrid.innerHTML = intlPkgs.map(createPackageCardHTML).join('');
    }

    // Render Deals strip on index.html
    const dealsStrip = document.getElementById('dealsStrip');
    if (dealsStrip && typeof DEALS_DATA !== 'undefined') {
      dealsStrip.innerHTML = DEALS_DATA.map((d, i) => `
        <div class="deal-card d${i+1}" onclick="window.location.href='packages.html?coupon=${d.code}'" style="cursor:pointer;">
          <div>
            <div class="dtag">${d.tag}</div>
            <h3>${d.title}</h3>
          </div>
          <div class="deal-timer" data-hours="${d.hours}">
            Ends in <b class="h">24</b>:<b class="m">00</b>:<b class="s">00</b>
          </div>
        </div>
      `).join('');

      // Start countdown timers
      document.querySelectorAll('.deal-timer').forEach(timer => {
        let total = parseInt(timer.dataset.hours, 10) * 3600;
        const h = timer.querySelector('.h'), m = timer.querySelector('.m'), s = timer.querySelector('.s');
        setInterval(() => {
          if (total <= 0) return;
          total--;
          const hh = String(Math.floor(total / 3600)).padStart(2, '0');
          const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
          const ss = String(total % 60).padStart(2, '0');
          if (h) h.textContent = hh;
          if (m) m.textContent = mm;
          if (s) s.textContent = ss;
        }, 1000);
      });
    }
  }

  /* ---------------------------------------------------------
     6. PACKAGES LISTING PAGE LOGIC (packages.html)
     --------------------------------------------------------- */
  const mainPkgGrid = document.getElementById('mainPkgGrid');
  if (mainPkgGrid && typeof PACKAGES_DATA !== 'undefined') {

    const urlParams = new URLSearchParams(window.location.search);
    const initialType = urlParams.get('type');
    const initialDest = urlParams.get('dest');
    const initialTheme = urlParams.get('theme');
    const initialDuration = urlParams.get('duration');

    // Pre-check filters based on URL
    if (initialDest) {
      document.querySelectorAll('[data-filter="dest"]').forEach(cb => {
        if (cb.value.toLowerCase() === initialDest.toLowerCase()) cb.checked = true;
      });
    }
    if (initialTheme) {
      document.querySelectorAll('[data-filter="theme"]').forEach(cb => {
        if (cb.value.toLowerCase() === initialTheme.toLowerCase()) cb.checked = true;
      });
    }
    if (initialDuration) {
      document.querySelectorAll('[data-filter="duration"]').forEach(cb => {
        if (cb.value === initialDuration) cb.checked = true;
      });
    }

    const priceRangeInput = document.getElementById('priceRangeInput');
    const priceRangeLabel = document.getElementById('priceRangeLabel');
    const pkgKeywordInput = document.getElementById('pkgKeywordInput');
    const sortSelect = document.getElementById('sortSelect');
    const resultCount = document.getElementById('resultCount');
    const activeFilterChips = document.getElementById('activeFilterChips');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Mobile Filter Drawer Toggle
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const mobileFilterDrawerModal = document.getElementById('mobileFilterDrawerModal');
    if (mobileFilterBtn && mobileFilterDrawerModal) {
      mobileFilterBtn.addEventListener('click', () => {
        const filterSidebar = document.getElementById('filterSidebar');
        const content = document.getElementById('mobileFilterDrawerContent');
        if (filterSidebar && content) {
          content.innerHTML = filterSidebar.innerHTML;
          // Re-bind listeners on mobile clone
          content.querySelectorAll('input, select').forEach(inp => {
            inp.addEventListener('change', () => filterAndRenderPackages());
          });
        }
        mobileFilterDrawerModal.classList.add('open');
      });
    }

    function filterAndRenderPackages() {
      const selectedDests = Array.from(document.querySelectorAll('[data-filter="dest"]:checked')).map(cb => cb.value.toLowerCase());
      const selectedThemes = Array.from(document.querySelectorAll('[data-filter="theme"]:checked')).map(cb => cb.value.toLowerCase());
      const selectedDurations = Array.from(document.querySelectorAll('[data-filter="duration"]:checked')).map(cb => cb.value);
      const selectedStars = Array.from(document.querySelectorAll('[data-filter="stars"]:checked')).map(cb => parseInt(cb.value, 10));
      const maxPrice = priceRangeInput ? parseInt(priceRangeInput.value, 10) : 150000;
      const keyword = pkgKeywordInput ? pkgKeywordInput.value.toLowerCase().trim() : '';

      let filtered = PACKAGES_DATA.filter(p => {
        // Type filter (domestic / international)
        if (initialType && p.type !== initialType) return false;

        // Destination
        if (selectedDests.length && !selectedDests.includes(p.destination.toLowerCase())) return false;

        // Price
        if (p.priceDiscounted > maxPrice) return false;

        // Theme
        if (selectedThemes.length && !selectedThemes.includes(p.theme.toLowerCase())) return false;

        // Star category
        if (selectedStars.length && !selectedStars.includes(p.starCategory)) return false;

        // Duration
        if (selectedDurations.length) {
          const match = selectedDurations.some(dur => {
            if (dur === '1-3') return p.durationDays >= 1 && p.durationDays <= 3;
            if (dur === '4-6') return p.durationDays >= 4 && p.durationDays <= 6;
            if (dur === '7+') return p.durationDays >= 7;
            return false;
          });
          if (!match) return false;
        }

        // Keyword
        if (keyword) {
          const text = `${p.title} ${p.destination} ${p.route} ${p.overview}`.toLowerCase();
          if (!text.includes(keyword)) return false;
        }

        return true;
      });

      // Sorting
      const sortVal = sortSelect ? sortSelect.value : 'popular';
      filtered.sort((a, b) => {
        if (sortVal === 'low') return a.priceDiscounted - b.priceDiscounted;
        if (sortVal === 'high') return b.priceDiscounted - a.priceDiscounted;
        if (sortVal === 'duration') return a.durationDays - b.durationDays;
        if (sortVal === 'rating') return b.rating - a.rating;
        return 0;
      });

      // Update Result Count
      if (resultCount) {
        resultCount.textContent = `${filtered.length} holiday package${filtered.length === 1 ? '' : 's'} found`;
      }

      // Render Active Filter Chips
      if (activeFilterChips) {
        let chipsHTML = [];
        selectedDests.forEach(d => chipsHTML.push(`<span class="chip">${d} <button onclick="uncheckFilter('dest','${d}')">✕</button></span>`));
        selectedThemes.forEach(t => chipsHTML.push(`<span class="chip">${t} <button onclick="uncheckFilter('theme','${t}')">✕</button></span>`));
        if (maxPrice < 150000) chipsHTML.push(`<span class="chip">Under ₹${maxPrice.toLocaleString('en-IN')} <button onclick="resetPrice()">✕</button></span>`);
        if (keyword) chipsHTML.push(`<span class="chip">"${keyword}" <button onclick="clearKeyword()">✕</button></span>`);

        if (chipsHTML.length) {
          chipsHTML.push(`<button class="btn-clear-all" onclick="resetAllFilters()">Clear All</button>`);
          activeFilterChips.innerHTML = chipsHTML.join('');
        } else {
          activeFilterChips.innerHTML = '';
        }
      }

      // Render Grid or Empty State
      if (!filtered.length) {
        mainPkgGrid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--white);border-radius:var(--radius-m);border:1px solid var(--line);">
            <div style="font-size:42px;margin-bottom:12px;">🔍</div>
            <h3 style="font-size:20px;margin-bottom:8px;">No packages match your search</h3>
            <p style="color:var(--text-mute);margin-bottom:20px;">Try adjusting your price range, destinations or travel filters.</p>
            <button class="btn-solid" onclick="resetAllFilters()">Reset All Filters</button>
          </div>
        `;
      } else {
        mainPkgGrid.innerHTML = filtered.map(createPackageCardHTML).join('');
      }
    }

    // Helper filter functions exposed globally for chip button clicks
    window.uncheckFilter = function(filterType, val) {
      document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(cb => {
        if (cb.value.toLowerCase() === val.toLowerCase()) cb.checked = false;
      });
      filterAndRenderPackages();
    };
    window.resetPrice = function() {
      if (priceRangeInput) {
        priceRangeInput.value = 150000;
        if (priceRangeLabel) priceRangeLabel.textContent = '₹1,50,000';
      }
      filterAndRenderPackages();
    };
    window.clearKeyword = function() {
      if (pkgKeywordInput) pkgKeywordInput.value = '';
      filterAndRenderPackages();
    };
    window.resetAllFilters = function() {
      document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
      if (priceRangeInput) {
        priceRangeInput.value = 150000;
        if (priceRangeLabel) priceRangeLabel.textContent = '₹1,50,000';
      }
      if (pkgKeywordInput) pkgKeywordInput.value = '';
      filterAndRenderPackages();
    };

    // Event Listeners for filter inputs
    document.querySelectorAll('[data-filter]').forEach(inp => {
      inp.addEventListener('change', filterAndRenderPackages);
    });
    if (priceRangeInput) {
      priceRangeInput.addEventListener('input', () => {
        if (priceRangeLabel) priceRangeLabel.textContent = `₹${parseInt(priceRangeInput.value, 10).toLocaleString('en-IN')}`;
        filterAndRenderPackages();
      });
    }
    if (pkgKeywordInput) pkgKeywordInput.addEventListener('input', filterAndRenderPackages);
    if (sortSelect) sortSelect.addEventListener('change', filterAndRenderPackages);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Initial render
    filterAndRenderPackages();
  }

  /* ---------------------------------------------------------
     7. PACKAGE DETAILS PAGE LOGIC (package-details.html)
     --------------------------------------------------------- */
  const pdTitle = document.getElementById('pdTitle');
  if (pdTitle && typeof PACKAGES_DATA !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id') || 'kerala-escape';
    const pkg = PACKAGES_DATA.find(p => p.id === targetId) || PACKAGES_DATA[0];

    // Populate Page Header & Metadata
    document.title = `${pkg.title} — RuleMyHoliday`;
    pdTitle.textContent = pkg.title;

    const pdMeta = document.getElementById('pdMeta');
    if (pdMeta) {
      pdMeta.innerHTML = `
        <span>★ ${pkg.rating} (${pkg.reviewsCount} reviews)</span> · 
        <span>📍 ${pkg.route}</span> · 
        <span>⏱ ${pkg.durationNights} Nights / ${pkg.durationDays} Days</span> · 
        <span style="background:var(--sunset);color:#fff;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700;">${pkg.tourType}</span>
      `;
    }

    // Wishlist & Share buttons on details header
    const pdWishBtn = document.getElementById('pdWishBtn');
    if (pdWishBtn) {
      const isSaved = Store.isWishlisted(pkg.id);
      pdWishBtn.textContent = isSaved ? '❤️ Saved in Wishlist' : '♡ Save Wishlist';
      pdWishBtn.addEventListener('click', () => {
        const added = Store.toggleWishlist(pkg.id);
        pdWishBtn.textContent = added ? '❤️ Saved in Wishlist' : '♡ Save Wishlist';
        window.showToast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      });
    }
    const pdShareBtn = document.getElementById('pdShareBtn');
    if (pdShareBtn) {
      pdShareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        window.showToast('Link copied to clipboard! 📋');
      });
    }

    // Photo Gallery
    const pdGallery = document.getElementById('pdGallery');
    if (pdGallery) {
      pdGallery.innerHTML = pkg.photos.map((url, i) => `
        <div class="${i === 0 ? 'g1' : ''}">
          <img src="${url}" alt="${pkg.title} photo ${i+1}" onclick="window.open('${url}','_blank')">
        </div>
      `).join('');
    }

    // Overview & Quick Facts
    const pdOverviewText = document.getElementById('pdOverviewText');
    if (pdOverviewText) pdOverviewText.textContent = pkg.overview;

    const pdQuickFacts = document.getElementById('pdQuickFacts');
    if (pdQuickFacts) {
      pdQuickFacts.innerHTML = `
        <li><strong>Duration:</strong> ${pkg.durationNights} Nights / ${pkg.durationDays} Days</li>
        <li><strong>Starting Location:</strong> ${pkg.startingCity}</li>
        <li><strong>Ending Location:</strong> ${pkg.endingCity}</li>
        <li><strong>Best Time to Visit:</strong> ${pkg.bestTime}</li>
        <li><strong>Hotel Category:</strong> ${pkg.starCategory}★ Deluxe</li>
        <li><strong>Tour Type:</strong> ${pkg.tourType}</li>
      `;
    }

    // Itinerary Accordion
    const pdItineraryList = document.getElementById('pdItineraryList');
    if (pdItineraryList) {
      pdItineraryList.innerHTML = pkg.itinerary.map((day, i) => `
        <details class="itin-day" ${i === 0 ? 'open' : ''}>
          <summary><span class="num">${day.day}</span> ${day.title}</summary>
          <div class="idbody">
            <ul>
              ${day.details.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </details>
      `).join('');
    }

    // Hotels List
    const pdHotelsList = document.getElementById('pdHotelsList');
    if (pdHotelsList && pkg.hotels) {
      pdHotelsList.innerHTML = pkg.hotels.map(h => `
        <article class="pkg-card">
          <div class="pkg-photo"><img src="${h.photo}" alt="${h.name}"></div>
          <div class="pkg-body">
            <h3 style="font-size:15.5px;">${h.name}</h3>
            <div class="pkg-duration">${h.location} · ${h.category}</div>
            <p style="font-size:12.5px;color:var(--text-mute);margin-top:4px;">${h.details}</p>
          </div>
        </article>
      `).join('');
    }

    // Inclusions & Exclusions
    const pdInclusionsList = document.getElementById('pdInclusionsList');
    if (pdInclusionsList) pdInclusionsList.innerHTML = pkg.inclusions.map(inc => `<li>${inc}</li>`).join('');

    const pdExclusionsList = document.getElementById('pdExclusionsList');
    if (pdExclusionsList) pdExclusionsList.innerHTML = pkg.exclusions.map(exc => `<li>${exc}</li>`).join('');

    // Reviews
    const pdReviewsList = document.getElementById('pdReviewsList');
    if (pdReviewsList && pkg.reviews) {
      pdReviewsList.innerHTML = pkg.reviews.map(r => `
        <div class="testi-card" style="box-shadow:none;border:1px solid var(--line);">
          <div class="testi-top">
            <div class="avatar" style="width:42px;height:42px;border-radius:50%;background:var(--sunset);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">${r.name[0]}</div>
            <div>
              <div class="testi-name">${r.name}</div>
              <div class="testi-place">${r.date}</div>
            </div>
          </div>
          <div class="stars">${'★'.repeat(r.stars)}</div>
          <p class="quote">${r.text}</p>
        </div>
      `).join('');
    }

    // FAQs
    const pdFaqsList = document.getElementById('pdFaqsList');
    if (pdFaqsList && pkg.faqs) {
      pdFaqsList.innerHTML = pkg.faqs.map(faq => `
        <details class="itin-day">
          <summary><span class="num">?</span> ${faq.q}</summary>
          <div class="idbody">${faq.a}</div>
        </details>
      `).join('');
    }

    // Details Tabs Switching
    const pdTabs = document.querySelectorAll('#pdTabs button');
    pdTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        pdTabs.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    /* --- Interactive Booking Calculator --- */
    let travelersCount = 2;
    let appliedDiscount = 0;
    let customAddonPrice = 0;

    const calcBasePrice = document.getElementById('calcBasePrice');
    const calcDate = document.getElementById('calcDate');
    const stepMinus = document.getElementById('stepMinus');
    const stepPlus = document.getElementById('stepPlus');
    const stepVal = document.getElementById('stepVal');
    const calcRoom = document.getElementById('calcRoom');
    const calcCoupon = document.getElementById('calcCoupon');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponMsg = document.getElementById('couponMsg');
    const calcCount = document.getElementById('calcCount');
    const calcSubtotal = document.getElementById('calcSubtotal');
    const calcTaxes = document.getElementById('calcTaxes');
    const discountRow = document.getElementById('discountRow');
    const calcDiscount = document.getElementById('calcDiscount');
    const calcTotal = document.getElementById('calcTotal');
    const mobilePrice = document.getElementById('mobilePrice');

    if (calcDate) {
      const today = new Date().toISOString().split('T')[0];
      calcDate.min = today;
      calcDate.value = today;
    }

    function calculateTotalCost() {
      if (calcBasePrice) calcBasePrice.textContent = `₹${pkg.priceDiscounted.toLocaleString('en-IN')}`;
      if (mobilePrice) mobilePrice.textContent = `₹${pkg.priceDiscounted.toLocaleString('en-IN')}`;

      let perPersonPrice = pkg.priceDiscounted;
      if (calcRoom) {
        if (calcRoom.value === 'single') perPersonPrice += 4000;
        if (calcRoom.value === 'triple') perPersonPrice -= 2000;
      }

      const subtotal = (perPersonPrice * travelersCount) + customAddonPrice;
      const taxes = Math.round(subtotal * 0.05); // 5% GST & fees
      const grandTotal = Math.max(0, subtotal + taxes - appliedDiscount);

      if (stepVal) stepVal.textContent = travelersCount;
      if (calcCount) calcCount.textContent = travelersCount;
      if (calcSubtotal) calcSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      if (calcTaxes) calcTaxes.textContent = `₹${taxes.toLocaleString('en-IN')}`;
      if (calcTotal) calcTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

      const bookModalTotalPayable = document.getElementById('bookModalTotalPayable');
      if (bookModalTotalPayable) bookModalTotalPayable.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

      return grandTotal;
    }

    if (stepMinus) {
      stepMinus.addEventListener('click', () => {
        if (travelersCount > 1) { travelersCount--; calculateTotalCost(); }
      });
    }
    if (stepPlus) {
      stepPlus.addEventListener('click', () => {
        travelersCount++; calculateTotalCost();
      });
    }
    if (calcRoom) calcRoom.addEventListener('change', calculateTotalCost);

    // Apply Coupon Code
    if (applyCouponBtn && calcCoupon && typeof COUPONS_DATA !== 'undefined') {
      applyCouponBtn.addEventListener('click', () => {
        const code = calcCoupon.value.trim().toUpperCase();
        if (COUPONS_DATA[code]) {
          const coupon = COUPONS_DATA[code];
          if (coupon.discountPercent) {
            appliedDiscount = Math.round((pkg.priceDiscounted * travelersCount) * (coupon.discountPercent / 100));
          } else if (coupon.discountFlat) {
            appliedDiscount = coupon.discountFlat;
          }
          if (discountRow) discountRow.style.display = 'flex';
          if (calcDiscount) calcDiscount.textContent = `− ₹${appliedDiscount.toLocaleString('en-IN')}`;
          if (couponMsg) {
            couponMsg.className = 'coupon-msg success';
            couponMsg.textContent = `✓ Coupon ${code} applied: ${coupon.description}`;
          }
          window.showToast(`Coupon ${code} applied successfully! 🎉`);
        } else {
          appliedDiscount = 0;
          if (discountRow) discountRow.style.display = 'none';
          if (couponMsg) {
            couponMsg.className = 'coupon-msg error';
            couponMsg.textContent = `✕ Invalid coupon code. Try RULE20 or EARLYBIRD`;
          }
        }
        calculateTotalCost();
      });
    }

    // Check if auto-apply coupon passed in URL
    const urlCoupon = urlParams.get('coupon');
    if (urlCoupon && calcCoupon) {
      calcCoupon.value = urlCoupon;
      if (applyCouponBtn) applyCouponBtn.click();
    }

    // Book Modal Handlers
    const bookModal = document.getElementById('bookModal');
    const triggerBookModal = document.getElementById('triggerBookModal');
    const mobileBookBtn = document.getElementById('mobileBookBtn');
    const bookingConfirmForm = document.getElementById('bookingConfirmForm');

    function openBookingModal() {
      const bookModalSubtitle = document.getElementById('bookModalSubtitle');
      if (bookModalSubtitle) {
        bookModalSubtitle.textContent = `${pkg.title} — ${travelersCount} Traveler${travelersCount > 1 ? 's' : ''} (${calcDate.value || 'Today'})`;
      }
      calculateTotalCost();
      if (bookModal) bookModal.classList.add('open');
    }

    if (triggerBookModal) triggerBookModal.addEventListener('click', openBookingModal);
    if (mobileBookBtn) mobileBookBtn.addEventListener('click', openBookingModal);

    // Auto open book modal if ?book=true passed in URL
    if (urlParams.get('book') === 'true') {
      setTimeout(openBookingModal, 300);
    }

    // Complete Booking Form Submit
    if (bookingConfirmForm) {
      bookingConfirmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('bookFullName').value;
        const email = document.getElementById('bookEmail').value;
        const phone = document.getElementById('bookPhone').value;
        const totalPaid = calculateTotalCost();
        const bookingId = `RMH-${Math.floor(10000 + Math.random() * 90000)}`;

        const newBooking = {
          bookingId: bookingId,
          packageId: pkg.id,
          title: pkg.title,
          date: calcDate ? calcDate.value : '2026-10-01',
          travelers: travelersCount,
          roomType: calcRoom ? calcRoom.options[calcRoom.selectedIndex].text : 'Double Sharing',
          totalPaid: totalPaid,
          status: "Confirmed",
          primaryName: fullName,
          email: email,
          phone: phone,
          createdAt: new Date().toISOString().split('T')[0]
        };

        Store.addBooking(newBooking);
        if (bookModal) bookModal.classList.remove('open');
        window.showToast(`Trip booked! Reference ID: ${bookingId} 🎉`);

        // Automatically show My Bookings modal
        setTimeout(() => {
          renderBookingsModal();
          if (bookingsModal) bookingsModal.classList.add('open');
        }, 500);
      });
    }

    // Customize Modal Handlers
    const customModal = document.getElementById('customModal');
    const triggerCustomModal = document.getElementById('triggerCustomModal');
    const customForm = document.getElementById('customForm');

    if (triggerCustomModal && customModal) {
      triggerCustomModal.addEventListener('click', () => customModal.classList.add('open'));
    }

    if (customForm) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const hotelAddon = parseInt(document.getElementById('custHotel').value, 10);
        const nightsAddon = parseInt(document.getElementById('custNights').value, 10) * 4500;
        const candleAddon = document.getElementById('custCandle').checked ? 2500 : 0;
        const cabAddon = document.getElementById('custCab').checked ? 4000 : 0;

        customAddonPrice = hotelAddon + nightsAddon + candleAddon + cabAddon;
        calculateTotalCost();
        if (customModal) customModal.classList.remove('open');
        window.showToast("Itinerary updated with custom options! ✨");
      });
    }

    // Initial total calculation
    calculateTotalCost();
  }

  /* ---------------------------------------------------------
     8. ENHANCED AI CHATBOT — "Rumi"
     --------------------------------------------------------- */
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggest = document.getElementById('chatSuggest');

  if (chatFab && chatPanel) {
    chatFab.addEventListener('click', () => chatPanel.classList.toggle('open'));
    if (chatClose) chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

    function botReply(htmlContent) {
      const div = document.createElement('div');
      div.className = 'msg bot';
      div.innerHTML = htmlContent;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function userMsg(text) {
      const div = document.createElement('div');
      div.className = 'msg user';
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function processBotResponse(query) {
      const q = query.toLowerCase();

      // Search dataset for matching packages
      if (typeof PACKAGES_DATA !== 'undefined') {
        let matches = PACKAGES_DATA.filter(p =>
          p.destination.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.theme.toLowerCase().includes(q) ||
          (q.includes('under') && p.priceDiscounted <= 40000)
        );

        if (q.includes('honeymoon')) {
          matches = PACKAGES_DATA.filter(p => p.theme === 'honeymoon');
        } else if (q.includes('kerala')) {
          matches = PACKAGES_DATA.filter(p => p.destination.toLowerCase() === 'kerala');
        } else if (q.includes('dubai')) {
          matches = PACKAGES_DATA.filter(p => p.destination.toLowerCase() === 'dubai');
        } else if (q.includes('budget') || q.includes('cheap')) {
          matches = PACKAGES_DATA.filter(p => p.priceDiscounted <= 25000);
        }

        if (matches.length > 0) {
          const topMatch = matches[0];
          return `
            Here's a great option matching your request:
            <div class="chat-pkg-card">
              <h5>${topMatch.title}</h5>
              <p>${topMatch.durationNights}N/${topMatch.durationDays}D · ₹${topMatch.priceDiscounted.toLocaleString('en-IN')} per person</p>
              <a href="package-details.html?id=${topMatch.id}">View Package Details →</a>
            </div>
            Want to see more options or customize this trip?
          `;
        }
      }

      if (q.includes('included') || q.includes('flight')) {
        return "Our packages include 4★/5★ hotel stays, daily breakfast, airport transfers, and guided sightseeing. International & domestic flights can be added upon request!";
      }

      return "I can help with that! Tell me your target budget or travel month, and I'll find the best package or create a custom quote for you.";
    }

    function handleSend(text) {
      if (!text || !text.trim()) return;
      userMsg(text);
      if (chatInput) chatInput.value = '';
      setTimeout(() => {
        const reply = processBotResponse(text);
        botReply(reply);
      }, 400);
    }

    if (chatSend && chatInput) {
      chatSend.addEventListener('click', () => handleSend(chatInput.value));
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(chatInput.value);
      });
    }

    if (chatSuggest) {
      chatSuggest.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => handleSend(btn.textContent));
      });
    }
  }

});
