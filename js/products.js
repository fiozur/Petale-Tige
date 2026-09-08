/**
 * Product catalog mock data for Flower Bouquet Shop
 */
export const PRODUCTS = [
  {
    id: 'aurore-rose',
    name: "L'Aurore Rose",
    subtitle: "Blush peonies, garden spray roses & silver dollar eucalyptus",
    price: 88,
    description: "An ethereal composition inspired by Parisian morning light. Hand-arranged with soft blush garden roses, fragrant cloud peonies, and trailing eucalyptus fronds tied in raw silk ribbon.",
    flowers: ["Duchesse Peonies", "Blush Garden Roses", "Ranunculus", "Silver Dollar Eucalyptus"],
    season: ["spring", "summer"],
    scentProfile: "Delicate Rosewater & Wild Peony Nectar",
    vaseLife: "7–10 Days",
    occasion: ["anniversaries", "romance", "birthdays"],
    color: "dusty-pink",
    colorLabel: "Dusty Pink",
    bestseller: true,
    rating: 4.95,
    reviewsCount: 68,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '14 stems', price: 68 },
      { id: 'signature', name: 'Signature', stems: '22 stems', price: 88, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '36 stems', price: 128 }
    ],
    vaseIncluded: "Signature Fluted Ceramic Vase available (+$25)"
  },
  {
    id: 'seraphina-botanical',
    name: "Seraphina Botanical",
    subtitle: "Porcelain roses, white ranunculus, astilbe & bleached ruscus",
    price: 110,
    description: "Serene, luminous, and sculpted with immaculate grace. Seraphina brings pristine white French garden roses paired with feathery astilbe and sculptural bleached greens for a whisper-quiet luxury.",
    flowers: ["White O'Hara Roses", "French Ranunculus", "Pink Astilbe", "Italian Ruscus"],
    season: ["spring", "winter"],
    scentProfile: "Powdery French White Rose & Fresh Pear",
    vaseLife: "8–12 Days",
    occasion: ["sympathy", "everyday", "anniversaries"],
    color: "soft-cream",
    colorLabel: "Soft Cream",
    bestseller: true,
    rating: 4.9,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '16 stems', price: 85 },
      { id: 'signature', name: 'Signature', stems: '24 stems', price: 110, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '40 stems', price: 155 }
    ],
    vaseIncluded: "Matte Alabaster Vessel available (+$28)"
  },
  {
    id: 'provencal-meadow',
    name: "Provençal Meadow",
    subtitle: "English garden chamomile, wild sage, sweet pea & lavender",
    price: 95,
    description: "Evoking sun-warmed cobblestone walks through lavender terraces in Grasse. Wild textured stems dance freely with aromatic sage and honeyed sweet pea blooms.",
    flowers: ["Wild Chamomile", "French Lavender", "Sweet Peas", "Sage Greens", "Scabiosa"],
    season: ["summer"],
    scentProfile: "Sun-warmed Aromatic Lavender & Crushed Sage",
    vaseLife: "6–9 Days",
    occasion: ["everyday", "birthdays"],
    color: "sage-wild",
    colorLabel: "Sage & Wild",
    bestseller: false,
    rating: 4.88,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '15 stems', price: 75 },
      { id: 'signature', name: 'Signature', stems: '25 stems', price: 95, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '38 stems', price: 140 }
    ],
    vaseIncluded: "Hand-thrown Terracotta Pot available (+$22)"
  },
  {
    id: 'velvet-twilight',
    name: "Velvet Twilight",
    subtitle: "Burgundy dahlia blooms, smoked mauve carnations & blackberry",
    price: 125,
    description: "Moody, romantic, and richly dimensional. Deep wine dahlias layer with dusty mauve antique carnations, dark plum hellebores, and wild bramble accents.",
    flowers: ["Chocolate Dahlia", "Mauve Antique Carnations", "Plum Hellebore", "Blackberry Sprigs"],
    season: ["autumn"],
    scentProfile: "Dark Wild Blackberry & Earthy Cocoa Moss",
    vaseLife: "8–11 Days",
    occasion: ["anniversaries", "romance"],
    color: "muted-berry",
    colorLabel: "Muted Berry",
    bestseller: true,
    rating: 4.97,
    reviewsCount: 74,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '14 stems', price: 95 },
      { id: 'signature', name: 'Signature', stems: '22 stems', price: 125, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '36 stems', price: 175 }
    ],
    vaseIncluded: "Smoked Rose Glass Urn available (+$32)"
  },
  {
    id: 'blush-whisper',
    name: "Blush Whisper",
    subtitle: "Climbing lisianthus, buttercup ranunculus & young olive leaves",
    price: 78,
    description: "A breezy arrangement of pastel warmth. Petals as delicate as morning silk, bathed in pale peach and warm blush tones that bring instant cheer to any sunlit room.",
    flowers: ["Blush Lisianthus", "Peach Ranunculus", "Baby Spray Roses", "Olive Twigs"],
    season: ["spring", "summer"],
    scentProfile: "Airy Sweet Peach & Green Olive Leaf",
    vaseLife: "7–10 Days",
    occasion: ["birthdays", "everyday"],
    color: "dusty-pink",
    colorLabel: "Dusty Pink",
    bestseller: false,
    rating: 4.86,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '12 stems', price: 58 },
      { id: 'signature', name: 'Signature', stems: '20 stems', price: 78, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '32 stems', price: 115 }
    ],
    vaseIncluded: "Soft Clay Ribbed Vessel available (+$20)"
  },
  {
    id: 'elysian-garden',
    name: "Elysian Garden",
    subtitle: "Coral charm peonies, blush garden roses & King Protea focal",
    price: 145,
    description: "Our crowning seasonal statement piece. Centered around an architectural King Protea, embraced by changing Coral Charm peonies and layered heirloom garden roses.",
    flowers: ["King Protea", "Coral Charm Peonies", "Heirloom Roses", "Seeded Eucalyptus"],
    season: ["autumn", "summer"],
    scentProfile: "Heirloom Antique Rose & Exotic Protea Honey",
    vaseLife: "10–14 Days",
    occasion: ["anniversaries", "birthdays", "romance"],
    color: "dusty-pink",
    colorLabel: "Dusty Pink",
    bestseller: true,
    rating: 4.98,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '18 stems', price: 110 },
      { id: 'signature', name: 'Signature', stems: '28 stems', price: 145, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '45 stems', price: 195 }
    ],
    vaseIncluded: "Sculpted Frosted Glass Flute available (+$35)"
  },
  {
    id: 'sylvan-grace',
    name: "Sylvan Grace",
    subtitle: "White anemones with indigo centers, dusty miller & viburnum",
    price: 85,
    description: "Quiet, poetic, and evocative of early morning fog in secret botanical arboretums. Crisp velvety white anemones accented by frosted silvery foliage.",
    flowers: ["Black-Eyed White Anemones", "Snowball Viburnum", "Dusty Miller", "Queen Anne's Lace"],
    season: ["winter", "spring"],
    scentProfile: "Frosted Botanical Greenery & Subtle White Tea",
    vaseLife: "7–10 Days",
    occasion: ["sympathy", "everyday"],
    color: "soft-cream",
    colorLabel: "Soft Cream",
    bestseller: false,
    rating: 4.91,
    reviewsCount: 44,
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '14 stems', price: 65 },
      { id: 'signature', name: 'Signature', stems: '22 stems', price: 85, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '34 stems', price: 125 }
    ],
    vaseIncluded: "Ceramic Biscuit Pitcher available (+$24)"
  },
  {
    id: 'sage-solace',
    name: "Sage & Solace",
    subtitle: "Eucalyptus globulus, green hellebores, hypericum & white lilac",
    price: 92,
    description: "A calming botanical sanctuary in a bouquet. Focused on rich green textures, fresh herbal scent profiles, and cool understated elegance that soothes the spirit.",
    flowers: ["Spiral Eucalyptus", "Green Hellebores", "White Lilac", "Green Hypericum Berries"],
    season: ["autumn", "winter"],
    scentProfile: "Camphorous Eucalyptus & Forest Hellebore Moss",
    vaseLife: "10–14 Days",
    occasion: ["sympathy", "everyday", "birthdays"],
    color: "sage-wild",
    colorLabel: "Sage & Wild",
    bestseller: false,
    rating: 4.89,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: [
      { id: 'petite', name: 'Petite', stems: '15 stems', price: 72 },
      { id: 'signature', name: 'Signature', stems: '24 stems', price: 92, isDefault: true },
      { id: 'grand', name: 'Grand Luxury', stems: '38 stems', price: 135 }
    ],
    vaseIncluded: "Fluted Sage Ceramic Vessel available (+$26)"
  }
];

