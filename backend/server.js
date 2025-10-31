// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Experience Schema
// const experienceSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   shortDescription: String,
//   image: String,
//   price: Number,
//   duration: String,
//   category: String,
//   rating: Number,
//   reviewCount: Number,
//   location: String,
//   highlights: [String],
//   included: [String],
//   notIncluded: [String],
//   availability: [{
//     date: String,
//     slots: [{
//       time: String,
//       available: Number,
//       total: Number,
//     }]
//   }]
// });

// const Experience = mongoose.model('Experience', experienceSchema);

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//   experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
//   experienceTitle: String,
//   selectedDate: String,
//   selectedSlot: String,
//   name: String,
//   email: String,
//   phone: String,
//   participants: Number,
//   promoCode: String,
//   discount: Number,
//   subtotal: Number,
//   total: Number,
//   bookingDate: { type: Date, default: Date.now },
//   status: { type: String, default: 'confirmed' }
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Promo Code Schema
// const promoSchema = new mongoose.Schema({
//   code: String,
//   type: String, // 'percentage' or 'fixed'
//   value: Number,
//   active: Boolean,
// });

// const Promo = mongoose.model('Promo', promoSchema);

// // Seed Data Function
// async function seedData() {
//   const count = await Experience.countDocuments();
//   if (count > 0) return;

