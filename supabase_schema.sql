-- =========================================================
-- RULEMYHOLIDAY — Supabase Database Schema & Setup Script
-- =========================================================
-- Instructions: Copy and paste this script into your Supabase project's SQL Editor and click 'Run'.

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


-- 2. Trigger for Auto Profile Creation on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Create PACKAGES Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  type TEXT DEFAULT 'domestic',
  destination TEXT NOT NULL,
  route TEXT,
  duration_days INT DEFAULT 1,
  duration_nights INT DEFAULT 0,
  theme TEXT DEFAULT 'family',
  tour_type TEXT DEFAULT 'Private Tour',
  star_category INT DEFAULT 4,
  rating NUMERIC(3,2) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  price_original NUMERIC(10,2) NOT NULL,
  price_discounted NUMERIC(10,2) NOT NULL,
  badge TEXT,
  starting_city TEXT,
  ending_city TEXT,
  best_time TEXT,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  overview TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  hotels JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Packages
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages are viewable by everyone." ON public.packages
  FOR SELECT USING (true);


-- 4. Create BOOKINGS Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  package_id TEXT NOT NULL,
  package_title TEXT NOT NULL,
  travel_date DATE NOT NULL,
  travelers INT DEFAULT 2,
  room_type TEXT DEFAULT 'Double Sharing',
  total_paid NUMERIC(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);


-- 5. Create WISHLIST Table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  package_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, package_id)
);

-- Enable RLS on Wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);


-- 6. Create ENQUIRIES Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination_dates TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Enquiries
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view enquiries" ON public.enquiries
  FOR SELECT USING (auth.role() = 'authenticated');


-- =========================================================
-- SEED DATA: Insert Initial Holiday Packages
-- =========================================================