export const HARVEST_SEASONS = [
  {
    id: 'all',
    name: 'Full Botanical Year',
    months: 'Year-Round Harvest',
    subtitle: 'Explore our complete seasonal floral calendar',
    isCurrent: false
  },
  {
    id: 'spring',
    name: 'Spring Atelier',
    months: 'March – May',
    subtitle: 'Tender blossoms awakened by morning dew & soft sunlight',
    isCurrent: false,
    accent: 'dusty-pink'
  },
  {
    id: 'summer',
    name: 'Summer Solstice',
    months: 'June – August',
    subtitle: 'Sun-drenched meadow wildflowers & aromatic Mediterranean herbs',
    isCurrent: false,
    accent: 'sage-wild'
  },
  {
    id: 'autumn',
    name: 'Autumn Harvest',
    months: 'September – November',
    subtitle: 'CURRENT PEAK SEASON • Rich velvety wine dahlias, protea & dark berries',
    isCurrent: true,
    accent: 'muted-berry'
  },
  {
    id: 'winter',
    name: 'Winter Serenade',
    months: 'December – February',
    subtitle: 'Sculptural porcelain roses, frosted anemones & silvered eucalyptus',
    isCurrent: false,
    accent: 'soft-cream'
  }
];

export const HARVEST_BLOOMS = [
  {
    id: 'dahlia',
    name: 'Chocolate Dahlia',
    botanicalName: 'Dahlia pinnata',
    season: 'autumn',
    peakWindow: 'September – November (Peak Now)',
    isPeakNow: true,
    scent: 'Dark cacao & velvety moss',
    vaseLife: '7–9 Days',
    summary: 'Lush architectural heads in intoxicating deep burgundy and plum hues.',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Chocolate Dahlia',
    matchingBouquets: ['velvet-twilight']
  },
  {
    id: 'protea',
    name: 'King Protea',
    botanicalName: 'Protea cynaroides',
    season: 'autumn',
    peakWindow: 'September – November (Peak Now)',
    isPeakNow: true,
    scent: 'Subtle sweet honey nectar',
    vaseLife: '12–16 Days',
    summary: 'The grand crown of our autumn atelier with velvety pink bracts.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'King Protea',
    matchingBouquets: ['elysian-garden']
  },
  {
    id: 'hellebore',
    name: 'Plum & Green Hellebores',
    botanicalName: 'Helleborus orientalis',
    season: 'autumn',
    peakWindow: 'September – January (Peak Now)',
    isPeakNow: true,
    scent: 'Earthy woodland greens',
    vaseLife: '8–12 Days',
    summary: 'Gracefully nodding bell-shaped blooms with dusky moody undertones.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Hellebore',
    matchingBouquets: ['velvet-twilight', 'sage-solace']
  },
  {
    id: 'peonies',
    name: 'Duchesse Peonies',
    botanicalName: 'Paeonia lactiflora',
    season: 'spring',
    peakWindow: 'May – July',
    isPeakNow: false,
    scent: 'Classic sweet rosewater',
    vaseLife: '6–8 Days',
    summary: 'Sensual multi-petaled cloud blooms that open into magnificent billowing rosettes.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Peonies',
    matchingBouquets: ['aurore-rose', 'elysian-garden']
  },
  {
    id: 'ranunculus',
    name: 'French Ranunculus',
    botanicalName: 'Ranunculus asiaticus',
    season: 'spring',
    peakWindow: 'March – May & Winter',
    isPeakNow: false,
    scent: 'Mild dewy meadow flora',
    vaseLife: '8–11 Days',
    summary: 'Tight concentric petals arranged in mesmerizing geometric perfection.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Ranunculus',
    matchingBouquets: ['aurore-rose', 'seraphina-botanical', 'blush-whisper']
  },
  {
    id: 'garden-roses',
    name: 'Heirloom Garden Roses',
    botanicalName: 'Rosa damascena',
    season: 'summer',
    peakWindow: 'June – October',
    isPeakNow: true,
    scent: 'Intoxicating antique perfume',
    vaseLife: '7–10 Days',
    summary: 'Ruffled romantic heads with hundred-petaled hearts that perfume any space.',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Roses',
    matchingBouquets: ['aurore-rose', 'seraphina-botanical', 'elysian-garden', 'blush-whisper']
  },
  {
    id: 'lavender-herbs',
    name: 'French Lavender & Wild Sage',
    botanicalName: 'Lavandula angustifolia',
    season: 'summer',
    peakWindow: 'June – September',
    isPeakNow: false,
    scent: 'Calming Mediterranean herbal oils',
    vaseLife: '10–14 Days',
    summary: 'Textural aromatic sprigs harvested in Provence that soothe the senses.',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Lavender',
    matchingBouquets: ['provencal-meadow']
  },
  {
    id: 'anemones',
    name: 'Black-Eyed Anemones',
    botanicalName: 'Anemone coronaria',
    season: 'winter',
    peakWindow: 'November – March',
    isPeakNow: false,
    scent: 'Clean cold winter morning',
    vaseLife: '7–10 Days',
    summary: 'Crisp porcelain-white petals framing an alluring midnight-indigo center.',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80',
    flowerQuery: 'Anemone',
    matchingBouquets: ['sylvan-grace']
  }
];

export const COLLECTIONS = [
  {
    id: 'birthdays',
    title: 'Birthday Celebrations',
    subtitle: 'Vibrant, joyful & fragrant stems',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    count: '6 Bouquets'
  },
  {
    id: 'anniversaries',
    title: 'Anniversary Romance',
    subtitle: 'Lush garden roses & deep passion',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    count: '5 Bouquets'
  },
  {
    id: 'sympathy',
    title: 'Grace & Sympathy',
    subtitle: 'Gentle whites, soft cream & peaceful greenery',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    count: '4 Bouquets'
  },
  {
    id: 'everyday',
    title: 'Everyday Atelier',
    subtitle: 'Fresh table blooms for calm living',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
    count: '7 Bouquets'
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
}