//   const experiences = [
//     {
//       title: "Sunset Sailing Adventure",
//       description: "Experience the magic of golden hour on the water with our premium sunset sailing tour. Watch the sun dip below the horizon while enjoying complimentary refreshments and expert guidance from our experienced crew.",
//       shortDescription: "2-hour sunset sail with refreshments",
//       image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
//       price: 89,
//       duration: "2 hours",
//       category: "Water Sports",
//       rating: 4.8,
//       reviewCount: 234,
//       location: "Marina Bay",
//       highlights: [
//         "Stunning sunset views",
//         "Complimentary drinks & snacks",
//         "Professional crew",
//         "Small group (max 12)"
//       ],
//       included: ["Safety equipment", "Refreshments", "Photo opportunities", "Expert guide"],
//       notIncluded: ["Hotel pickup", "Meals", "Gratuity"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "17:00", available: 8, total: 12 },
//             { time: "18:30", available: 5, total: 12 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "17:00", available: 10, total: 12 },
//             { time: "18:30", available: 12, total: 12 }
//           ]
//         },
//         {
//           date: "2025-11-03",
//           slots: [
//             { time: "17:00", available: 0, total: 12 },
//             { time: "18:30", available: 7, total: 12 }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Mountain Hiking Expedition",
//       description: "Embark on an unforgettable journey through pristine mountain trails. Our guided expedition takes you through breathtaking landscapes, offering panoramic views and encounters with local wildlife.",
//       shortDescription: "Full-day guided mountain trek",
//       image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
//       price: 120,
//       duration: "6 hours",
//       category: "Adventure",
//       rating: 4.9,
//       reviewCount: 189,
//       location: "Mountain Ridge",
//       highlights: [
//         "Scenic mountain trails",
//         "Professional guide",
//         "Lunch included",
//         "Wildlife spotting"
//       ],
//       included: ["Guide", "Lunch", "Equipment", "Transportation"],
//       notIncluded: ["Personal expenses", "Insurance"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "07:00", available: 6, total: 10 },
//             { time: "08:00", available: 4, total: 10 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "07:00", available: 9, total: 10 },
//             { time: "08:00", available: 8, total: 10 }
//           ]
//         }
//       ]
//     },
//     {
//       title: "City Food Tour",
//       description: "Discover the culinary heart of the city with our curated food tour. Sample authentic local dishes, meet passionate chefs, and learn about the rich food culture that makes our city unique.",
//       shortDescription: "3-hour guided food experience",
//       image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
//       price: 65,
//       duration: "3 hours",
//       category: "Food & Drink",
//       rating: 4.7,
//       reviewCount: 412,
//       location: "Downtown",
//       highlights: [
//         "5+ food stops",
//         "Local chef interactions",
//         "Hidden gems",
//         "Cultural insights"
//       ],
//       included: ["Food samples", "Drinks", "Guide", "Recipes"],
//       notIncluded: ["Additional food", "Transportation"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "11:00", available: 15, total: 20 },
//             { time: "14:00", available: 12, total: 20 },
//             { time: "17:00", available: 8, total: 20 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "11:00", available: 18, total: 20 },
//             { time: "14:00", available: 20, total: 20 },
//             { time: "17:00", available: 5, total: 20 }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Photography Workshop",
//       description: "Master the art of photography with our hands-on workshop. Learn professional techniques from award-winning photographers and capture stunning images at picturesque locations.",
//       shortDescription: "4-hour photography masterclass",
//       image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
//       price: 95,
//       duration: "4 hours",
//       category: "Education",
//       rating: 4.9,
//       reviewCount: 156,
//       location: "Various Locations",
//       highlights: [
//         "Pro photographer instructor",
//         "Hands-on practice",
//         "Photo editing tips",
//         "Small group (max 8)"
//       ],
//       included: ["Professional instruction", "Location access", "Digital materials"],
//       notIncluded: ["Camera equipment", "Transportation", "Prints"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "09:00", available: 3, total: 8 },
//             { time: "14:00", available: 6, total: 8 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "09:00", available: 8, total: 8 },
//             { time: "14:00", available: 2, total: 8 }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Wellness & Yoga Retreat",
//       description: "Rejuvenate your mind and body with our wellness retreat. Enjoy guided yoga sessions, meditation, and spa treatments in a serene natural setting perfect for relaxation and self-discovery.",
//       shortDescription: "Half-day wellness experience",
//       image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
//       price: 110,
//       duration: "5 hours",
//       category: "Wellness",
//       rating: 4.8,
//       reviewCount: 278,
//       location: "Wellness Center",
//       highlights: [
//         "Yoga & meditation",
//         "Spa treatment",
//         "Healthy lunch",
//         "Peaceful environment"
//       ],
//       included: ["Yoga mat", "Spa treatment", "Lunch", "Instructor"],
//       notIncluded: ["Transportation", "Additional treatments"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "08:00", available: 10, total: 15 },
//             { time: "13:00", available: 12, total: 15 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "08:00", available: 15, total: 15 },
//             { time: "13:00", available: 9, total: 15 }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Scuba Diving Experience",
//       description: "Dive into an underwater paradise with our guided scuba experience. Explore vibrant coral reefs, encounter colorful marine life, and create memories that will last a lifetime.",
//       shortDescription: "3-hour diving adventure",
//       image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
//       price: 150,
//       duration: "3 hours",
//       category: "Water Sports",
//       rating: 4.9,
//       reviewCount: 198,
//       location: "Coral Bay",
//       highlights: [
//         "Certified instructors",
//         "All equipment included",
//         "Reef exploration",
//         "Underwater photos"
//       ],
//       included: ["Equipment", "Instructor", "Boat ride", "Photos"],
//       notIncluded: ["Certification course", "Hotel pickup"],
//       availability: [
//         {
//           date: "2025-11-01",
//           slots: [
//             { time: "09:00", available: 4, total: 6 },
//             { time: "13:00", available: 6, total: 6 }
//           ]
//         },
//         {
//           date: "2025-11-02",
//           slots: [
//             { time: "09:00", available: 2, total: 6 },
//             { time: "13:00", available: 5, total: 6 }
//           ]
//         }
//       ]
//     }
//   ];

//   await Experience.insertMany(experiences);

//   // Seed promo codes
//   const promos = [
//     { code: 'SAVE10', type: 'percentage', value: 10, active: true },
//     { code: 'FLAT100', type: 'fixed', value: 100, active: true },
//     { code: 'WELCOME20', type: 'percentage', value: 20, active: true }
//   ];

//   await Promo.insertMany(promos);
//   console.log('Database seeded successfully');
// }

// // Routes

// // Get all experiences
// app.get('/api/experiences', async (req, res) => {
//   try {
//     const experiences = await Experience.find().select('-availability');
//     res.json(experiences);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get experience by ID with availability
// app.get('/api/experiences/:id', async (req, res) => {
//   try {
//     const experience = await Experience.findById(req.params.id);
//     if (!experience) {
//       return res.status(404).json({ error: 'Experience not found' });
//     }
//     res.json(experience);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Validate promo code
// app.post('/api/promo/validate', async (req, res) => {
//   try {
//     const { code, subtotal } = req.body;
    
