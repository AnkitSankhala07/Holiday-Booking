// =========================================================
// RULEMYHOLIDAY — Central Data Store & State Management
// =========================================================

const PACKAGES_DATA = [
  {
    id: "kerala-escape",
    title: "Amazing Kerala Escape",
    tagline: "Highlands, tea gardens & luxury backwater houseboats",
    type: "domestic",
    destination: "Kerala",
    route: "Cochin → Munnar → Thekkady → Alleppey",
    durationDays: 5,
    durationNights: 4,
    theme: "family",
    tourType: "Private Tour",
    starCategory: 4,
    rating: 4.7,
    reviewsCount: 312,
    priceOriginal: 31499,
    priceDiscounted: 24999,
    badge: "20% OFF",
    startingCity: "Cochin",
    endingCity: "Cochin",
    bestTime: "September – March",
    inclusions: [
      "4 Nights Hotel & Houseboat stay",
      "Daily Breakfast & 2 Dinners",
      "All Airport & Intercity transfers",
      "Private AC Vehicle throughout",
      "Sightseeing as per itinerary",
      "English-speaking driver cum guide"
    ],
    exclusions: [
      "Flights or Train tickets to/from Cochin",
      "Personal expenses & tips",
      "Travel insurance",
      "Entry fees to monuments not listed"
    ],
    photos: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80",
      "https://images.unsplash.com/photo-1580889240911-b57b975a4a1d?w=600&q=80"
    ],
    overview: "A gentle, well-paced route through Kerala's highlands and backwaters — misty tea estates in Munnar, a wildlife safari in Thekkady, and a night aboard a private houseboat in Alleppey. Comfortable for families, couples, and first-time visitors alike.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Cochin → Transfer to Munnar",
        details: ["Airport or station pickup in Cochin", "Scenic drive past Cheeyappara & Valara waterfalls", "Check-in at Munnar hill resort and evening at leisure", "Overnight stay in Munnar"]
      },
      {
        day: 2,
        title: "Munnar Sightseeing Tour",
        details: ["Visit Tea Museum & Mattupetty Dam", "Echo Point & Kundala Lake excursion", "Stroll through tea gardens at sunset", "Overnight stay in Munnar"]
      },
      {
        day: 3,
        title: "Munnar to Thekkady (Spice Plantation & Wildlife)",
        details: ["Drive through winding hill roads to Thekkady", "Afternoon Periyar Lake boat safari for wildlife watching", "Guided Spice Plantation Tour with aromatic cardamoms & pepper", "Overnight stay in Thekkady"]
      },
      {
        day: 4,
        title: "Thekkady to Alleppey (Overnight Houseboat Cruise)",
        details: ["Drive down to Alleppey backwater jetty", "Check-in aboard traditional Kerala Houseboat at 12:00 PM", "Cruise through paddy fields, coconut palms & backwater villages", "Traditional Keralite lunch, evening snacks & dinner served on board", "Overnight stay on Houseboat"]
      },
      {
        day: 5,
        title: "Disembark Alleppey → Cochin Airport Drop",
        details: ["Enjoy breakfast on the water as boat docks", "Transfer back to Cochin Airport/Railway Station", "Tour concludes with sweet memories"]
      }
    ],
    hotels: [
      {
        name: "Misty Hills Resort",
        location: "Munnar",
        category: "4★ Deluxe",
        details: "Valley view room, breakfast included",
        photo: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80"
      },
      {
        name: "Premium Backwater Houseboat",
        location: "Alleppey",
        category: "Private Luxury Houseboat",
        details: "1 AC bedroom, all meals included",
        photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80"
      }
    ],
    reviews: [
      {
        name: "Priya & Rohan S.",
        date: "Traveled March 2026",
        stars: 5,
        text: "RuleMyHoliday made our Kerala trip so smooth! The houseboat night was magical, and our driver was courteous throughout."
      },
      {
        name: "Arjun M.",
        date: "Traveled Jan 2026",
        stars: 5,
        text: "Well-paced itinerary for our kids. Tea estate resort in Munnar had spectacular morning views!"
      }
    ],
    faqs: [
      { q: "Is this package customizable?", a: "Yes — click 'Customize Package' to add extra nights, upgrade hotels or include flight bookings." },
      { q: "Are flights included?", a: "Flights are optional. Our travel expert can assist you with booking flights at the lowest fares." }
    ]
  },
  {
    id: "kashmir-paradise",
    title: "Kashmir Paradise Tour",
    tagline: "Shikaras, snow peaks & fairytale valleys of Gulmarg & Pahalgam",
    type: "domestic",
    destination: "Kashmir",
    route: "Srinagar → Gulmarg → Pahalgam → Srinagar",
    durationDays: 6,
    durationNights: 5,
    theme: "honeymoon",
    tourType: "Private Tour",
    starCategory: 4,
    rating: 4.8,
    reviewsCount: 198,
    priceOriginal: 27999,
    priceDiscounted: 22999,
    badge: "15% OFF",
    startingCity: "Srinagar",
    endingCity: "Srinagar",
    bestTime: "Year-Round (April-Oct for green, Dec-Feb for snow)",
    inclusions: [
      "5 Nights Stay (4N Hotel + 1N Luxury Houseboat)",
      "Daily Breakfast & Dinner",
      "Complimentary 1-hour Shikara ride on Dal Lake",
      "Private Non-AC vehicle for all transfers",
      "Mughal Gardens entry ticket"
    ],
    exclusions: [
      "Gondola cable car ticket in Gulmarg",
      "Pony rides & union vehicles in Pahalgam",
      "Personal expenses and tips"
    ],
    photos: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80",
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=600&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80"
    ],
    overview: "Experience the heaven on earth — row through serene Dal Lake on a Shikara, ride the high-altitude Gondola in Gulmarg, and wander through pine forests along the Lidder river in Pahalgam.",
    itinerary: [
      { day: 1, title: "Arrival in Srinagar & Shikara Ride", details: ["Airport pickup and transfer to luxury Dal Lake houseboat", "Sunset Shikara ride across famous floating markets", "Overnight on Houseboat"] },
      { day: 2, title: "Srinagar to Gulmarg Day Trip / Stay", details: ["Drive to Gulmarg (Meadow of Flowers)", "Ride Phase 1 & 2 Gondola up to Apharwat Peak", "Overnight stay in Gulmarg/Srinagar"] },
      { day: 3, title: "Gulmarg to Pahalgam (Valley of Shepherds)", details: ["Drive to Pahalgam along saffron fields & Avantipur ruins", "Check in at riverside resort", "Overnight stay in Pahalgam"] },
      { day: 4, title: "Pahalgam Exploration (Aru & Betaab Valleys)", details: ["Visit famous Betaab Valley & Aru Valley", "Optional pony ride to Baisaran Meadow (Mini Switzerland)", "Overnight stay in Pahalgam"] },
      { day: 5, title: "Pahalgam to Srinagar Mughal Gardens", details: ["Drive back to Srinagar", "Tour Nishat Bagh, Shalimar Bagh & Chashme Shahi", "Overnight stay in Srinagar hotel"] },
      { day: 6, title: "Srinagar Airport Drop", details: ["Breakfast and departure transfer to Srinagar Airport"] }
    ],
    hotels: [
      { name: "Royal Heritage Houseboat", location: "Dal Lake, Srinagar", category: "Luxury Houseboat", details: "Lake View Deluxe Room", photo: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80" },
      { name: "Pine & Peak Resort", location: "Pahalgam", category: "4★ Resort", details: "River view room", photo: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=500&q=80" }
    ],
    reviews: [
      { name: "Aakash K.", date: "Traveled Feb 2026", stars: 5, text: "Snow in Gulmarg was breathtaking! Houseboat hospitality in Srinagar was unmatched." }
    ],
    faqs: [
      { q: "Is Gondola ticket included?", a: "Gondola tickets can be pre-booked with this package on request." }
    ]
  },
  {
    id: "goa-getaway",
    title: "Goa Beach Getaway",
    tagline: "Sun, sand, water sports & heritage Latin quarters",
    type: "domestic",
    destination: "Goa",
    route: "North Goa → South Goa",
    durationDays: 4,
    durationNights: 3,
    theme: "group",
    tourType: "Group Tour",
    starCategory: 3,
    rating: 4.5,
    reviewsCount: 521,
    priceOriginal: 13299,
    priceDiscounted: 9999,
    badge: "25% OFF",
    startingCity: "Goa Airport / Thivim",
    endingCity: "Goa Airport",
    bestTime: "October – April",
    inclusions: [
      "3 Nights Hotel stay near Baga/Calangute",
      "Daily Buffet Breakfast",
      "1 Day North Goa Sightseeing Tour",
      "1 Day South Goa Tour & Mandovi Sunset Cruise",
      "Airport / Railway transfers"
    ],
    exclusions: [
      "Water sports activities fees",
      "Nightlife entry tickets & drinks",
      "Personal expenses"
    ],
    photos: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"
    ],
    overview: "Unwind on sunny palm-fringed beaches, try exhilarating water sports at Calangute, marvel at Old Goa's Portuguese churches, and enjoy lively beach shacks.",
    itinerary: [
      { day: 1, title: "Arrival in Goa & Beach Relax", details: ["Pickup and check-in at resort near Baga", "Free evening at Baga beach shacks", "Overnight stay"] },
      { day: 2, title: "North Goa Beaches & Fort Aguada", details: ["Visit Fort Aguada overlooking Arabian sea", "Calangute, Anjuna & Vagator beaches", "Overnight stay"] },
      { day: 3, title: "South Goa Heritage & Mandovi River Cruise", details: ["Basilica of Bom Jesus & Se Cathedral in Old Goa", "Mangueshi Temple & Panjim Fontainhas walk", "Evening Mandovi River Sunset Cruise with DJ & folk dance", "Overnight stay"] },
      { day: 4, title: "Departure", details: ["Breakfast and transfer to airport/station"] }
    ],
    hotels: [
      { name: "La Laguna Resort", location: "Calangute, Goa", category: "3★ Resort with Pool", details: "Pool view room", photo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80" }
    ],
    reviews: [
      { name: "Karan & Gang", date: "Traveled Feb 2026", stars: 5, text: "Awesome budget trip for friends! The river cruise was super fun." }
    ],
    faqs: [
      { q: "Can we rent scooters?", a: "Yes, scooters and self-drive cars are easily available near the hotel." }
    ]
  },
  {
    id: "bali-retreat",
    title: "Bali Romantic Retreat",
    tagline: "Tropical jungle villas, iconic rice terraces & sunset sea temples",
    type: "international",
    destination: "Bali",
    route: "Denpasar → Ubud → Seminyak",
    durationDays: 6,
    durationNights: 5,
    theme: "honeymoon",
    tourType: "Private Tour",
    starCategory: 4,
    rating: 4.9,
    reviewsCount: 267,
    priceOriginal: 48999,
    priceDiscounted: 39999,
    badge: "18% OFF",
    startingCity: "Denpasar (DPS)",
    endingCity: "Denpasar (DPS)",
    bestTime: "April – October",
    inclusions: [
      "3 Nights Ubud Jungle Resort + 2 Nights Seminyak Beach Villa",
      "Daily Breakfast + 1 Floating Breakfast in Villa",
      "1 Romantic Candlelight Dinner",
      "Full day Kintamani Volcano & Tegalalang Rice Terrace tour",
      "Water sports at Tanjung Benoa (Banana Boat & Jet Ski)",
      "Private AC Car for all tours & transfers"
    ],
    exclusions: [
      "International Airfare",
      "Bali Visa on Arrival (~35 USD)",
      "Personal expenses & tips"
    ],
    photos: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80"
    ],
    overview: "Immerse yourselves in Bali's ethereal charm — lush green monkey forests in Ubud, sacred sea temples at Tanah Lot, swing over rice terraces, and relax in private pool villas.",
    itinerary: [
      { day: 1, title: "Arrival in Bali → Transfer to Ubud", details: ["Warm flower welcome at Ngurah Rai Airport", "Private transfer to Ubud Jungle Resort", "Overnight in Ubud"] },
      { day: 2, title: "Ubud Tour: Rice Terraces, Bali Swing & Waterfall", details: ["Visit Tegalalang Rice Terrace & famous Bali Giant Swing", "Tegenungan Waterfall photoshoot", "Coffee plantation tour & Luwak tasting", "Overnight in Ubud"] },
      { day: 3, title: "Kintamani Volcano & Tirta Empul Temple", details: ["View Mount Batur volcano crater", "Visit Tirta Empul Holy Water Temple", "Evening traditional Kecak Fire Dance performance", "Overnight in Ubud"] },
      { day: 4, title: "Ubud to Seminyak Beach Villa & Water Sports", details: ["Transfer to Seminyak luxury pool villa", "Banana boat ride & Parasailing at Tanjung Benoa", "Sunset at Tanah Lot sea temple", "Overnight in Seminyak Pool Villa"] },
      { day: 5, title: "Nusa Penida Island Day Tour", details: ["Fast boat to Nusa Penida Island", "Visit Kelingking T-Rex Beach, Angel's Billabong & Broken Beach", "Snorkeling at Crystal Bay", "Overnight in Seminyak"] },
      { day: 6, title: "Departure", details: ["Floating breakfast in private pool", "Souvenir shopping at Kuta Art Market", "Airport drop"] }
    ],
    hotels: [
      { name: "Aksari Resort Ubud", location: "Ubud", category: "5★ Jungle Luxury", details: "Suite with private jacuzzi", photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80" },
      { name: "Seminyak Beach Pool Villa", location: "Seminyak", category: "Private Pool Villa", details: "1 BR Private Villa", photo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80" }
    ],
    reviews: [
      { name: "Sneha & Varun", date: "Traveled Feb 2026", stars: 5, text: "The Nusa Penida tour and floating breakfast made our honeymoon unforgettable!" }
    ],
    faqs: [
      { q: "Is visa easy for Indian passport holders?", a: "Yes, Bali provides easy Visa on Arrival (VoA) or e-Visa before travel." }
    ]
  },
  {
    id: "dubai-lights",
    title: "Dubai City Lights & Desert Safari",
    tagline: "Futuristic skyscrapers, desert dune bashing & luxury shopping",
    type: "international",
    destination: "Dubai",
    route: "Dubai City → Abu Dhabi → Desert Camp",
    durationDays: 5,
    durationNights: 4,
    theme: "family",
    tourType: "Private Tour",
    starCategory: 5,
    rating: 4.6,
    reviewsCount: 403,
    priceOriginal: 39999,
    priceDiscounted: 34999,
    badge: "12% OFF",
    startingCity: "Dubai International (DXB)",
    endingCity: "Dubai International (DXB)",
    bestTime: "November – March",
    inclusions: [
      "4 Nights 4★/5★ City Hotel stay",
      "Daily Buffet Breakfast",
      "Half-day Dubai City Tour with Dubai Frame entry",
      "Burj Khalifa 124th Floor Observation Deck Ticket",
      "Premium Desert Safari with 4x4 Dune Bashing, BBQ & Belly Dance",
      "Dhow Cruise Dinner at Dubai Marina",
      "UAE Tourist Visa assistance & Single Entry Fee"
    ],
    exclusions: [
      "International flights",
      "Tourism Dirham fee (~15 AED/night)",
      "Personal shopping & meals not specified"
    ],
    photos: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80"
    ],
    overview: "Marvel at Dubai's world records — stand atop Burj Khalifa, speed through golden desert dunes in a 4x4 Land Cruiser, dine under marina lights, and explore Abu Dhabi's Grand Mosque.",
    itinerary: [
      { day: 1, title: "Arrival in Dubai & Marina Dhow Cruise", details: ["Airport pickup in luxury van", "Check in at hotel", "Evening Dubai Marina Dhow Cruise with international buffet dinner", "Overnight in Dubai"] },
      { day: 2, title: "Dubai City Tour & Burj Khalifa", details: ["Photo stops at Atlantis The Palm & Burj Al Arab", "Visit Dubai Frame", "Ascend to 124th Floor of Burj Khalifa during sunset", "Watch Dubai Fountain Show at Dubai Mall", "Overnight in Dubai"] },
      { day: 3, title: "Desert Safari with BBQ & Cultural Shows", details: ["Morning at leisure / Shopping at Gold Souk", "3:00 PM pickup for Desert Safari", "Red dune bashing, camel riding, sandboarding", "BBQ Dinner with Tanoura dance & Belly dance", "Overnight in Dubai"] },
      { day: 4, title: "Abu Dhabi Day Tour with Sheikh Zayed Mosque", details: ["Drive to Abu Dhabi", "Visit magnificent Sheikh Zayed Grand Mosque", "Photo stop at Ferrari World & Louvre Abu Dhabi", "Return to Dubai"] },
      { day: 5, title: "Museum of the Future & Departure", details: ["Optional visit to Museum of the Future", "Airport transfer for return flight"] }
    ],
    hotels: [
      { name: "Mövenpick Hotel Bur Dubai", location: "Bur Dubai", category: "5★ City Hotel", details: "Superior Room", photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80" }
    ],
    reviews: [
      { name: "Rajesh P. & Family", date: "Traveled Jan 2026", stars: 5, text: "Desert safari was thrilling! Kids loved the Burj Khalifa views and fountain show." }
    ],
    faqs: [
      { q: "Is UAE visa included?", a: "Standard 30-day tourist visa is processed as part of this package." }
    ]
  },
  {
    id: "maldives-escape",
    title: "Maldives Overwater Escape",
    tagline: "Turquoise lagoons, private overwater villas & seaplane rides",
    type: "international",
    destination: "Maldives",
    route: "Malé → Private Island Resort",
    durationDays: 5,
    durationNights: 4,
    theme: "luxury",
    tourType: "Customized Tour",
    starCategory: 5,
    rating: 4.9,
    reviewsCount: 156,
    priceOriginal: 72499,
    priceDiscounted: 64999,
    badge: "10% OFF",
    startingCity: "Malé (MLE)",
    endingCity: "Malé (MLE)",
    bestTime: "November – April",
    inclusions: [
      "2 Nights Beach Villa + 2 Nights Water Villa with Pool",
      "All-Inclusive Meal Plan (Breakfast, Lunch, Dinner, Unlimited Beverages)",
      "Roundtrip Speedboat / Seaplane Airport Transfers",
      "Complimentary Sunset Cruise & Snorkeling Gear rental",
      "Honeymoon Perks: Cake, Bed Decoration & Spa Discount"
    ],
    exclusions: [
      "International flights",
      "Motorized water sports (Jet ski, Scuba diving)",
      "Personal items"
    ],
    photos: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80"
    ],
    overview: "Step straight from your private overwater villa into crystal clear turquoise waters filled with vibrant coral reefs, sea turtles and rays. Pure tropical paradise.",
    itinerary: [
      { day: 1, title: "Arrival in Malé → Seaplane Transfer to Island Resort", details: ["Welcome at Malé Airport and VIP lounge access", "Scenic seaplane transfer over turquoise atolls", "Check in at Beach Villa & evening cocktail", "Overnight at Island Resort"] },
      { day: 2, title: "House Reef Snorkeling & Sunset Dolphin Cruise", details: ["Guided snorkeling session at private house reef", "Evening boat cruise to spot wild spinner dolphins", "Overnight in Beach Villa"] },
      { day: 3, title: "Check-in Overwater Villa with Pool", details: ["Transfer to overwater bungalow with direct ocean stairs", "Private deck sunbathing and ocean swimming", "Overnight in Water Villa"] },
      { day: 4, title: "Spa & Water Sports", details: ["Relaxing couple's massage at overwater spa", "Kayaking & stand-up paddleboarding", "Candlelight beach dinner", "Overnight in Water Villa"] },
      { day: 5, title: "Seaplane Transfer → Departure", details: ["Breakfast with ocean view", "Seaplane transfer to Malé for homeward flight"] }
    ],
    hotels: [
      { name: "Centara Ras Fushi Resort & Spa", location: "North Malé Atoll", category: "5★ Adults-Only Luxury", details: "Overwater villa", photo: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=500&q=80" }
    ],
    reviews: [
      { name: "Ananya & Dev", date: "Traveled Feb 2026", stars: 5, text: "Living in the water villa was a dream come true! Snorkeling right off our deck was unbelievable." }
    ],
    faqs: [
      { q: "Is visa required for Maldives?", a: "Free 30-day Visa on Arrival is granted to all travelers upon landing in Malé." }
    ]
  },
  {
    id: "manali-adventure",
    title: "Manali Adventure Trail",
    tagline: "Snow peaks, Solang sports, river rafting & Kasol valley vibes",
    type: "domestic",
    destination: "Manali",
    route: "Manali → Solang Valley → Kasol → Manikaran",
    durationDays: 5,
    durationNights: 4,
    theme: "adventure",
    tourType: "Group Tour",
    starCategory: 3,
    rating: 4.4,
    reviewsCount: 289,
    priceOriginal: 13499,
    priceDiscounted: 11499,
    badge: "14% OFF",
    startingCity: "Chandigarh / Delhi",
    endingCity: "Chandigarh / Delhi",
    bestTime: "Year-Round",
    inclusions: [
      "4 Nights Hotel / Riverside Camp stay",
      "Daily Breakfast & Dinner",
      "Solang Valley excursion for Paragliding & Skiing",
      "Atal Tunnel & Sissu Valley visit",
      "Kasol & Manikaran Sahib Sahib Gurudwara tour",
      "Bonfire & Music night in Kasol camp"
    ],
    exclusions: [
      "Activity charges (Paragliding, Zorbing, ATV)",
      "Volvo bus tickets if not opting for Volvo add-on"
    ],
    photos: [
      "https://images.unsplash.com/photo-1626016301964-3ce62a8823ba?w=900&q=80"
    ],
    overview: "Calling all thrill-seekers! Fly high with paragliding in Solang Valley, drive through the engineering marvel of Atal Tunnel into snowy Sissu, and chill by the Parvati River in Kasol.",
    itinerary: [
      { day: 1, title: "Arrival in Manali & Old Manali Walk", details: ["Check-in at Manali hill resort", "Explore Hadimba Temple & Old Manali cafes", "Overnight in Manali"] },
      { day: 2, title: "Solang Valley & Atal Tunnel to Sissu", details: ["Excursion to Solang Valley for paragliding & ropeway", "Drive through Atal Tunnel into Lahaul valley (Sissu waterfall)", "Overnight in Manali"] },
      { day: 3, title: "Kullu River Rafting → Kasol Camp", details: ["White water river rafting in Kullu", "Visit Vaishno Devi Temple in Kullu", "Transfer to riverside luxury tents in Kasol", "Evening bonfire & music", "Overnight in Kasol"] },
      { day: 4, title: "Manikaran Sahib & Manikaran Hot Springs", details: ["Visit Manikaran Sahib Gurudwara & hot sulfur springs", "Trek to Chalal village along Parvati river", "Overnight in Kasol"] },
      { day: 5, title: "Departure", details: ["Breakfast and departure to Chandigarh/Delhi"] }
    ],
    hotels: [
      { name: "Snow Valley Resorts", location: "Log Hut Area, Manali", category: "4★ Hill Resort", details: "Mountain View Room", photo: "https://images.unsplash.com/photo-1626016301964-3ce62a8823ba?w=500&q=80" }
    ],
    reviews: [
      { name: "Nikhil & Friends", date: "Traveled Jan 2026", stars: 5, text: "Paragliding in Solang and bonfire night in Kasol were peak fun!" }
    ],
    faqs: [
      { q: "Is Atal Tunnel open in winter?", a: "Yes, subject to snow clearance by BRO authorities." }
    ]
  },
  {
    id: "europe-tour",
    title: "Classic Europe Highlights",
    tagline: "Eiffel tower, Amsterdam canals & Swiss Alps high altitude train",
    type: "international",
    destination: "Europe",
    route: "Paris → Amsterdam → Zurich → Lucerne",
    durationDays: 8,
    durationNights: 7,
    theme: "luxury",
    tourType: "Private Tour",
    starCategory: 4,
    rating: 4.8,
    reviewsCount: 94,
    priceOriginal: 119999,
    priceDiscounted: 109999,
    badge: "8% OFF",
    startingCity: "Paris (CDG)",
    endingCity: "Zurich (ZRH)",
    bestTime: "May – October",
    inclusions: [
      "7 Nights 4★ Hotel stay in central city locations",
      "Daily Continental Breakfast",
      "Paris City Tour with Eiffel Tower 2nd Floor & Seine Cruise",
      "Amsterdam Canal Cruise & Zaanse Schans Windmills tour",
      "Eurail High-Speed Train tickets (Paris-Amsterdam-Zurich)",
      "Mt. Titlis Cable Car with Ice Flyer in Switzerland",
      "Schengen Visa assistance"
    ],
    exclusions: [
      "International flights to Paris / from Zurich",
      "Schengen Visa embassy fee",
      "City tourist taxes paid at hotels (~3-5 EUR/night)"
    ],
    photos: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80"
    ],
    overview: "The ultimate European dream trip — fall in love under the Eiffel Tower in Paris, cruise past romantic canal houses in Amsterdam, and conquer snow-capped peaks in the Swiss Alps.",
    itinerary: [
      { day: 1, title: "Arrival in Paris", details: ["Airport pickup and hotel check in", "Evening Seine River Cruise", "Overnight in Paris"] },
      { day: 2, title: "Paris Landmarks & Eiffel Tower", details: ["Louvre Museum exterior, Arc de Triomphe & Champs-Élysées", "Ascend Eiffel Tower 2nd floor", "Overnight in Paris"] },
      { day: 3, title: "High Speed Train to Amsterdam", details: ["Board TGV/Thalys train to Amsterdam", "Amsterdam Canal Cruise passing merchant houses", "Overnight in Amsterdam"] },
      { day: 4, title: "Zaanse Schans Windmills & Cheese Tasting", details: ["Visit Dutch windmill village & wooden clog workshop", "Volendam fishing village walk", "Overnight in Amsterdam"] },
      { day: 5, title: "Train to Zurich, Switzerland", details: ["Scenic train journey through Germany & Swiss countryside", "Evening walk around Lake Zurich", "Overnight in Zurich"] },
      { day: 6, title: "Mt. Titlis Cable Car & Lucerne", details: ["Rotair revolving cable car to Mt. Titlis (3,020m)", "Ice Flyer chairlift & Glacier cave", "Lucerne Chapel Bridge walk", "Overnight in Zurich"] },
      { day: 7, title: "Interlaken & Grindelwald First", details: ["Day tour to Interlaken between Lake Thun & Brienz", "Optional cliff walk at Grindelwald First", "Overnight in Zurich"] },
      { day: 8, title: "Departure", details: ["Breakfast and transfer to Zurich airport"] }
    ],
    hotels: [
      { name: "Novotel Paris Centre Tour Eiffel", location: "Paris", category: "4★ Hotel", details: "Superior Room", photo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80" }
    ],
    reviews: [
      { name: "Meera & Siddharth", date: "Traveled Oct 2025", stars: 5, text: "Mt Titlis in Switzerland was breathtaking. Everything was seamlessly arranged!" }
    ],
    faqs: [
      { q: "How long does Schengen visa take?", a: "We recommend applying 45 to 60 days before your travel date." }
    ]
  }
];

const DEALS_DATA = [
  { id: "d1", tag: "Summer Sale", title: "Flat 20% off beach holidays", hours: 24, code: "SUMMER20" },
  { id: "d2", tag: "Honeymoon Special", title: "Free candlelight dinner on booking", hours: 18, code: "HONEYMOON" },
  { id: "d3", tag: "Early Bird", title: "Book 45 days ahead, save ₹5,000", hours: 40, code: "EARLYBIRD" }
];

const COUPONS_DATA = {
  "RULE20": { discountPercent: 20, description: "20% off on holiday packages" },
  "EARLYBIRD": { discountFlat: 5000, description: "Flat ₹5,000 off" },
  "WELCOME1000": { discountFlat: 1000, description: "Flat ₹1,000 off for first-time bookers" },
  "SUMMER20": { discountPercent: 20, description: "20% off Summer Sale" }
};

// =========================================================
// Storage & Helper Methods
// =========================================================

const Store = {
  getWishlist: function() {
    try {
      return JSON.parse(localStorage.getItem('rmh_wishlist')) || ['kerala-escape', 'bali-retreat'];
    } catch (e) {
      return ['kerala-escape', 'bali-retreat'];
    }
  },
  saveWishlist: function(list) {
    localStorage.setItem('rmh_wishlist', JSON.stringify(list));
    this.updateHeaderBadges();
  },
  toggleWishlist: function(id) {
    let list = this.getWishlist();
    const index = list.indexOf(id);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
      added = true;
    }
    this.saveWishlist(list);
    return added;
  },
  isWishlisted: function(id) {
    return this.getWishlist().includes(id);
  },
  getBookings: function() {
    try {
      return JSON.parse(localStorage.getItem('rmh_bookings')) || [
        {
          bookingId: "RMH-84920",
          packageId: "kerala-escape",
          title: "Amazing Kerala Escape",
          date: "2026-10-15",
          travelers: 2,
          roomType: "Double Sharing",
          totalPaid: 46398,
          status: "Confirmed",
          createdAt: "2026-09-01"
        }
      ];
    } catch (e) {
      return [];
    }
  },
  addBooking: function(bookingObj) {
    let bookings = this.getBookings();
    bookings.unshift(bookingObj);
    localStorage.setItem('rmh_bookings', JSON.stringify(bookings));
    this.updateHeaderBadges();
  },
  updateHeaderBadges: function() {
    const wishCount = this.getWishlist().length;
    const bookCount = this.getBookings().length;
    
    document.querySelectorAll('.wishlist-link').forEach(el => {
      el.textContent = `Wishlist (${wishCount})`;
    });
    document.querySelectorAll('.bookings-link').forEach(el => {
      el.textContent = `My Bookings (${bookCount})`;
    });
  },
  getUser: function() {
    try {
      return JSON.parse(localStorage.getItem('rmh_user')) || null;
    } catch(e) {
      return null;
    }
  },
  setUser: function(userObj) {
    localStorage.setItem('rmh_user', JSON.stringify(userObj));
    this.updateUserUI();
  },
  updateUserUI: function() {
    const user = this.getUser();
    document.querySelectorAll('.btn-login').forEach(btn => {
      if (user) {
        btn.textContent = `Hi, ${user.name.split(' ')[0]}`;
        btn.classList.add('logged-in');
      } else {
        btn.textContent = `Login`;
        btn.classList.remove('logged-in');
      }
    });
  }
};
