// Initial sample rooms data with realistic Indian pricing (in ₹) and high-res Unsplash imagery
export const INITIAL_ROOMS = [
  {
    id: "room-101",
    name: "Classic Comfort Twin Room",
    type: "Standard",
    price: 3600,
    rating: 4.6,
    reviewsCount: 88,
    capacity: 2,
    bedType: "2 Single Twin Beds",
    size: "320 sq ft",
    featured: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Cozy and smartly appointed room featuring twin beds, quiet courtyard views, and modern comforts.",
    description: "Ideal for business travelers and travel companions, the Classic Comfort Twin Room offers two ultra-comfortable single twin beds with 400-thread-count Egyptian cotton linens. Enjoy serene views of our private courtyard garden, an ergonomic workstation, high-speed Wi-Fi, and a spa-inspired walk-in rain shower.",
    facilities: [
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "43-inch Smart TV",
      "Work Desk & Ergonomic Chair",
      "Rain Shower",
      "Tea & Coffee Maker",
      "Electronic Safe",
      "Daily Housekeeping"
    ]
  },
  {
    id: "room-102",
    name: "Deluxe Garden View Room",
    type: "Deluxe",
    price: 4800,
    rating: 4.8,
    reviewsCount: 142,
    capacity: 2,
    bedType: "1 Plush King Bed",
    size: "420 sq ft",
    featured: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Sunlit retreat offering serene views over lush landscaped botanical gardens with a private sit-out.",
    description: "Unwind in our Deluxe Garden View Room, crafted with warm teakwood accents, custom brass lighting, and expansive French windows that overlook our botanical grounds. Features a bespoke king bed, cozy armchair reading nook, marble ensuite with deep soaking tub, and organic Ayurvedic toiletries.",
    facilities: [
      "High-Speed Wi-Fi",
      "Individual Climate Control",
      "50-inch 4K Smart TV",
      "Private Garden Sit-out",
      "Bathtub & Rain Shower",
      "Mini Bar & Kettle",
      "Soundproof Windows",
      "Complimentary Breakfast"
    ]
  },
  {
    id: "room-103",
    name: "Executive Ocean View King",
    type: "Executive Suite",
    price: 7500,
    rating: 4.9,
    reviewsCount: 196,
    capacity: 3,
    bedType: "1 Super King Bed + Daybed",
    size: "540 sq ft",
    featured: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Panoramic coastal vistas, dedicated lounge area, and exclusive executive lounge access.",
    description: "Designed for discerning guests, the Executive Ocean View King provides uninterrupted views across the azure horizon. Includes a spacious living seating alcove, private panoramic balcony, espresso machine, premium minibar, and complimentary evening cocktail hours at the Grand Club Lounge.",
    facilities: [
      "Executive Club Access",
      "High-Speed Wi-Fi",
      "Panoramic Sea-facing Balcony",
      "Nespresso Coffee Machine",
      "55-inch Ultra HD TV",
      "Walk-in Wardrobe",
      "Marble Double Vanity",
      "Complimentary Breakfast & High Tea"
    ]
  },
  {
    id: "room-104",
    name: "Serene Family Suite with Balcony",
    type: "Family Room",
    price: 9800,
    rating: 4.8,
    reviewsCount: 112,
    capacity: 4,
    bedType: "1 King Bed + 2 Queen Twin Beds",
    size: "680 sq ft",
    featured: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Expansive dual-bedroom layout tailored for family comfort with playful touches and child amenities.",
    description: "Created specifically for families traveling together, this suite provides interconnected privacy: a master king bedroom for parents and an adjacent twin bedroom for children or extra guests. Equipped with dual bathrooms, dining table, private balcony, board games on request, and kid-friendly dining menus.",
    facilities: [
      "Two Separate Bedrooms",
      "Two Full Bathrooms",
      "High-Speed Wi-Fi",
      "Kid-Friendly Amenities",
      "Dining Table for 4",
      "Microwave & Refrigerator",
      "Two Smart TVs",
      "Complimentary Breakfast for Family"
    ]
  },
  {
    id: "room-105",
    name: "Royal Heritage Suite",
    type: "Luxury Suite",
    price: 14500,
    rating: 4.95,
    reviewsCount: 154,
    capacity: 3,
    bedType: "1 Handcrafted King Bed",
    size: "820 sq ft",
    featured: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Majestic regal decor, antique furnishings, standalone jacuzzi tub, and 24/7 personal butler service.",
    description: "Immerse yourself in timeless grandeur. The Royal Heritage Suite showcases hand-tufted carpets, gold-leaf molding, and classic architectural arches reminiscent of grand Indian palaces. Features a private living parlor, standalone jacuzzi overlooking the hills, and personalized butler service on call.",
    facilities: [
      "24/7 Dedicated Butler Service",
      "Private Jacuzzi Tub",
      "Separate Living & Dining Salon",
      "Chauffeured Airport Transfer",
      "Complimentary Champagne on Arrival",
      "Walk-in Dressing Room",
      "Bose Sound System",
      "All-Inclusive Gourmet Breakfast"
    ]
  },
  {
    id: "room-106",
    name: "Aurelia Presidential Villa",
    type: "Luxury Suite",
    price: 24000,
    rating: 5.0,
    reviewsCount: 78,
    capacity: 6,
    bedType: "2 Master King Bedrooms + Sofa Bed",
    size: "1450 sq ft",
    featured: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Our pinnacle accommodation featuring a private plunge pool, lush courtyard, and supreme privacy.",
    description: "The crown jewel of The Grand Aurelia. This standalone private villa features an infinity-edge temperature-controlled plunge pool, sun loungers, expansive indoor-outdoor lounge, private pantry with chef-on-demand service, and two palatial master suites with Italian marble open-air bathrooms.",
    facilities: [
      "Private Heated Plunge Pool",
      "Private Sun Deck & Garden",
      "Chef On Demand (Curated Menus)",
      "Dedicated 24/7 Villa Host",
      "Two Palatial Master Bedrooms",
      "Luxury Limousine Airport Service",
      "Premium Wine Cellar Refrigerator",
      "Spa Treatments in Villa"
    ]
  },
  {
    id: "room-107",
    name: "Panorama Skyline Suite",
    type: "Executive Suite",
    price: 11500,
    rating: 4.88,
    reviewsCount: 92,
    capacity: 3,
    bedType: "1 Emperor King Bed",
    size: "720 sq ft",
    featured: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Top-floor suite boasting wrap-around corner glass walls with breathtaking city & sunset horizons.",
    description: "Positioned on the hotel's highest tier, the Panorama Skyline Suite grants sweeping 270-degree sunset vistas. Relish the bespoke cocktail bar, automated blackout shades, deep soaking window tub, and tailored pillow menu designed for unmatched tranquility.",
    facilities: [
      "Floor-to-Ceiling Glass Walls",
      "Corner Soaking Tub with Views",
      "In-Suite Cocktail Bar",
      "High-Speed Wi-Fi",
      "65-inch OLED Home Theater",
      "Complimentary Valet Parking",
      "Automated Climate & Lighting",
      "VIP Club Lounge Privileges"
    ]
  },
  {
    id: "room-108",
    name: "Superior Deluxe Terrace",
    type: "Deluxe",
    price: 6200,
    rating: 4.75,
    reviewsCount: 104,
    capacity: 2,
    bedType: "1 Plush King Bed",
    size: "460 sq ft",
    featured: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "Charming sunlit deluxe room with direct access to a private furnished terrace overlooking the pool.",
    description: "Step directly out onto your private stone terrace surrounded by bougainvillea. Enjoy morning coffee in the cool breeze and late-night stargazing. Inside, discover soothing neutral decor, natural timber flooring, a king featherbed, and a modern marble bathroom.",
    facilities: [
      "Private Furnished Terrace",
      "Direct Pool View",
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Tea & Coffee Station",
      "Luxury Rain Shower",
      "Electronic In-Room Safe",
      "Complimentary Breakfast"
    ]
  }
];

