// ─── Types ───────────────────────────────────────────────────────────

export interface PriceListModel {
  name: string;
  config: string;
  landArea: number;
  carpetArea: number;
  builtupArea: number;
  luxuryCost: number;
  ooe: number;
}

export interface LocationPriceList {
  location: string;
  officeAddress: string;
  siteAddress: string;
  phone: string;
  effectiveFrom: string;
  effectiveTo: string;
  models: PriceListModel[];
}

export interface SpecificationItem {
  particular: string;
  luxury: string;
}

export interface PaymentStep {
  step: number;
  description: string;
}

export interface PaymentSchedule {
  type: "Simplex" | "G+1" | "G+2";
  steps: PaymentStep[];
}

export interface PriceListNote {
  id: number;
  text: string;
}

export interface PriceListData {
  companyName: string;
  locations: LocationPriceList[];
  specifications: SpecificationItem[];
  specDisclaimer: string;
  paymentSchedules: PaymentSchedule[];
  notes: {
    birtamode: PriceListNote[];
    birgunj: PriceListNote[];
  };
}

// ─── Data ────────────────────────────────────────────────────────────

export const priceListData: PriceListData = {
  companyName: "Technoculture Building Centre Pvt. Ltd.",

  /* ── Locations ─────────────────────────────────────────────────── */

  locations: [
    {
      location: "Birtamode",
      officeAddress:
        "211, 2nd Floor, Hanuman Central, Mukti Chowk, Birtamode, Jhaapa",
      siteAddress: "Charpani, Near Heaven's Water Park, Birtamode",
      phone: "9705191816",
      effectiveFrom: "01 April 2026",
      effectiveTo: "15 July 2026",
      models: [
        {
          name: "Suryoday 7 BHK",
          config: "G+1",
          landArea: 2800,
          carpetArea: 2820,
          builtupArea: 3700,
          luxuryCost: 16000000,
          ooe: 300000,
        },
        {
          name: "Suryoday 5 BHK",
          config: "G+1",
          landArea: 2230,
          carpetArea: 2240,
          builtupArea: 2900,
          luxuryCost: 12500000,
          ooe: 300000,
        },
        {
          name: "Kanchanjunga 5 BHK",
          config: "G+1",
          landArea: 1800,
          carpetArea: 1680,
          builtupArea: 2450,
          luxuryCost: 10600000,
          ooe: 250000,
        },
        {
          name: "Sagarmatha 5 BHK",
          config: "G+2",
          landArea: 1600,
          carpetArea: 1617,
          builtupArea: 2285,
          luxuryCost: 9700000,
          ooe: 200000,
        },
        {
          name: "Bagmati 4 BHK",
          config: "G+1",
          landArea: 1463,
          carpetArea: 1740,
          builtupArea: 2250,
          luxuryCost: 9600000,
          ooe: 200000,
        },
        {
          name: "Pashupati 3 BHK",
          config: "G+1",
          landArea: 1540,
          carpetArea: 1156,
          builtupArea: 1460,
          luxuryCost: 8000000,
          ooe: 200000,
        },
        {
          name: "Simplex 2 BHK",
          config: "G",
          landArea: 1413,
          carpetArea: 650,
          builtupArea: 850,
          luxuryCost: 6200000,
          ooe: 200000,
        },
        {
          name: "Spec. Bungalow 2BHK",
          config: "G",
          landArea: 1122,
          carpetArea: 585,
          builtupArea: 850,
          luxuryCost: 4000000,
          ooe: 200000,
        },
      ],
    },
    {
      location: "Birgunj",
      officeAddress:
        "Shop No-8, 2nd Floor, Aadarshnagar, Rungta Mall, Birgunj, Nepal",
      siteAddress: "Lukahi Mai, Laxmanwa, Birgunj, Nepal",
      phone: "9802591815",
      effectiveFrom: "01 April 2026",
      effectiveTo: "15 July 2026",
      models: [
        {
          name: "Suryoday 7 BHK",
          config: "G+1",
          landArea: 2800,
          carpetArea: 2820,
          builtupArea: 3700,
          luxuryCost: 14000000,
          ooe: 300000,
        },
        {
          name: "Suryoday 5 BHK",
          config: "G+1",
          landArea: 2230,
          carpetArea: 2240,
          builtupArea: 2900,
          luxuryCost: 11000000,
          ooe: 300000,
        },
        {
          name: "Kanchanjunga 5 BHK",
          config: "G+1",
          landArea: 1800,
          carpetArea: 1680,
          builtupArea: 2450,
          luxuryCost: 9000000,
          ooe: 250000,
        },
        {
          name: "Bagmati 4 BHK",
          config: "G+1",
          landArea: 1463,
          carpetArea: 1740,
          builtupArea: 2250,
          luxuryCost: 8000000,
          ooe: 200000,
        },
        {
          name: "Pashupati 3 BHK",
          config: "G+1",
          landArea: 1540,
          carpetArea: 1156,
          builtupArea: 1460,
          luxuryCost: 6500000,
          ooe: 200000,
        },
        {
          name: "Simplex 2 BHK",
          config: "G",
          landArea: 1413,
          carpetArea: 650,
          builtupArea: 850,
          luxuryCost: 5100000,
          ooe: 200000,
        },
      ],
    },
  ],

  /* ── Specifications ────────────────────────────────────────────── */

  specifications: [
    { particular: "Structure", luxury: "R.C.C. Frame" },
    { particular: "Wall", luxury: "5\" Brick Work" },
    { particular: "Flooring", luxury: "24\"x48\" Tiles" },
    { particular: "Wall Interior", luxury: "Wall Putty" },
    { particular: "Wall Exterior", luxury: "Wall Putty with Weather Coat" },
    { particular: "Bathroom Tiles", luxury: "12\"x18\" (Upto 7')" },
    { particular: "Kitchen Wall Tiles", luxury: "2' Height" },
    { particular: "Kitchen Top", luxury: "Granite" },
    { particular: "CP Fitting", luxury: "Branded" },
    { particular: "Door Frame", luxury: "Stone Frame" },
    { particular: "Door Shutter", luxury: "Flush Door" },
    { particular: "Windows", luxury: "UPVC" },
    { particular: "Stair Railing", luxury: "S.S. Railing" },
    { particular: "Stair Top", luxury: "Slab Marble" },
    { particular: "No. of AC Points", luxury: "Two Room" },
    { particular: "Electric Fitting", luxury: "Branded" },
  ],

  specDisclaimer:
    "Specification may be change in future due to unavailability of materials with mutual understanding.",

  /* ── Payment Schedules ─────────────────────────────────────────── */

  paymentSchedules: [
    {
      type: "Simplex",
      steps: [
        { step: 1, description: "Booking amount @ 15% of unit cost." },
        {
          step: 2,
          description:
            "Agreement @ 25% of Unit Cost within 30 Days from Booking.",
        },
        { step: 3, description: "19% of U/C at plinth level." },
        { step: 4, description: "19% of U/C at ground floor roof level." },
        { step: 5, description: "19% of U/C at start of finishing." },
        { step: 6, description: "03% of U/C before 30 days handover." },
      ],
    },
    {
      type: "G+1",
      steps: [
        { step: 1, description: "Booking Amount @ 10% of Unit Cost." },
        {
          step: 2,
          description:
            "Agreement @ 20% of unit cost within 30 days from Booking.",
        },
        { step: 3, description: "16% of U/C at plinth level." },
        { step: 4, description: "16% of U/C at ground floor roof level." },
        { step: 5, description: "16% of U/C at first floor roof level." },
        { step: 6, description: "16% of U/C at floor finishing start." },
        { step: 7, description: "06% of U/C 30 days before handover." },
      ],
    },
    {
      type: "G+2",
      steps: [
        { step: 1, description: "Booking Amount @ 10% of Unit Cost." },
        { step: 2, description: "Agreement @ 20% of unit cost." },
        { step: 3, description: "13% of U/C at plinth level." },
        { step: 4, description: "13% of U/C at ground floor roof level." },
        { step: 5, description: "13% of U/C at first floor roof level." },
        { step: 6, description: "13% of U/C at 2nd floor roof level." },
        { step: 7, description: "13% of U/C at floor finishing start." },
        { step: 8, description: "05% of U/C before 30 days handover." },
      ],
    },
  ],

  /* ── Notes ─────────────────────────────────────────────────────── */

  notes: {
    birtamode: [
      {
        id: 1,
        text: "All the agreement will be sign after payment of allotment amount i.e. after 30th days of payment.",
      },
      {
        id: 2,
        text: "Tax/GST will be applicable as per Govt. Norms.",
      },
      {
        id: 3,
        text: "Electricity Connection & Registry Cost will be actual basis bear by customer in OOE Expenses.",
      },
      {
        id: 4,
        text: "An additional 5% of the unit cost will be charged for corner plots.",
      },
      {
        id: 5,
        text: "The swimming pool cost will be charged separately at @ 10 lakhs.",
      },
      {
        id: 6,
        text: "All legal claims are Subject to Birtamode, Nepal Jurisdiction Only.",
      },
      {
        id: 7,
        text: "Other Operating Expenses (OOE) extra.",
      },
    ],
    birgunj: [
      {
        id: 1,
        text: "All the agreement will be sign after payment of allotment amount i.e. after 30th days of payment.",
      },
      {
        id: 2,
        text: "Tax/GST will be applicable as per Govt. Norms.",
      },
      {
        id: 3,
        text: "Electricity Connection & Registry Cost will be actual basis bear by customer.",
      },
      {
        id: 4,
        text: "An additional 5% of the unit cost will be charged for corner plots.",
      },
      {
        id: 5,
        text: "The swimming pool cost will be charged separately at @ 10 lakhs.",
      },
      {
        id: 6,
        text: "All legal claims are Subject to Birgunj-Nepal Jurisdiction Only.",
      },
      {
        id: 7,
        text: "Other Operating Expenses (OOE) extra.",
      },
    ],
  },
};

/* ── Convenience helpers ───────────────────────────────────────────── */

export function getLocationPriceList(
  location: "Birtamode" | "Birgunj"
): LocationPriceList | undefined {
  return priceListData.locations.find((l) => l.location === location);
}

export function getPaymentSchedule(
  type: "Simplex" | "G+1" | "G+2"
): PaymentSchedule | undefined {
  return priceListData.paymentSchedules.find((s) => s.type === type);
}

export function getNotesForLocation(
  location: "Birtamode" | "Birgunj"
): PriceListNote[] {
  return location === "Birtamode"
    ? priceListData.notes.birtamode
    : priceListData.notes.birgunj;
}