INSERT INTO public.packages (
  id, title, tagline, type, destination, route, duration_days, duration_nights, theme, tour_type, star_category, rating, reviews_count, price_original, price_discounted, badge, starting_city, ending_city, best_time, inclusions, exclusions, photos, overview, itinerary, hotels, reviews, faqs
) VALUES 
(
  'kerala-escape',
  'Amazing Kerala Escape',
  'Highlands, tea gardens & luxury backwater houseboats',
  'domestic',
  'Kerala',
  'Cochin → Munnar → Thekkady → Alleppey',
  5, 4,
  'family',
  'Private Tour',
  4, 4.7, 312,
  31499.00, 24999.00,
  '20% OFF',
  'Cochin', 'Cochin',
  'September – March',
  '["4 Nights Hotel & Houseboat stay", "Daily Breakfast & 2 Dinners", "All Airport & Intercity transfers", "Private AC Vehicle throughout", "Sightseeing as per itinerary", "English-speaking driver cum guide"]'::jsonb,
  '["Flights or Train tickets to/from Cochin", "Personal expenses & tips", "Travel insurance", "Entry fees to monuments not listed"]'::jsonb,
  '["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80", "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80", "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80", "https://images.unsplash.com/photo-1580889240911-b57b975a4a1d?w=600&q=80"]'::jsonb,
  'A gentle, well-paced route through Kerala highlands and backwaters — misty tea estates in Munnar, a wildlife safari in Thekkady, and a night aboard a private houseboat in Alleppey.',
  '[{"day": 1, "title": "Arrival in Cochin → Transfer to Munnar", "details": ["Airport or station pickup in Cochin", "Scenic drive past Cheeyappara waterfalls", "Overnight stay in Munnar"]}, {"day": 2, "title": "Munnar Sightseeing Tour", "details": ["Tea Museum & Mattupetty Dam", "Echo Point & Kundala Lake", "Overnight in Munnar"]}]'::jsonb,
  '[{"name": "Misty Hills Resort", "location": "Munnar", "category": "4★ Deluxe", "details": "Valley view room"}, {"name": "Premium Backwater Houseboat", "location": "Alleppey", "category": "Private Luxury Houseboat", "details": "1 AC bedroom, all meals included"}]'::jsonb,
  '[{"name": "Priya & Rohan S.", "date": "Traveled March 2026", "stars": 5, "text": "RuleMyHoliday made our Kerala trip so smooth! The houseboat night was magical."}]'::jsonb,
  '[{"q": "Is this package customizable?", "a": "Yes — click Customize Package to add extra nights or upgrade hotels."}]'::jsonb
),
(
  'kashmir-paradise',
  'Kashmir Paradise Tour',
  'Shikaras, snow peaks & fairytale valleys of Gulmarg & Pahalgam',
  'domestic',
  'Kashmir',
  'Srinagar → Gulmarg → Pahalgam → Srinagar',
  6, 5,
  'honeymoon',
  'Private Tour',
  4, 4.8, 198,
  27999.00, 22999.00,
  '15% OFF',
  'Srinagar', 'Srinagar',
  'Year-Round',
  '["5 Nights Stay (4N Hotel + 1N Luxury Houseboat)", "Daily Breakfast & Dinner", "Complimentary 1-hour Shikara ride on Dal Lake", "Private vehicle for transfers"]'::jsonb,
  '["Gondola cable car ticket in Gulmarg", "Pony rides & union vehicles in Pahalgam", "Personal expenses"]'::jsonb,
  '["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80", "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=600&q=80"]'::jsonb,
  'Experience heaven on earth — row through serene Dal Lake on a Shikara, ride the high-altitude Gondola in Gulmarg, and wander through pine forests along the Lidder river.',
  '[{"day": 1, "title": "Arrival in Srinagar & Shikara Ride", "details": ["Transfer to luxury Dal Lake houseboat", "Sunset Shikara ride", "Overnight on Houseboat"]}]'::jsonb,
  '[{"name": "Royal Heritage Houseboat", "location": "Dal Lake, Srinagar", "category": "Luxury Houseboat", "details": "Lake View Deluxe Room"}]'::jsonb,
  '[{"name": "Aakash K.", "date": "Traveled Feb 2026", "stars": 5, "text": "Snow in Gulmarg was breathtaking!"}]'::jsonb,
  '[{"q": "Is Gondola ticket included?", "a": "Gondola tickets can be pre-booked with this package on request."}]'::jsonb
),
(
  'bali-retreat',
  'Bali Romantic Retreat',
  'Tropical jungle villas, iconic rice terraces & sunset sea temples',
  'international',
  'Bali',
  'Denpasar → Ubud → Seminyak',
  6, 5,
  'honeymoon',
  'Private Tour',
  4, 4.9, 267,
  48999.00, 39999.00,
  '18% OFF',
  'Denpasar (DPS)', 'Denpasar (DPS)',
  'April – October',
  '["3 Nights Ubud Jungle Resort + 2 Nights Seminyak Beach Villa", "Daily Breakfast + 1 Floating Breakfast in Villa", "1 Romantic Candlelight Dinner", "Private AC Car for all tours"]'::jsonb,
  '["International Airfare", "Bali Visa on Arrival (~35 USD)", "Personal expenses"]'::jsonb,
  '["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80", "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80"]'::jsonb,
  'Immerse yourselves in Bali charm — lush green monkey forests in Ubud, sacred sea temples at Tanah Lot, swing over rice terraces, and relax in private pool villas.',
  '[{"day": 1, "title": "Arrival in Bali → Transfer to Ubud", "details": ["Warm flower welcome at airport", "Transfer to Ubud Jungle Resort"]}]'::jsonb,
  '[{"name": "Aksari Resort Ubud", "location": "Ubud", "category": "5★ Jungle Luxury", "details": "Suite with private jacuzzi"}]'::jsonb,
  '[{"name": "Sneha & Varun", "date": "Traveled Feb 2026", "stars": 5, "text": "Floating breakfast made our honeymoon unforgettable!"}]'::jsonb,
  '[{"q": "Is visa easy for Indian passport holders?", "a": "Yes, Bali provides easy Visa on Arrival (VoA)."}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