//     const promo = await Promo.findOne({ code: code.toUpperCase(), active: true });
    
//     if (!promo) {
//       return res.status(404).json({ valid: false, message: 'Invalid promo code' });
//     }

//     let discount = 0;
//     if (promo.type === 'percentage') {
//       discount = (subtotal * promo.value) / 100;
//     } else if (promo.type === 'fixed') {
//       discount = promo.value;
//     }

//     res.json({
//       valid: true,
//       discount: Math.min(discount, subtotal),
//       type: promo.type,
//       value: promo.value,
//       message: `Promo code applied! You saved $${Math.min(discount, subtotal).toFixed(2)}`
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create booking
// app.post('/api/bookings', async (req, res) => {
//   try {
//     const {
//       experienceId,
//       selectedDate,
//       selectedSlot,
//       name,
//       email,
//       phone,
//       participants,
//       promoCode,
//       discount,
//       subtotal,
//       total
//     } = req.body;

//     // Validate required fields
//     if (!experienceId || !selectedDate || !selectedSlot || !name || !email || !participants) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Get experience
//     const experience = await Experience.findById(experienceId);
//     if (!experience) {
//       return res.status(404).json({ error: 'Experience not found' });
//     }

//     // Find the date and slot
//     const dateAvailability = experience.availability.find(d => d.date === selectedDate);
//     if (!dateAvailability) {
//       return res.status(400).json({ error: 'Date not available' });
//     }

//     const slot = dateAvailability.slots.find(s => s.time === selectedSlot);
//     if (!slot) {
//       return res.status(400).json({ error: 'Slot not found' });
//     }

//     // Check availability
//     if (slot.available < participants) {
//       return res.status(400).json({ error: 'Not enough spots available' });
//     }

//     // Update slot availability
//     slot.available -= participants;
//     await experience.save();

//     // Create booking
//     const booking = new Booking({
//       experienceId,
//       experienceTitle: experience.title,
//       selectedDate,
//       selectedSlot,
//       name,
//       email,
//       phone,
//       participants,
//       promoCode: promoCode || '',
//       discount: discount || 0,
//       subtotal,
//       total,
//       status: 'confirmed'
//     });

//     await booking.save();

//     res.status(201).json({
//       success: true,
//       booking: {
//         id: booking._id,
//         experienceTitle: booking.experienceTitle,
//         date: booking.selectedDate,
//         time: booking.selectedSlot,
//         participants: booking.participants,
//         total: booking.total,
//         status: booking.status
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get booking by ID
// app.get('/api/bookings/:id', async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }
//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Initialize database and start server
// const PORT = process.env.PORT || 5000;

// mongoose.connection.once('open', async () => {
//   console.log('Connected to MongoDB');
//   await seedData();
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });

// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// This line now works everywhere!
// On Render, it uses Render's environment variables.
// On your computer, it uses the .env file.
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: String,
  description: String,
  shortDescription: String,
  image: String,
  price: Number,
  duration: String,
  category: String,
  rating: Number,
  reviewCount: Number,
  location: String,
  highlights: [String],
  included: [String],
  notIncluded: [String],
  availability: [{
    date: String,
    slots: [{
      time: String,
      available: Number,
      total: Number,
    }]
  }]
});

