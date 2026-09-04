// ===== RULEMYHOLIDAY prototype interactivity (front-end only demo) =====

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Hero search tabs ---- */
  const searchTabs = document.querySelectorAll('.search-tabs button');
  searchTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      searchTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ---- Hero / listing search submit -> go to packages page ---- */
  const heroSearchForm = document.getElementById('heroSearchBtn');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'packages.html';
    });
  }

  /* ---- Mobile nav ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#FAFAF7';
      navLinks.style.padding = '20px 24px';
      navLinks.style.borderBottom = '1px solid #DDE3DE';
    });
  }

  /* ---- Wishlist heart toggle ---- */
  document.querySelectorAll('.pkg-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.dataset.active === 'true';
      btn.dataset.active = (!active).toString();
      btn.textContent = !active ? '❤️' : '🤍';
    });
  });

  /* ---- Deal countdown timers ---- */
  document.querySelectorAll('.deal-timer').forEach(timer => {
    let total = 36 * 3600 + Math.floor(Math.random() * 5000); // demo countdown
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

  /* ---- Package listing: sort + filter (demo, client-side on visible cards) ---- */
  const sortSelect = document.querySelector('.sort-select');
  const pkgGrid = document.querySelector('[data-pkg-grid]');
  if (sortSelect && pkgGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(pkgGrid.children);
      const val = sortSelect.value;
      cards.sort((a, b) => {
        const pa = parseInt(a.dataset.price, 10), pb = parseInt(b.dataset.price, 10);
        const da = parseInt(a.dataset.duration, 10), db = parseInt(b.dataset.duration, 10);
        const ra = parseFloat(a.dataset.rating), rb = parseFloat(b.dataset.rating);
        if (val === 'low') return pa - pb;
        if (val === 'high') return pb - pa;
        if (val === 'duration') return da - db;
        if (val === 'rating') return rb - ra;
        return 0;
      });
      cards.forEach(c => pkgGrid.appendChild(c));
    });
  }

  const filterInputs = document.querySelectorAll('[data-filter]');
  if (filterInputs.length && pkgGrid) {
    filterInputs.forEach(inp => {
      inp.addEventListener('change', () => {
        const activeThemes = Array.from(document.querySelectorAll('[data-filter="theme"]:checked')).map(i => i.value);
        const cards = Array.from(pkgGrid.children);
        cards.forEach(c => {
          const show = activeThemes.length === 0 || activeThemes.includes(c.dataset.theme);
          c.style.display = show ? '' : 'none';
        });
        const count = cards.filter(c => c.style.display !== 'none').length;
        const rc = document.querySelector('.result-count');
        if (rc) rc.textContent = `${count} holiday packages found`;
      });
    });
  }

  /* ---- Package details: tabs ---- */
  const tabButtons = document.querySelectorAll('.tabs button');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  /* ---- Traveler / room stepper on booking card ---- */
  document.querySelectorAll('.stepper').forEach(step => {
    const minus = step.querySelector('.minus');
    const plus = step.querySelector('.plus');
    const val = step.querySelector('.val');
    if (!minus) return;
    minus.addEventListener('click', () => {
      let n = parseInt(val.textContent, 10);
      if (n > 1) val.textContent = n - 1;
    });
    plus.addEventListener('click', () => {
      let n = parseInt(val.textContent, 10);
      val.textContent = n + 1;
    });
  });

  /* ===================================================
     AI Chatbot — "Rumi" (scripted demo, front-end only)
     =================================================== */
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggest = document.getElementById('chatSuggest');

  if (chatFab) {
    chatFab.addEventListener('click', () => chatPanel.classList.toggle('open'));
    chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

    const replies = {
      default: "I can help with that. Our travel expert can confirm the latest availability and pricing — want me to note your enquiry so a specialist reaches out?",
      honeymoon: "For a honeymoon under ₹1 lakh, couples usually love our Kerala backwaters or Goa beach escapes — both come with candlelight dinners and private houseboat stays. Want me to show a few options?",
      kerala: "A 5-day Kerala trip typically covers Cochin, Munnar and Alleppey — hill views, tea gardens, and a backwater houseboat night. Shall I pull up matching packages?",
      december: "December is peak season for Goa, Kerala and Rajasthan — cool weather and festive vibes. Northeast India and Ladakh are best avoided this month due to snow closures. Want destination ideas for your dates?",
      compare: "Sure — open any two packages and tap 'Compare' on their cards, or tell me the two package names here and I'll lay out the differences in hotels, inclusions and price.",
      customize: "I can start a custom itinerary for you right now. First — is this trip for a couple, family, friends, or solo travel?"
    };

    function botReply(text) {
      const div = document.createElement('div');
      div.className = 'msg bot';
      div.textContent = text;
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
    function route(text) {
      const t = text.toLowerCase();
      if (t.includes('honeymoon')) return replies.honeymoon;
      if (t.includes('kerala')) return replies.kerala;
      if (t.includes('december')) return replies.december;
      if (t.includes('compare')) return replies.compare;
      if (t.includes('custom')) return replies.customize;
      return replies.default;
    }
    function send(text) {
      if (!text.trim()) return;
      userMsg(text);
      chatInput.value = '';
      setTimeout(() => botReply(route(text)), 500);
    }
    chatSend.addEventListener('click', () => send(chatInput.value));
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(chatInput.value); });
    chatSuggest.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => send(b.textContent));
    });
  }
});
