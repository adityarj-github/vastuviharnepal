export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogContentSection {
  heading?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  quote?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Engineering" | "Township Living" | "Architecture & Vastu" | "Investment & Real Estate" | "Sustainability";
  publishedDate: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  featured?: boolean;
  author: BlogAuthor;
  tags: string[];
  keyTakeaways: string[];
  sections: BlogContentSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "monolithic-rcc-construction-nepal",
    title: "Monolithic RCC Construction: Why Nepal's Future Homes Must Be Cast as Single-Pour Structures",
    excerpt:
      "Explore how monolithic reinforced concrete construction provides unmatched earthquake resilience, eliminating joint vulnerabilities common in traditional brick-and-mortar builds.",
    category: "Engineering",
    publishedDate: "Nov 18, 2026",
    readTime: "5 min read",
    coverImage: "/quality/wire-girder.webp",
    coverImageAlt: "Monolithic RCC wire girder and reinforced formwork",
    featured: true,
    author: {
      name: "Er. Bikash Thapa",
      role: "Chief Structural Engineer",
    },
    tags: ["Monolithic RCC", "Earthquake Resilience", "Engineering", "Structural Integrity"],
    keyTakeaways: [
      "Monolithic construction pours slabs and walls simultaneously, eliminating structural cold joints.",
      "Box-action structural behavior dissipates seismic shock waves uniformly throughout the entire building.",
      "Eliminates plastering cracks and dampness penetration, ensuring 100+ years of structural longevity.",
    ],
    sections: [
      {
        heading: "The Seismic Challenge in Nepal's Residential Landscape",
        paragraphs: [
          "Nepal sits on one of the most active tectonic fault lines in the world. For decades, conventional residential construction has relied on reinforced concrete column-and-beam frames filled in with unreinforced brick masonry. While ubiquitous, this approach introduces hundreds of weak interface joints where masonry meets concrete.",
          "During severe seismic shaking, non-structural infill walls frequently crack or shear out of plane, creating catastrophic structural hazards. Monolithic construction completely re-engineers this equation by casting foundations, walls, and slabs into a single, continuous, box-type reinforced concrete envelope.",
        ],
      },
      {
        heading: "How Single-Pour Monolithic Pouring Works",
        paragraphs: [
          "In Vastu Vihar Nepal's construction methodology, high-precision modular aluminum and steel formwork forms the entire 3D shell of the bungalow. Reinforcement steel cages with wire girders are positioned continuously across both vertical shear walls and horizontal floor diaphragms.",
          "Ready-mix concrete with specialized self-compacting polymers is poured in a continuous, single operation. As the concrete cures together, there are no cold joints, no air pockets, and no structural seams between walls and floors.",
        ],
        bulletPoints: [
          "Box-Action Resilience: The entire house behaves as an integrated, monolithic shear-wall box during seismic oscillations.",
          "Zero Leakage Seams: Eliminates water seepage paths between brick mortar joints and concrete frames.",
          "Thermal Mass Efficiency: Dense concrete walls provide natural thermal dampening against extreme outside weather.",
        ],
        quote:
          "A monolithic home does not resist earthquake energy with isolated pillars—the entire structure absorbs, distributes, and neutralizes vibration as a singular whole.",
      },
      {
        heading: "Longevity and Sustainable Performance",
        paragraphs: [
          "Beyond seismic safety, monolithic buildings require zero exterior plaster maintenance and will not suffer from structural mortar degradation over decades. For Nepalese families investing in a generational home, this technology transforms safety from a hope into an engineering certainty.",
        ],
      },
    ],
  },
  {
    id: "post-2",
    slug: "rise-of-planned-townships-nepal",
    title: "The Rise of Planned Gated Townships in Nepal: Community, Security & Open Spaces",
    excerpt:
      "Why families in Birtamode, Birgunj, and the Terai are trading standalone plots for integrated residential townships with private roads, parks, and clubhouses.",
    category: "Township Living",
    publishedDate: "Nov 12, 2026",
    readTime: "4 min read",
    coverImage: "/Images/hero.webp",
    coverImageAlt: "Planned gated residential township overview",
    featured: true,
    author: {
      name: "Sunita Shrestha",
      role: "Township Urban Planner",
    },
    tags: ["Township Living", "Community", "Security", "Urban Planning"],
    keyTakeaways: [
      "Integrated masterplans dedicate over 35% of space to roads, parks, and recreational open green spaces.",
      "Multi-tiered 24/7 security, CCTV surveillance, and controlled gate access guarantee family peace of mind.",
      "Underground cabling, dedicated stormwater drainage, and backup power eliminate unplanned urban chaos.",
    ],
    sections: [
      {
        heading: "Moving Beyond Standalone Plot Frustrations",
        paragraphs: [
          "Historically, building a home in Nepal meant purchasing an individual plot on an unplanned narrow lane, negotiating with individual utility contractors, and dealing with unpredictable neighboring constructions. Roads often deteriorated quickly, and open green space was virtually non-existent.",
          "Today, a quiet revolution in homeownership is taking place. Modern families increasingly demand planned communities where infrastructure, green spaces, and neighborhood safety are engineered from day one.",
        ],
      },
      {
        heading: "The Anatomy of a Modern Masterplan",
        paragraphs: [
          "In townships such as Vastu Vihar Birtamode and Birgunj, masterplans are developed with wide 30-to-40-foot main boulevards, dedicated pedestrian sidewalks, underground electric cabling, and independent water filtration plants.",
          "Children can play safely in dedicated landscaped parks away from high-speed arterial city traffic, while senior citizens enjoy tranquil walking tracks and meditation gazebos.",
        ],
        bulletPoints: [
          "3-Tier Gated Security with 24/7 guard personnel and perimeter CCTV monitoring.",
          "Central Clubhouse featuring community banquet halls, fitness centers, and sports courts.",
          "Proactive Facility Management taking care of street lighting, gardening, and waste disposal.",
        ],
        quote:
          "You are not merely buying a set of brick walls—you are investing in the environment, the neighborhood, and the collective quality of life your family will enjoy for decades.",
      },
      {
        heading: "A New Standard for Growing Cities",
        paragraphs: [
          "As regional centers across Nepal experience rapid economic and demographic growth, master-planned townships represent the gold standard of sustainable urban development, shielding residents from municipal overcrowding.",
        ],
      },
    ],
  },
  {
    id: "post-3",
    slug: "vastu-shastra-modern-architecture",
    title: "Harmonizing Ancient Vastu Shastra with Contemporary Monolithic Architecture",
    excerpt:
      "How solar orientation, spatial air circulation, and directional energies can seamlessly merge with clean minimalist layouts and state-of-the-art concrete finishes.",
    category: "Architecture & Vastu",
    publishedDate: "Nov 05, 2026",
    readTime: "6 min read",
    coverImage: "/career/arch.jpeg",
    coverImageAlt: "Architects integrating Vastu guidelines with modern 3D floor plans",
    featured: false,
    author: {
      name: "Acharya D. N. Sharma",
      role: "Vastu & Spatial Design Consultant",
    },
    tags: ["Vastu Shastra", "Modern Architecture", "Design Philosophy", "Spatial Harmony"],
    keyTakeaways: [
      "Vastu Shastra is fundamentally grounded in solar paths, natural magnetic poles, and cross-ventilation aerodynamics.",
      "Modern monolithic architecture provides complete design freedom to optimize room orientations without bulky column protrusions.",
      "The intersection of Vastu with modern design creates homes that feel bright, spacious, and energetically balanced.",
    ],
    sections: [
      {
        heading: "De-mystifying Vastu Shastra as Scientific Architecture",
        paragraphs: [
          "Far from being mere superstition, traditional Vastu Shastra was ancient India and Nepal's empirical science of solar climatology, wind path dynamics, and geomagnetism. The rules were formulated to maximize sunlight during winter mornings, ensure shade during harsh summer afternoons, and establish prevailing airflow.",
          "When combined with contemporary architectural sensibilities—such as floor-to-ceiling glass apertures, double-height living areas, and open floor plans—Vastu principles elevate both the health and aesthetic enjoyment of a residence.",
        ],
      },
      {
        heading: "Directional Alignments in Vastu Vihar Bungalow Models",
        paragraphs: [
          "Every bungalow model at Vastu Vihar Nepal—from the Simplex to the 7-BHK Suryodaya—is conceptualized around the primary directional cardinal points (Ishanya, Agneya, Nairutya, Vayavya).",
        ],
        bulletPoints: [
          "Northeast (Ishanya): Kept open, bright, and serene—ideal for meditation corners, home libraries, and prayer sanctuaries.",
          "Southeast (Agneya): Dedicated to the Agni (fire) element, positioning modern modular kitchens for optimal morning sunshine and ventilation.",
          "Southwest (Nairutya): The Earth element zone, perfectly engineered for master suites to foster stability, strength, and restful sleep.",
          "Northwest (Vayavya): The air movement quadrant, hosting guest suites and bright family lounges with abundant breeze circulation.",
        ],
        quote:
          "When modern architecture respects natural solar rhythms, a house requires significantly less artificial cooling, remains naturally well-lit, and exudes an unmistakable sense of calm.",
      },
    ],
  },
  {
    id: "post-4",
    slug: "thermal-insulation-climate-responsive-roofing",
    title: "Thermal Insulation and Climate-Responsive Roofing in Eastern Nepal",
    excerpt:
      "Understanding temperature regulation in extreme Terai summers and Himalayan winters through lightweight aerated roof insulation and monolithic exterior envelopes.",
    category: "Sustainability",
    publishedDate: "Oct 28, 2026",
    readTime: "4 min read",
    coverImage: "/quality/thermal-walls.jpeg",
    coverImageAlt: "Thermal insulation layer and weather-resistant roofing system",
    featured: false,
    author: {
      name: "Er. Nitesh Acharya",
      role: "Materials & Sustainability Engineer",
    },
    tags: ["Thermal Insulation", "Energy Efficiency", "Green Building", "Materials"],
    keyTakeaways: [
      "Multi-layered roof insulation reduces peak indoor ceiling temperatures by up to 6°C to 8°C in hot summer months.",
      "Aerated concrete layers prevent thermal bridging, significantly cutting air conditioning electricity expenses.",
      "UV-reflective coatings shield the roof slab from thermal expansion fatigue, preventing roof micro-fractures.",
    ],
    sections: [
      {
        heading: "The Challenge of Terai Heat Waves",
        paragraphs: [
          "The southern plains and inner valleys of Nepal experience scorching summer temperatures exceeding 38°C, followed by cold winter drafts. In ordinary concrete slab buildings, solar radiation heat penetrates the roof, turning the upper bedrooms into uncomfortably hot ovens well into the late night.",
          "To counter this, Vastu Vihar employs a multi-tiered climate-responsive roofing assembly that actively reflects solar heat and provides high-density thermal dampening.",
        ],
      },
      {
        heading: "The Engineering Behind the Insulated Roof Deck",
        paragraphs: [
          "Rather than a bare concrete slab, the roof system incorporates an elastomeric waterproofing membrane overlaid with lightweight aerated thermal insulating screed and high-albedo reflective porcelain or terracotta tiles.",
          "This composite reduces the thermal transmittance (U-value) drastically, ensuring upper floors stay naturally cool during noon hours and comfortably warm on chilly winter nights.",
        ],
      },
    ],
  },
  {
    id: "post-5",
    slug: "buying-a-bungalow-in-nepal-checklist",
    title: "Buying a Bungalow in Nepal: A Complete Checklist for First-Time Homeowners",
    excerpt:
      "From land titles and municipal sanction drawings to structural warranties and bank financing, here is what every homebuyer must verify.",
    category: "Investment & Real Estate",
    publishedDate: "Oct 20, 2026",
    readTime: "7 min read",
    coverImage: "/Properties/hero.webp",
    coverImageAlt: "Homebuyer reviewing residential bungalow blueprint and property documentation",
    featured: false,
    author: {
      name: "Priya Karki",
      role: "Senior Client Advisory Lead",
    },
    tags: ["Homebuyer Guide", "Property Investment", "Legal Verification", "Checklist"],
    keyTakeaways: [
      "Always inspect the Lalpurja (Land Ownership Certificate) and verify clear, unencumbered municipal title clearance.",
      "Ensure the property holds an approved Naksa Paas (Municipal Building Blueprint Sanction) adhering to local FAR regulations.",
      "Look for institutional builders that offer formal structural warranty certificates and organized bank financing tie-ups.",
    ],
    sections: [
      {
        heading: "Navigating the Nepal Property Acquisition Journey",
        paragraphs: [
          "Purchasing a standalone residential bungalow is one of the most substantial emotional and financial investments a family will ever make. However, navigating land registration offices (Malpot), municipal planning permits, and quality verification can be daunting for first-time buyers.",
          "Having a structured verification checklist ensures that your dream home brings lasting prosperity rather than unforeseen legal or maintenance complications.",
        ],
      },
      {
        heading: "Key Due Diligence Checkpoints",
        paragraphs: [
          "Before executing any preliminary token advance or agreement, prospective buyers should systematically inspect five crucial document classes:",
        ],
        bulletPoints: [
          "Clear Title Record (Lalpurja & Tiro Receipt): Confirmation that the land is free of mortgage liens (Rokka) and historical disputes.",
          "Approved Municipal Masterplan & Naksa: Verification that setbacks, access road widths, and structural plans are sanctioned by the local municipality.",
          "Soil Investigation Report: Engineering confirmation that the soil bearing capacity matches the foundation design.",
          "Payment Milestones Tied to Construction: Ensuring that financial outlays are directly linked to visible casting and finishing milestones.",
          "Home Loan Tie-ups: Reputed commercial banks in Nepal (e.g. Nabil, NIC Asia, Global IME) independently audit developer projects before approving home loans.",
        ],
      },
    ],
  },
  {
    id: "post-6",
    slug: "green-living-master-planned-communities",
    title: "Green Living in Master-Planned Communities: Solar Integration and Rainwater Harvesting",
    excerpt:
      "How decentralized sewage treatment, rainwater recharge pits, and rooftop solar are built into modern Vastu Vihar community masterplans.",
    category: "Sustainability",
    publishedDate: "Oct 12, 2026",
    readTime: "5 min read",
    coverImage: "/quality/green-energy.jpeg",
    coverImageAlt: "Solar panel arrays and green landscaping in eco-friendly township",
    featured: false,
    author: {
      name: "S. Adhikari",
      role: "Infrastructure & Eco-Planning Lead",
    },
    tags: ["Green Living", "Solar Energy", "Rainwater Harvesting", "Eco Township"],
    keyTakeaways: [
      "Centralized rainwater harvesting recharge pits replenish local groundwater tables during monsoon seasons.",
      "Solar street lighting and hybrid solar infrastructure reduce common township electricity operational costs by up to 40%.",
      "Native tree canopy planting provides natural micro-climate cooling along all pedestrian boulevards.",
    ],
    sections: [
      {
        heading: "Eco-Conscious Infrastructure from the Ground Up",
        paragraphs: [
          "True sustainability cannot be an afterthought added onto a finished building—it must be woven into the masterplan layout before the first foundation trench is dug.",
          "Vastu Vihar Nepal's masterplans incorporate decentralized biological stormwater treatment, native tree plantations, and hybrid solar infrastructure designed to minimize environmental footprint.",
        ],
      },
      {
        heading: "Preserving Groundwater and Clean Energy",
        paragraphs: [
          "During torrential monsoon storms, millions of liters of pristine rainwater are directed into specialized percolation and recharge shafts rather than overloading municipal roadside culverts. This maintains high groundwater levels for the entire community year-round.",
        ],
      },
    ],
  },
];

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return blogPosts.slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map((post) => post.category));
  return ["All", ...Array.from(categories)];
}