const Experience = mongoose.model('Experience', experienceSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  experienceTitle: String,
  selectedDate: String,
  selectedSlot: String,
  name: String,
  email: String,
  phone: String,
  participants: Number,
  promoCode: String,
  discount: Number,
  subtotal: Number,
  total: Number,
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Promo Code Schema
const promoSchema = new mongoose.Schema({
  code: String,
  type: String, // 'percentage' or 'fixed'
  value: Number,
  active: Boolean,
});

const Promo = mongoose.model('Promo', promoSchema);

// Seed Data Function
async function seedData() {
  // Clear existing data to prevent duplicates during development restarts
  await Experience.deleteMany({});
  await Promo.deleteMany({});
  
  const experiences = [
    {
      title: "Sunset Sailing Adventure",
      description: "Experience the magic of golden hour on the water with our premium sunset sailing tour. Watch the sun dip below the horizon while enjoying complimentary refreshments and expert guidance from our experienced crew.",
      shortDescription: "2-hour sunset sail with refreshments",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      price: 89,
      duration: "2 hours",
      category: "Water Sports",
      rating: 4.8,
      reviewCount: 234,
      location: "Marina Bay",
      highlights: [
        "Stunning sunset views",
        "Complimentary drinks & snacks",
        "Professional crew",
        "Small group (max 12)"
      ],
      included: ["Safety equipment", "Refreshments", "Photo opportunities", "Expert guide"],
      notIncluded: ["Hotel pickup", "Meals", "Gratuity"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "17:00", available: 8, total: 12 },
            { time: "18:30", available: 5, total: 12 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "17:00", available: 10, total: 12 },
            { time: "18:30", available: 12, total: 12 }
          ]
        },
        {
          date: "2025-11-03",
          slots: [
            { time: "17:00", available: 0, total: 12 },
            { time: "18:30", available: 7, total: 12 }
          ]
        }
      ]
    },
    {
      title: "Mountain Hiking Expedition",
      description: "Embark on an unforgettable journey through pristine mountain trails. Our guided expedition takes you through breathtaking landscapes, offering panoramic views and encounters with local wildlife.",
      shortDescription: "Full-day guided mountain trek",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      price: 120,
      duration: "6 hours",
      category: "Adventure",
      rating: 4.9,
      reviewCount: 189,
      location: "Mountain Ridge",
      highlights: [
        "Scenic mountain trails",
        "Professional guide",
        "Lunch included",
        "Wildlife spotting"
      ],
      included: ["Guide", "Lunch", "Equipment", "Transportation"],
      notIncluded: ["Personal expenses", "Insurance"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "07:00", available: 6, total: 10 },
            { time: "08:00", available: 4, total: 10 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "07:00", available: 9, total: 10 },
            { time: "08:00", available: 8, total: 10 }
          ]
        }
      ]
    },
    {
      title: "City Food Tour",
      description: "Discover the culinary heart of the city with our curated food tour. Sample authentic local dishes, meet passionate chefs, and learn about the rich food culture that makes our city unique.",
      shortDescription: "3-hour guided food experience",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      price: 65,
      duration: "3 hours",
      category: "Food & Drink",
      rating: 4.7,
      reviewCount: 412,
      location: "Downtown",
      highlights: [
        "5+ food stops",
        "Local chef interactions",
        "Hidden gems",
        "Cultural insights"
      ],
      included: ["Food samples", "Drinks", "Guide", "Recipes"],
      notIncluded: ["Additional food", "Transportation"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "11:00", available: 15, total: 20 },
            { time: "14:00", available: 12, total: 20 },
            { time: "17:00", available: 8, total: 20 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "11:00", available: 18, total: 20 },
            { time: "14:00", available: 20, total: 20 },
            { time: "17:00", available: 5, total: 20 }
          ]
        }
      ]
    },
    {
      title: "Photography Workshop",
      description: "Master the art of photography with our hands-on workshop. Learn professional techniques from award-winning photographers and capture stunning images at picturesque locations.",
      shortDescription: "4-hour photography masterclass",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
      price: 95,
      duration: "4 hours",
      category: "Education",
      rating: 4.9,
      reviewCount: 156,
      location: "Various Locations",
      highlights: [
        "Pro photographer instructor",
        "Hands-on practice",
        "Photo editing tips",
        "Small group (max 8)"
      ],
      included: ["Professional instruction", "Location access", "Digital materials"],
      notIncluded: ["Camera equipment", "Transportation", "Prints"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "09:00", available: 3, total: 8 },
            { time: "14:00", available: 6, total: 8 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "09:00", available: 8, total: 8 },
            { time: "14:00", available: 2, total: 8 }
          ]
        }
      ]
    },
    {
      title: "Wellness & Yoga Retreat",
      description: "Rejuvenate your mind and body with our wellness retreat. Enjoy guided yoga sessions, meditation, and spa treatments in a serene natural setting perfect for relaxation and self-discovery.",
      shortDescription: "Half-day wellness experience",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      price: 110,
      duration: "5 hours",
      category: "Wellness",
      rating: 4.8,
      reviewCount: 278,
      location: "Wellness Center",
      highlights: [
        "Yoga & meditation",
        "Spa treatment",
        "Healthy lunch",
        "Peaceful environment"
      ],
      included: ["Yoga mat", "Spa treatment", "Lunch", "Instructor"],
      notIncluded: ["Transportation", "Additional treatments"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "08:00", available: 10, total: 15 },
            { time: "13:00", available: 12, total: 15 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "08:00", available: 15, total: 15 },
            { time: "13:00", available: 9, total: 15 }
          ]
        }
      ]
    },
    {
      title: "Scuba Diving Experience",
      description: "Dive into an underwater paradise with our guided scuba experience. Explore vibrant coral reefs, encounter colorful marine life, and create memories that will last a lifetime.",
      shortDescription: "3-hour diving adventure",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      price: 150,
      duration: "3 hours",
      category: "Water Sports",
      rating: 4.9,
      reviewCount: 198,
      location: "Coral Bay",
      highlights: [
        "Certified instructors",
        "All equipment included",
        "Reef exploration",
        "Underwater photos"
      ],
      included: ["Equipment", "Instructor", "Boat ride", "Photos"],
      notIncluded: ["Certification course", "Hotel pickup"],
      availability: [
        {
          date: "2025-11-01",
          slots: [
            { time: "09:00", available: 4, total: 6 },
            { time: "13:00", available: 6, total: 6 }
          ]
        },
        {
          date: "2025-11-02",
          slots: [
            { time: "09:00", available: 2, total: 6 },
            { time: "13:00", available: 5, total: 6 }
          ]
        }
      ]
    }
  ];

  await Experience.insertMany(experiences);

  // Seed promo codes
  const promos = [
    { code: 'SAVE10', type: 'percentage', value: 10, active: true },
    { code: 'FLAT100', type: 'fixed', value: 100, active: true },
    { code: 'WELCOME20', type: 'percentage', value: 20, active: true }
  ];

  await Promo.insertMany(promos);
  console.log('Database seeded successfully');
}

