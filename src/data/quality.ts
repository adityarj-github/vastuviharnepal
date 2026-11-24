export interface QualityStat {
  value: string;
  label: string;
}

export interface QualitySubItem {
  title: string;
  description: string;
}

export interface QualityTechItem {
  id: string;
  tag: string;
  brand: string;
  title: string;
  shortTitle: string;
  summary: string;
  shortSummary?: string;
  details: string[];
  subItems?: QualitySubItem[];
  image: string;
  stats: [QualityStat, QualityStat];
}

export interface QualitySectionData {
  smallHeading: string;
  boldDescription: string;
  cta: {
    label: string;
    href: string;
  };
  technologies: QualityTechItem[];
}

export const qualitySectionData: QualitySectionData = {
  smallHeading: "Construction Quality",
  boldDescription:
    "Engineered with self-healing bio-concrete, thermal insulation, and zero-emission green energy for homes built to last generations.",
  cta: {
    label: "Explore All Technologies",
    href: "/technology",
  },
  technologies: [
    {
      id: "calcifying-microbe",
      tag: "bio-concrete",
      brand: "Vastu Vihar R&D",
      title: "Robust Calcifying Microbe for Enhanced Lifespan of Concrete Structure",
      shortTitle: "Self-Healing Bio-Concrete",
      summary:
        "Alkaline-adapted Bacillus pasteurii precipitates calcite inside concrete (MICP), self-healing micro-cracks, cutting porosity, and protecting RCC.",
      details: [
        "Bacillus pasteurii (previously known as Sporosarcina pasteurii) is a bacterium renowned for its ability to precipitate calcium and solidify sand when provided with a calcium source and urea. This process, known as microbiologically induced calcite precipitation (MICP), is a form of biological cementation.",
        "At Vastu Vihar's Research Team, we have successfully isolated and trained Bacillus pasteurii from alkaline soil found in cow farms, specifically in urine-rich areas. This strain has been adapted to thrive at a pH of 12 in tropical conditions. It secretes a cementitious material that facilitates self-healing in concrete, effectively reducing the need for external repairs. We have also induced genetic modifications to enhance calcium carbonate secretion at high pH levels.",
        "The integration of Bacillus pasteurii as an admixture in concrete has shown no negative impact on the slump or initial setting time. Its lifespan of approximately 200 years, coupled with its resilience to extreme temperature and pressure, makes it ideal for long-lasting concrete structures. Through MICP, the bacteria help repair cracks and strengthen the concrete by precipitating calcite, filling voids and reducing porosity, which enhances structural strength by up to 30%. Additionally, it shortens both the initial and final setting times of cement, reduces permeability, and lowers cement consumption, all while increasing the durability of the structure.",
      ],
      image: "/quality/self-healing.png",
      stats: [
        { value: "200+", label: "YEARS LIFESPAN" },
        { value: "+30%", label: "STRENGTH BOOST" },
      ],
    },
    {
      id: "welded-wire-girder",
      tag: "structural",
      brand: "Vastu Vihar R&D",
      title: "Welded Wire Girder",
      shortTitle: "Welded Wire Girder",
      summary:
        "High-efficiency shear connectors transfer loads cleanly across insulated panels, eliminating high-stress points and handling thermal expansion.",
      details: [
        "The welded wire girder is a highly effective shear connector, ensuring proper load transfer between concrete panels. By eliminating solid concrete sections across the entire panel, this method reduces high-stress points, thermal inconsistencies, and moisture issues, resulting in a more efficient, cost-effective insulated wall panel.",
        "Most importantly, the welded wire girder accommodates the expansion and contraction of the outer width due to thermal fluctuations, ensuring the integrity of the structure.",
      ],
      image: "/quality/wire-girder.webp",
      stats: [
        { value: "100%", label: "LOAD TRANSFER" },
        { value: "0", label: "THERMAL BRIDGING" },
      ],
    },
    {
      id: "insulated-walls",
      tag: "thermal walls",
      brand: "Vastu Vihar R&D",
      title: "Insulated Walls (4 Inch & 8 Inch)",
      shortTitle: "Insulated Rat-Trap Walls",
      summary:
        "Vertical brick masonry creates an 80–100 mm insulating air cavity with the full strength of a 230 mm wall while keeping interiors naturally cool.",
      shortSummary: "Cavity brick walls providing natural thermal insulation.",
      details: [
        "Our walls are constructed using the rat-trap bond technique, where bricks are placed vertically rather than horizontally, creating a cavity within the wall. This cavity, measuring 80–100 mm, reduces material use while maintaining the strength equivalent to that of a standard 230 mm thick brick wall. The staggered headers and stretchers in each layer further enhance structural strength.",
        "This method offers significant material savings—about 25% fewer bricks—and reduces overall construction costs by approximately 26% compared to traditional 230 mm walls. The air pockets formed between the brick layers also improve thermal comfort, especially in tropical climates, by acting as natural insulators.",
      ],
      image: "/quality/thermal-walls.jpeg",
      stats: [
        { value: "25%", label: "FEWER BRICKS" },
        { value: "26%", label: "COST SAVINGS" },
      ],
    },
    {
      id: "insulated-roofs",
      tag: "cooling",
      brand: "Vastu Vihar R&D",
      title: "Insulated Roofs",
      shortTitle: "Insulated Filler-Slab Roofs",
      summary:
        "Filler materials placed strategically in the slab tension zone cut downward heat transmission for a noticeably cooler indoor environment.",
      details: [
        "Our roofs are designed using filler slabs, where filler material is strategically placed in the tension zone to enhance insulation. This technique reduces heat transmission, ensuring a cooler indoor environment.",
      ],
      image: "/quality/insulated-roofs.webp",
      stats: [
        { value: "Filler", label: "SLAB TECHNOLOGY" },
        { value: "Cool", label: "INDOOR COMFORT" },
      ],
    },
    {
      id: "prefab-roofs",
      tag: "pre-fab",
      brand: "Vastu Vihar R&D",
      title: "Pre Fab Roofs",
      shortTitle: "Pre-Fab Leak-Proof Roofs",
      summary:
        "Corrosion-resistant pre-fabricated roofing panels block leaks, reduce heat transmission by 8 – 12 degrees, and dampen rain noise.",
      details: [
        "We utilize pre-fabricated, leak-proof roofing panels for commercial, educational, and residential buildings. These panels are designed to withstand the elements, reduce heat transmission by 8–12 degrees, and minimize noise from rain. They are corrosion-resistant, durable, and aesthetically appealing, making them a cost-effective roofing solution requiring minimal maintenance.",
      ],
      image: "/quality/prefab-roofs.webp",
      stats: [
        { value: "8 - 12°C", label: "HEAT REDUCTION" },
        { value: "100%", label: "LEAK-PROOF" },
      ],
    },
    {
      id: "green-energy",
      tag: "green energy",
      brand: "Vastu Vihar R&D",
      title: "Green Energy",
      shortTitle: "Solar Moving Roofs & Clean Systems",
      summary:
        "Sun-tracking Solar Moving Roofs, Solar Roof Lights, Solar ACs, and Solar Water & Room Heaters cut grid reliance and carbon footprint.",
      shortSummary: "Sun-tracking solar roofs and clean non-polluting energy.",
      details: [
        "At Vastu Vihar, we strive to minimize our carbon footprint by incorporating environmentally friendly, non-polluting energy solutions in our projects.",
      ],
      subItems: [
        {
          title: "Solar Moving Roof",
          description:
            "These roofs rotate throughout the day to capture maximum sunlight, ensuring optimal electricity generation.",
        },
        {
          title: "Solar Roof Light",
          description: "LED bulbs powered by solar energy illuminate homes.",
        },
        {
          title: "Solar AC",
          description:
            "Our solar-powered air conditioners regulate indoor temperatures without relying on grid power.",
        },
        {
          title: "Solar Water And Room Heater",
          description:
            "Solar-powered systems provide hot water and heating, further reducing reliance on conventional energy sources.",
        },
      ],
      image: "/quality/green-energy.jpeg",
      stats: [
        { value: "4-in-1", label: "SOLAR SYSTEMS" },
        { value: "360°", label: "SUN TRACKING" },
      ],
    },
    {
      id: "voc-free",
      tag: "healthy air",
      brand: "Vastu Vihar R&D",
      title: "VOC Free Construction",
      shortTitle: "VOC-Free Construction",
      summary:
        "Specialized low-emission construction methods eliminate volatile organic compounds during building for cleaner, healthier indoor air.",
      details: [
        "We have developed techniques to eliminate volatile organic compounds (VOCs) generated during construction, ensuring a healthier living environment.",
      ],
      image: "/quality/self-healing.jpeg",
      stats: [
        { value: "0%", label: "TOXIC VOCs" },
        { value: "Pure", label: "INDOOR AIR" },
      ],
    },
    {
      id: "bio-sanitation",
      tag: "eco sanitation",
      brand: "Vastu Vihar R&D",
      title: "Micro-Organisms Based Sanitation System",
      shortTitle: "Bio-Sanitation System",
      summary:
        "R&D-pioneered microbial waste breakdown system that stays self-sustaining over time with zero periodic emptying required.",
      details: [
        "Our R&D team has pioneered a sanitation system that harnesses microorganisms to break down waste. This system requires no periodic emptying and remains fully functional over time, making it a sustainable and cost-effective solution.",
      ],
      image: "/quality/thermal-walls.jpeg",
      stats: [
        { value: "0", label: "EMPTYING NEEDED" },
        { value: "24/7", label: "BIO-DIGESTION" },
      ],
    },
  ],
};