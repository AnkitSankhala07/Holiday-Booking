// =========================================================
// RULEMYHOLIDAY — Supabase Backend & Local Database Engine
// =========================================================

const SUPABASE_CONFIG = {
  url: localStorage.getItem('rmh_supabase_url') || '',
  anonKey: localStorage.getItem('rmh_supabase_key') || ''
};

let supabaseClient = null;

// Initialize Live Supabase Client if credentials exist
function initSupabase() {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url.startsWith('http')) {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('⚡ Live Supabase Client connected successfully!');
      }
    } catch (err) {
      console.warn('Live Supabase connection error:', err);
    }
  }
}

initSupabase();

/* ---------------------------------------------------------
   LOCAL MOCK BACKEND ENGINE (Runs seamlessly without API Keys)
   --------------------------------------------------------- */
const LocalDb = {
  getUsers: function() {
    try { return JSON.parse(localStorage.getItem('rmh_db_users')) || []; } catch(e) { return []; }
  },
  saveUsers: function(users) {
    localStorage.setItem('rmh_db_users', JSON.stringify(users));
  },
  getCurrentSession: function() {
    try { return JSON.parse(localStorage.getItem('rmh_db_session')) || null; } catch(e) { return null; }
  },
  setCurrentSession: function(user) {
    if (user) {
      localStorage.setItem('rmh_db_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('rmh_db_session');
    }
    if (SupabaseService.authListeners.length) {
      SupabaseService.authListeners.forEach(cb => cb(user ? 'SIGNED_IN' : 'SIGNED_OUT', user));
    }
  },
  getEnquiries: function() {
    try { return JSON.parse(localStorage.getItem('rmh_db_enquiries')) || []; } catch(e) { return []; }
  },
  saveEnquiry: function(enquiry) {
    const list = this.getEnquiries();
    list.unshift({ ...enquiry, id: 'enq_' + Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('rmh_db_enquiries', JSON.stringify(list));
  }
};

/* ---------------------------------------------------------
   SUPABASE SERVICE API WRAPPER
   --------------------------------------------------------- */
const SupabaseService = {
  authListeners: [],

  saveCredentials: function(url, key) {
    if (url && key) {
      localStorage.setItem('rmh_supabase_url', url.trim());
      localStorage.setItem('rmh_supabase_key', key.trim());
      SUPABASE_CONFIG.url = url.trim();
      SUPABASE_CONFIG.anonKey = key.trim();
      initSupabase();
      return true;
    }
    return false;
  },

  isConfigured: function() {
    return supabaseClient !== null;
  },

  /* ---------------------------------------------------------
     AUTHENTICATION METHODS
     --------------------------------------------------------- */
  signUp: async function(email, password, fullName) {
    // 1. Live Supabase integration
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: { data: { full_name: fullName || '' } }
        });
        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
      } catch (err) {
        return { user: null, error: err.message };
      }
    }

    // 2. Local Database Engine Fallback
    const users = LocalDb.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { user: null, error: 'An account with this email already exists. Please login instead.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: email,
      name: fullName || email.split('@')[0],
      user_metadata: { full_name: fullName || '' },
      createdAt: new Date().toISOString()
    };
    users.push({ ...newUser, password: password });
    LocalDb.saveUsers(users);
    LocalDb.setCurrentSession(newUser);

    return { user: newUser, error: null };
  },

  signIn: async function(email, password) {
    // 1. Live Supabase integration
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
      } catch (err) {
        return { user: null, error: err.message };
      }
    }

    // 2. Local Database Engine Fallback
    const users = LocalDb.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { user: null, error: 'Invalid email or password. Please check your credentials.' };
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      user_metadata: { full_name: user.name }
    };
    LocalDb.setCurrentSession(sessionUser);

    return { user: sessionUser, error: null };
  },

  signOut: async function() {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    LocalDb.setCurrentSession(null);
  },

  getCurrentUser: async function() {
    if (supabaseClient) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) return user;
      } catch (e) {}
    }
    return LocalDb.getCurrentSession();
  },

  onAuthStateChange: function(callback) {
    this.authListeners.push(callback);

    if (supabaseClient) {
      return supabaseClient.auth.onAuthStateChange((event, session) => {
        const user = session ? session.user : null;
        callback(event, user);
      });
    } else {
      // Fire initial state
      const current = LocalDb.getCurrentSession();
      if (current) callback('INITIAL_SESSION', current);
    }
  },

  /* ---------------------------------------------------------
     DATABASE METHODS
     --------------------------------------------------------- */
  fetchPackages: async function() {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient.from('packages').select('*');
      if (error) throw error;
      return data.map(pkg => ({
        id: pkg.id,
        title: pkg.title,
        tagline: pkg.tagline,
        type: pkg.type,
        destination: pkg.destination,
        route: pkg.route,
        durationDays: pkg.duration_days,
        durationNights: pkg.duration_nights,
        theme: pkg.theme,
        tourType: pkg.tour_type,
        starCategory: pkg.star_category,
        rating: parseFloat(pkg.rating),
        reviewsCount: pkg.reviews_count,
        priceOriginal: parseFloat(pkg.price_original),
        priceDiscounted: parseFloat(pkg.price_discounted),
        badge: pkg.badge,
        startingCity: pkg.starting_city,
        endingCity: pkg.ending_city,
        bestTime: pkg.best_time,
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        photos: pkg.photos || [],
        overview: pkg.overview,
        itinerary: pkg.itinerary || [],
        hotels: pkg.hotels || [],
        reviews: pkg.reviews || [],
        faqs: pkg.faqs || []
      }));
    } catch (err) {
      return null;
    }
  },

  saveBooking: async function(bookingObj) {
    const user = await this.getCurrentUser();
    if (supabaseClient) {
      try {
        await supabaseClient.from('bookings').insert([{
          booking_code: bookingObj.bookingId,
          user_id: user ? user.id : null,
          package_id: bookingObj.packageId,
          package_title: bookingObj.title,
          travel_date: bookingObj.date,
          travelers: bookingObj.travelers,
          room_type: bookingObj.roomType,
          total_paid: bookingObj.totalPaid,
          customer_name: bookingObj.customerName || 'Traveler',
          customer_email: bookingObj.customerEmail || '',
          customer_phone: bookingObj.customerPhone || '',
          special_requests: bookingObj.specialRequests || '',
          status: 'Confirmed'
        }]);
      } catch (err) {}
    }
    return { success: true };
  },

  fetchUserBookings: async function() {
    const user = await this.getCurrentUser();
    if (supabaseClient && user) {
      try {
        const { data } = await supabaseClient.from('bookings').select('*').eq('user_id', user.id);
        if (data && data.length) {
          return data.map(b => ({
            bookingId: b.booking_code,
            packageId: b.package_id,
            title: b.package_title,
            date: b.travel_date,
            travelers: b.travelers,
            roomType: b.room_type,
            totalPaid: parseFloat(b.total_paid),
            status: b.status,
            createdAt: b.created_at
          }));
        }
      } catch (err) {}
    }
    return null;
  },

  toggleWishlistDb: async function(packageId) {
    const user = await this.getCurrentUser();
    if (supabaseClient && user) {
      try {
        const { data: existing } = await supabaseClient.from('wishlist').select('id').eq('user_id', user.id).eq('package_id', packageId).single();
        if (existing) {
          await supabaseClient.from('wishlist').delete().eq('id', existing.id);
          return false;
        } else {
          await supabaseClient.from('wishlist').insert([{ user_id: user.id, package_id: packageId }]);
          return true;
        }
      } catch (err) {}
    }
    return null;
  },

  fetchUserWishlist: async function() {
    const user = await this.getCurrentUser();
    if (supabaseClient && user) {
      try {
        const { data } = await supabaseClient.from('wishlist').select('package_id').eq('user_id', user.id);
        if (data) return data.map(item => item.package_id);
      } catch (err) {}
    }
    return null;
  },

  submitEnquiryDb: async function(enquiryObj) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('enquiries').insert([{
          name: enquiryObj.name,
          phone: enquiryObj.phone,
          destination_dates: enquiryObj.destinationDates || ''
        }]);
      } catch (err) {}
    }
    LocalDb.saveEnquiry(enquiryObj);
    return { success: true };
  },

  clearAllLocalData: function() {
    LocalDb.setCurrentSession(null);
    localStorage.removeItem('rmh_db_users');
    localStorage.removeItem('rmh_db_session');
    localStorage.removeItem('rmh_db_enquiries');
    localStorage.removeItem('rmh_bookings');
    localStorage.removeItem('rmh_wishlist');
    localStorage.removeItem('rmh_user');
    console.log('🧹 Local database data reset.');
  }
};