// Routes

// Get all experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().select('-availability');
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get experience by ID with availability
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate promo code
app.post('/api/promo/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    
    const promo = await Promo.findOne({ code: code.toUpperCase(), active: true });
    
    if (!promo) {
      return res.status(404).json({ valid: false, message: 'Invalid promo code' });
    }

    let discount = 0;
    if (promo.type === 'percentage') {
      discount = (subtotal * promo.value) / 100;
    } else if (promo.type === 'fixed') {
      discount = promo.value;
    }

    res.json({
      valid: true,
      discount: Math.min(discount, subtotal),
      type: promo.type,
      value: promo.value,
      message: `Promo code applied! You saved $${Math.min(discount, subtotal).toFixed(2)}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      experienceId,
      selectedDate,
      selectedSlot,
      name,
      email,
      phone,
      participants,
      promoCode,
      discount,
      subtotal,
      total
    } = req.body;

    // Validate required fields
    if (!experienceId || !selectedDate || !selectedSlot || !name || !email || !participants) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Find the date and slot
    const dateAvailability = experience.availability.find(d => d.date === selectedDate);
    if (!dateAvailability) {
      return res.status(400).json({ error: 'Date not available' });
    }

    const slot = dateAvailability.slots.find(s => s.time === selectedSlot);
    if (!slot) {
      return res.status(400).json({ error: 'Slot not found' });
    }

    // Check availability
    if (slot.available < participants) {
      return res.status(400).json({ error: 'Not enough spots available' });
    }

    // Update slot availability
    slot.available -= participants;
    await experience.save();

    // Create booking
    const booking = new Booking({
      experienceId,
      experienceTitle: experience.title,
      selectedDate,
      selectedSlot,
      name,
      email,
      phone,
      participants,
      promoCode: promoCode || '',
      discount: discount || 0,
      subtotal,
      total,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        experienceTitle: booking.experienceTitle,
        date: booking.selectedDate,
        time: booking.selectedSlot,
        participants: booking.participants,
        total: booking.total,
        status: booking.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  // Only seed data if not in a production environment
  if (process.env.NODE_ENV !== 'production') {
    await seedData();
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});