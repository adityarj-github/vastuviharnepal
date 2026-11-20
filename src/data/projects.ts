export interface ProjectStat {
  label: string;
  value: string | number;
  unit?: string;
}

export interface ProjectLayout {
  type: "2D" | "3D";
  url: string;
  label: string;
}

export interface AreaBreakdownItem {
  room: string;
  dimensions: string;
  features: string;
}

export interface AreaBreakdownCategory {
  categoryName: string;
  items: AreaBreakdownItem[];
}

export interface ProjectModelType {
  id: string;
  modelName: string;
  stats: ProjectStat[];
  layouts: ProjectLayout[];
  areaBreakdown: AreaBreakdownCategory[];
}

export interface ProjectItem {
  slug: string;
  name: string;
  price?: string;
  minPrice?: number;
  maxPrice?: number;
  description: string;
  youtubeId?: string;
  features: string[];
  benefits: string[];
  gallery: string[];
  modelTypes: ProjectModelType[];
}

export const RAFT_FOUNDATION_BENEFITS = [
  "Raft foundations are constructed at shallow depths, requiring less excavation.",
  "They are well-suited for soils with low bearing capacity.",
  "The loads from the superstructure are redistributed across the entire area.",
  "Differential settlement of the soil is minimized.",
];

export const projectsData: Record<string, ProjectItem> = {
  "pashupati-bungalow": {
    slug: "pashupati-bungalow",
    name: "Pashupati Bungalow",
    description: "Thoughtfully designed spaces for modern living.",
    features: ["3 BHK PREMIUM LIVING", "G+1 BUNGALOW", "DEDICATED PARKING"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-pashupati-960.webp",
      "/Properties/model-pashupati.webp",
      "/Properties/model-pashupati-1440.webp",
    ],
    modelTypes: [
      {
        id: "pashupati-default",
        modelName: "3 BHK (G+1)",
        stats: [
          { label: "Builtup Area", value: 1460, unit: "Sqft" },
          { label: "Plot Area", value: 1540, unit: "Sqft" },
          { label: "Carpet Area", value: 1156, unit: "Sqft" },
          { label: "Bedrooms", value: 2 },
          { label: "Bathroom", value: 2 },
          { label: "HALL", value: 1 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: "G+1" },
        ],
        layouts: [
          { type: "2D", url: "/Properties/pashupati_2d_floor_plan.webp", label: "2D Floor Plan" },
          { type: "3D", url: "/Properties/pashupati-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "kanchanjunga-bungalow": {
    slug: "kanchanjunga-bungalow",
    name: "Kanchanjunga Bungalow",
    description: "A peaceful lifestyle surrounded by greenery.",
    features: ["5 BHK VILLA COLLECTION", "G+1 DUPLEX LIVING", "2 PARKING SPACES"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-kanchanjunga-960.webp",
      "/Properties/model-kanchanjunga.webp",
      "/Properties/model-kanchanjunga-1440.webp",
    ],
    modelTypes: [
      {
        id: "kanchanjunga-default",
        modelName: "5 BHK (G+1)",
        stats: [
          { label: "Builtup Area", value: 2450, unit: "Sqft" },
          { label: "Plot Area", value: 1800, unit: "Sqft" },
          { label: "Carpet Area", value: 1680, unit: "Sqft" },
          { label: "Bedrooms", value: 5 },
          { label: "Bathroom", value: 4 },
          { label: "Kitchen", value: 2 },
          { label: "Parking Place", value: 2 },
          { label: "Floors", value: "G+1" },
        ],
        layouts: [
          { type: "2D", url: "/Properties/Kanchanjunga_2d_floor_plan.webp", label: "2D Floor Plan" },
          { type: "3D", url: "/Properties/kanchanjunga-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "sagarmatha-bungalow": {
    slug: "sagarmatha-bungalow",
    name: "Sagarmatha Bungalow",
    description: "Space to create a home of your own.",
    features: ["5 BHK RESIDENCE", "G+2 STRUCTURE", "3 OPEN KITCHENS"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-sagarmatha-960.webp",
      "/Properties/model-sagarmatha.webp",
      "/Properties/model-sagarmatha-1440.webp",
    ],
    modelTypes: [
      {
        id: "sagarmatha-default",
        modelName: "5 BHK (G+2)",
        stats: [
          { label: "Builtup Area", value: 2285, unit: "Sqft" },
          { label: "Plot Area", value: 1600, unit: "Sqft" },
          { label: "Carpet Area", value: 1730, unit: "Sqft" },
          { label: "Bedrooms", value: 5 },
          { label: "Bathroom", value: 5 },
          { label: "Open Kitchen", value: 3 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: "G+2" },
        ],
        layouts: [
          { type: "2D", url: "/Properties/sagarmatha_2d_floor_plan.webp", label: "2D Floor Plan" },
          { type: "3D", url: "/Properties/sagarmatha-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "suryodaya-bungalow": {
    slug: "suryodaya-bungalow",
    name: "Suryodaya Bungalow",
    description: "A considered approach to contemporary living.",
    features: ["7 BHK MODERN RESIDENCE", "G+1 GRAND LAYOUT", "DRAWING / OFFICE SPACE"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-suryodaya-960.webp",
      "/Properties/model-suryodaya.webp",
      "/Properties/model-suryodaya-1440.webp",
    ],
    modelTypes: [
      {
        id: "suryodaya-default",
        modelName: "7 BHK (G+1)",
        stats: [
          { label: "Builtup Area", value: 3700, unit: "Sqft" },
          { label: "Plot Area", value: 2800, unit: "Sqft" },
          { label: "Carpet Area", value: 2817, unit: "Sqft" },
          { label: "Bedrooms", value: 7 },
          { label: "Bathroom", value: 4 },
          { label: "Drawing / Office", value: 1 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: "G+1" },
        ],
        layouts: [
          { type: "2D", url: "/Properties/suryodaya_2d_floor_plan.webp", label: "2D Floor Plan" },
          { type: "3D", url: "/Properties/suryodaya-7bhk-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "simplex-bungalow": {
    slug: "simplex-bungalow",
    name: "Simplex Bungalow",
    description: "A community shaped around space and nature.",
    features: ["2 BHK COMMUNITY LIVING", "SINGLE FLOOR SIMPLEX", "DEDICATED PARKING"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-simplex-960.webp",
      "/Properties/model-simplex.webp",
      "/Properties/model-simplex-1440.webp",
    ],
    modelTypes: [
      {
        id: "simplex-default",
        modelName: "2 BHK (1 Floor)",
        stats: [
          { label: "Builtup Area", value: 850, unit: "Sqft" },
          { label: "Plot Area", value: 1400, unit: "Sqft" },
          { label: "Carpet Area", value: 650, unit: "Sqft" },
          { label: "Bedrooms", value: 2 },
          { label: "Bathroom", value: 2 },
          { label: "Toilet", value: 1 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: 1 },
        ],
        layouts: [
          { type: "3D", url: "/Properties/simplex-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "small-suryodaya-bungalow": {
    slug: "small-suryodaya-bungalow",
    name: "Small Suryodaya Bungalow",
    description: "A community shaped around space and nature.",
    features: ["5 BHK COMMUNITY LIVING", "SINGLE FLOOR LAYOUT", "DRAWING / OFFICE SPACE"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-small-suryodaya-960.webp",
      "/Properties/model-small-suryodaya.webp",
      "/Properties/model-small-suryodaya-1440.webp",
    ],
    modelTypes: [
      {
        id: "small-suryodaya-default",
        modelName: "5 BHK (1 Floor)",
        stats: [
          { label: "Builtup Area", value: 2230, unit: "Sqft" },
          { label: "Plot Area", value: 2410, unit: "Sqft" },
          { label: "Carpet Area", value: 2450, unit: "Sqft" },
          { label: "Bedrooms", value: 5 },
          { label: "Bathroom", value: 4 },
          { label: "Drawing / Office", value: 1 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: 1 },
        ],
        layouts: [
          { type: "2D", url: "/Properties/small_suryodaya.webp", label: "2D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },

  "bagmati-bungalow": {
    slug: "bagmati-bungalow",
    name: "Bagmati Bungalow",
    description: "A community shaped around space and nature.",
    features: ["4 BHK COMMUNITY LIVING", "G+1 BUNGALOW", "DRAWING / OFFICE SPACE"],
    benefits: RAFT_FOUNDATION_BENEFITS,
    gallery: [
      "/Properties/model-bagmati-960.webp",
      "/Properties/model-bagmati.webp",
      "/Properties/model-bagmati-1440.webp",
    ],
    modelTypes: [
      {
        id: "bagmati-default",
        modelName: "4 BHK (G+1)",
        stats: [
          { label: "Builtup Area", value: 2250, unit: "Sqft" },
          { label: "Plot Area", value: 1463, unit: "Sqft" },
          { label: "Carpet Area", value: 1740, unit: "Sqft" },
          { label: "Bedrooms", value: 4 },
          { label: "Bathroom", value: 4 },
          { label: "Drawing / Office", value: 1 },
          { label: "Parking Place", value: 1 },
          { label: "Floors", value: "G+1" },
        ],
        layouts: [
          { type: "2D", url: "/Properties/bagmati_2d_floor_plan.webp", label: "2D Floor Plan" },
          { type: "3D", url: "/Properties/bagmati-3d.webp", label: "3D Floor Plan" },
        ],
        areaBreakdown: [],
      },
    ],
  },
};

export const projectsList: ProjectItem[] = Object.values(projectsData);