export const HOTEL_FACILITIES = [
  {
    id: "wifi",
    icon: "Wifi",
    title: "High-Speed Wi-Fi",
    description: "Seamless fiber optic wireless internet throughout rooms, lounges, and outdoor pools."
  },
  {
    id: "pool",
    icon: "Waves",
    title: "Infinity Pool",
    description: "Temperature-controlled swimming pool with private sun cabanas and poolside bar."
  },
  {
    id: "dining",
    icon: "UtensilsCrossed",
    title: "Fine Dining & Bistro",
    description: "Award-winning multicuisine restaurant serving authentic regional and global delicacies."
  },
  {
    id: "spa",
    icon: "Sparkles",
    title: "Ayurvedic Spa & Wellness",
    description: "Holistic herbal therapies, steam room, sauna, and rejuvenating Swedish massages."
  },
  {
    id: "ac",
    icon: "Wind",
    title: "Climate Control AC",
    description: "Silent individual room temperature control with advanced HEPA air filtration."
  },
  {
    id: "parking",
    icon: "Car",
    title: "Valet & EV Parking",
    description: "Complimentary 24/7 secure valet parking equipped with fast EV charging stations."
  },
  {
    id: "gym",
    icon: "Dumbbell",
    title: "Modern Fitness Center",
    description: "Cardio stations, free weights, and yoga studio overlooking tropical gardens."
  },
  {
    id: "concierge",
    icon: "Clock",
    title: "24/7 Concierge & Butler",
    description: "Round-the-clock front desk, room service, travel tours, and currency exchange."
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "Bengaluru, India",
    rating: 5,
    comment: "The Grand Aurelia exceeded every expectation. The Royal Heritage Suite was magnificent, and the staff treated us like royalty. Truly an unforgettable anniversary weekend!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    stayedRoom: "Royal Heritage Suite"
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    location: "Mumbai, India",
    rating: 5,
    comment: "Flawless hospitality, exquisite breakfast spread, and ultra-quiet rooms. The infinity pool at sunset is mesmerizing. The online booking process was silky smooth.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    stayedRoom: "Executive Ocean View King"
  },
  {
    id: 3,
    name: "Vikram & Sanya Malhotra",
    location: "New Delhi, India",
    rating: 5,
    comment: "Traveled with our two kids and booked the Serene Family Suite. The space was enormous, spotless, and safe for children. Will definitely be our first choice every time we visit!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    stayedRoom: "Serene Family Suite with Balcony"
  }
];

export const HOTEL_INFO = {
  name: "The Grand Aurelia",
  tagline: "Where Timeless Heritage Meets Contemporary Luxury",
  description: "Nestled along the pristine scenic coastline, The Grand Aurelia offers sanctuary to discerning travelers. Experience world-class hospitality, artisanal culinary journeys, and serene architecture designed for unmatched rejuvenation.",
  phone: "+91 80 4968 2200",
  email: "reservations@grandaurelia.com",
  supportEmail: "concierge@grandaurelia.com",
  address: "42 Aurelia Boulevard, Heritage Coastline Road, South Goa - 403702, India",
  checkInTime: "02:00 PM",
  checkOutTime: "11:00 AM",
  cancellationPolicy: "Free cancellation up to 24 hours prior to check-in date. Full refund provided.",
  taxRate: 0.12 // 12% GST standard for luxury hospitality
};
