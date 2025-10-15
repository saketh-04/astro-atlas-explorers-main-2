require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const Collection = require('./models/Collection');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astroatlas';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for import');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Sample Data
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$rK8qN5xKp5j8WvN5xKp5j8WvN5xKp5j8WvN5xKp5j8Wv",
    location: "New York, USA",
    language: "en",
    bio: "Space enthusiast and amateur astronomer. Love exploring the cosmos!",
    darkMode: "enabled",
    notifications: "all",
    privacy: "public",
    level: 5,
    achievements: 12,
    memberSince: "01/15/2024",
    isActive: true
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    password: "$2a$10$rK8qN5xKp5j8WvN5xKp5j8WvN5xKp5j8WvN5xKp5j8Wv",
    location: "London, UK",
    language: "en",
    bio: "Astrophysics student passionate about black holes and quantum mechanics.",
    darkMode: "enabled",
    notifications: "important",
    privacy: "friends",
    level: 8,
    achievements: 25,
    memberSince: "12/10/2023",
    isActive: true
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    password: "$2a$10$rK8qN5xKp5j8WvN5xKp5j8WvN5xKp5j8WvN5xKp5j8Wv",
    location: "Tokyo, Japan",
    language: "en",
    bio: "Professional photographer specializing in astrophotography.",
    darkMode: "auto",
    notifications: "all",
    privacy: "public",
    level: 12,
    achievements: 45,
    memberSince: "08/22/2023",
    isActive: true
  }
];

const favorites = [
  {
    name: "Triangulum",
    type: "galaxy",
    description: "Third-largest in Local Group.",
    distance: 3000000,
    discovered: "1654-10-25",
    image: "https://astrobackyard.com/wp-content/uploads/2023/11/triangulum-galaxy.jpg"
  },
  {
    name: "Sombrero",
    type: "galaxy",
    description: "Spiral with prominent dust lane.",
    distance: 31100000,
    discovered: "1785-01-01",
    image: "https://media.cnn.com/api/v1/images/stellar/prod/webb-stsci-01jcgz71j2.jpg"
  },
  {
    name: "Whirlpool",
    type: "galaxy",
    description: "Grand Design spiral.",
    distance: 23100000,
    discovered: "1773-10-13",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg"
  },
  {
    name: "Andromeda",
    type: "galaxy",
    description: "Nearest large galaxy to the Milky Way.",
    distance: 2537000,
    discovered: "0010-01-01",
    image: "https://example.com/andromeda.jpg"
  },
  {
    name: "Milky Way Center",
    type: "galaxy",
    description: "Center region of our own galaxy.",
    distance: 0,
    discovered: "Ancient",
    image: "https://example.com/milkywaycenter.jpg"
  },
  {
    name: "Mars",
    type: "planet",
    mass: "6.39e23",
    distance: 1.52,
    description: "The red planet, known for its iron oxide surface.",
    discovered: "1659-11-28",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800"
  },
  {
    name: "Jupiter",
    type: "planet",
    mass: "1.898e27",
    distance: 5.20,
    description: "Largest planet in the solar system.",
    discovered: "1610-01-07",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?w=800"
  },
  {
    name: "Saturn",
    type: "planet",
    mass: "5.68e26",
    distance: 9.58,
    description: "Ringed gas giant, second-largest planet.",
    discovered: "1610-07-25",
    image: "https://images.unsplash.com/photo-1614732735907-7d9c3b0e3d5c?w=800"
  },
  {
    name: "Neptune",
    type: "planet",
    mass: "1.02e26",
    distance: 30.07,
    description: "An ice giant planet, farthest known in our system.",
    discovered: "1846-09-23",
    image: "https://example.com/neptune.jpg"
  },
  {
    name: "Sirius",
    type: "star",
    description: "Brightest star in the night sky.",
    distance: 8.6,
    discovered: "unknown",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800"
  },
  {
    name: "Betelgeuse",
    type: "star",
    description: "Red supergiant star in the Orion constellation.",
    distance: 642.5,
    discovered: "1600-01-01",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800"
  },
  {
    name: "Proxima Centauri",
    type: "star",
    description: "Closest known star to the Sun.",
    distance: 4.24,
    discovered: "1915-10-18",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800"
  },
  {
    name: "Alpha Centauri",
    type: "star",
    description: "Closest star system to the Solar System.",
    distance: 4.37,
    discovered: "1839-01-01",
    image: "https://example.com/alphacentauri.jpg"
  },
  {
    name: "Vega",
    type: "star",
    description: "Bright star in the Lyra constellation.",
    distance: 25,
    discovered: "1850-01-01",
    image: "https://example.com/vega.jpg"
  }
];

const collections = [
  {
    name: "Solar System Planets",
    description: "A curated list of the eight planets in our solar system, from Mercury to Neptune.",
    items: 8,
    shared: true,
    color: "from-blue-500 to-cyan-500",
    created: "2024-08-15",
    lastModified: "2025-10-12"
  },
  {
    name: "Nearby Stars",
    description: "A collection featuring the closest stars to Earth, including Proxima Centauri and Sirius.",
    items: 10,
    shared: false,
    color: "from-orange-400 to-yellow-400",
    created: "2024-05-10",
    lastModified: "2025-09-30"
  },
  {
    name: "Popular Galaxies",
    description: "Famous galaxies such as Andromeda, Sombrero, and Whirlpool that have captivated astronomers worldwide.",
    items: 6,
    shared: true,
    color: "from-purple-600 to-pink-600",
    created: "2024-07-22",
    lastModified: "2025-09-25"
  },
  {
    name: "Messier Objects",
    description: "A collection of notable deep-sky objects cataloged by Charles Messier, including nebulae and star clusters.",
    items: 15,
    shared: true,
    color: "from-green-500 to-emerald-500",
    created: "2024-04-12",
    lastModified: "2025-08-15"
  },
  {
    name: "Exoplanet Discoveries",
    description: "Discoveries of planets orbiting other stars — expanding our understanding of habitable worlds.",
    items: 12,
    shared: false,
    color: "from-indigo-500 to-violet-600",
    created: "2024-09-05",
    lastModified: "2025-10-01"
  }
];


async function importData() {
  try {
    await connectDB();

    // Clear collections
    await User.deleteMany({});
    await Favorite.deleteMany({});
    await Collection.deleteMany({});

    // Insert users one by one for better error tracking
    for (const user of users) {
      try {
        await User.create(user);
      } catch(e) {
        console.error('User import failed:', e.message, user);
      }
    }

    // Insert favorites one by one
    for (const favorite of favorites) {
      try {
        await Favorite.create(favorite);
      } catch(e) {
        console.error('Favorite import failed:', e.message, favorite);
      }
    }

    // Insert collections one by one
    for (const collection of collections) {
      try {
        await Collection.create(collection);
      } catch(e) {
        console.error('Collection import failed:', e.message, collection);
      }
    }

    console.log('Import process complete');
    process.exit(0);
  } catch (error) {
    console.error('General error:', error);
    process.exit(1);
  }
}

importData();
