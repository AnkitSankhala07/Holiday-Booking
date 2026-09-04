const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');
const User = require('./models/User');

dotenv.config();

const packages = [
  {
    packageId: "kerala-escape",
    title: "Amazing Kerala Escape",
    subtitle: "Highlands, tea gardens & luxury backwater houseboats",
    type: "domestic",
    country: "India",
    theme: "family",
    nights: 4,
    days: 5,
    price: 24999,
    originalPrice: 31499,
    rating: 4.7,
    reviewsCount: 312,
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80",
      "https://images.unsplash.com/photo-1580889240911-b57b975a4a1d?w=600&q=80"
    ],
    overview: "A gentle, well-paced route through Kerala's highlands and backwaters — misty tea estates in Munnar, a wildlife safari in Thekkady, and a night aboard a private houseboat in Alleppey.",
    highlights: [
      "Private Houseboat stay in Alleppey Backwaters",
      "Munnar Tea Gardens & Spice Plantation Tour",
      "Periyar Wildlife Sanctuary boat safari"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Cochin → Transfer to Munnar", description: "Airport pickup, drive past Cheeyappara & Valara waterfalls, check-in at Munnar resort." },
      { day: 2, title: "Munnar Sightseeing Tour", description: "Visit Tea Museum, Mattupetty Dam, Echo Point, and stroll through tea gardens." },
      { day: 3, title: "Munnar to Thekkady", description: "Scenic drive to Thekkady, spice plantation visit, Periyar Lake boat safari." },
      { day: 4, title: "Thekkady to Alleppey Houseboat", description: "Board luxury private houseboat, cruise backwaters with all meals prepared on board." },
      { day: 5, title: "Alleppey → Departure from Cochin", description: "Disembark houseboat, transfer back to Cochin airport/station." }
    ],
    inclusions: ["4 Nights Hotel & Houseboat stay", "Daily Breakfast & 2 Dinners", "All Airport & Intercity transfers", "Private AC Vehicle throughout"],
    exclusions: ["Flights or Train tickets", "Personal expenses & tips", "Travel insurance"],
    isFeatured: true
  },
  {
    packageId: "romantic-kashmir",
    title: "Enchanting Kashmir Valley",
    subtitle: "Shikara rides, Gulmarg snow peak cable car & Pahalgam meadows",
    type: "domestic",
    country: "India",
    theme: "honeymoon",
    nights: 5,
    days: 6,
    price: 32999,
    originalPrice: 42000,
    rating: 4.9,
    reviewsCount: 184,
    heroImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80"
    ],
    overview: "Experience paradise on earth: Dal Lake luxury houseboat, Gulmarg Gondola ride, and the pine forests of Pahalgam.",
    highlights: ["Shikara Ride on Dal Lake", "Gulmarg Gondola Cable Car Ride", "Pahalgam Betaab Valley excursion"],
    itinerary: [
      { day: 1, title: "Arrival in Srinagar & Dal Lake Houseboat", description: "Pickup from Srinagar airport, check-in to houseboat, sunset Shikara ride." },
      { day: 2, title: "Srinagar to Gulmarg Day Trip", description: "Drive to Gulmarg, ride Gondola to Phase 1 & 2 snow peaks." },
      { day: 3, title: "Srinagar to Pahalgam", description: "Travel to Pahalgam via Saffron fields and Pine Valley." }
    ],
    inclusions: ["5 Nights Accommodation", "Breakfast & Dinner", "Shikara Ride", "Private Cab"],
    exclusions: ["Airfare", "Gondola tickets", "Pony rides"],
    isFeatured: true
  },
  {
    packageId: "bali-bliss",
    title: "Bali Tropical Paradise & Nusa Penida",
    subtitle: "Ubud jungle swings, luxury beachfront villas & island tours",
    type: "international",
    country: "Indonesia",
    theme: "luxury",
    nights: 6,
    days: 7,
    price: 54999,
    originalPrice: 68000,
    rating: 4.9,
    reviewsCount: 410,
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80"
    ],
    overview: "Immerse yourself in Bali's rich culture, lush rice terraces, waterfall hikes, and crystal clear beaches.",
    highlights: ["Ubud Jungle Swing & Rice Terraces", "Nusa Penida Kelingking Beach Tour", "Tanah Lot Sunset Temple"],
    itinerary: [
      { day: 1, title: "Arrival in Bali", description: "Private transfer to luxury villa in Ubud." },
      { day: 2, title: "Ubud Culture & Waterfall Tour", description: "Visit Tegenungan Waterfall, Tegallalang Rice Terrace, Sacred Monkey Forest." }
    ],
    inclusions: ["6 Nights Resort & Villa Stay", "Daily Breakfast", "Nusa Penida Speedboat & Tour", "Airport Transfers"],
    exclusions: ["International Flights", "Bali Tourist Levy", "Personal Expenses"],
    isFeatured: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rule_holiday');
    console.log('MongoDB Connected for seeding...');

    await Package.deleteMany();
    console.log('Existing packages cleared');

    await Package.insertMany(packages);
    console.log('Sample holiday packages seeded successfully!');

    // Create a demo admin user if none exists
    const adminExists = await User.findOne({ email: 'admin@rulemyholiday.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@rulemyholiday.com',
        password: 'AdminPassword123!',
        phone: '+91 9876543210',
        role: 'admin'
      });
      console.log('Demo admin user created: admin@rulemyholiday.com / AdminPassword123!');
    }

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
