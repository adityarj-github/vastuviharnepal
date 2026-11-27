export interface CareerImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface CareerPerk {
  id: string;
  title: string;
  description: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
}

export interface CareerSectionData {
  headingLine1: string;
  headingLine2: string;
  description: string;
  backgroundImage: CareerImage;
  cta: {
    label: string;
    href: string;
  };
  images: CareerImage[];
}

export interface CareerPageData {
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  perks: CareerPerk[];
  gallery: CareerImage[];
  openings: JobOpening[];
  directApplication: {
    title: string;
    description: string;
    email: string;
    phone: string;
  };
}

export const careerData: CareerSectionData = {
  headingLine1: "Build Your Career",
  headingLine2: "With Vastu Vihar",
  description:
    "Join a team of architects, engineers, and advisors shaping thoughtfully planned communities across Nepal.",
  backgroundImage: {
    src: "/career.webp",
    alt: "Vastu Vihar Nepal team and workplace",
  },
  cta: {
    label: "Join Our Team",
    href: "/career",
  },
  images: [
    {
      src: "/career/1.webp",
      alt: "Vastu Vihar Nepal architecture and planning team",
    },
    {
      src: "/career/2.webp",
      alt: "Engineers reviewing residential township blueprints",
    },
    {
      src: "/career/3.webp",
      alt: "Collaborative workspace at Vastu Vihar Nepal",
    },
    {
      src: "/career/4.webp",
      alt: "On-site township development and inspection",
    },
  ],
};

export const careerPageData: CareerPageData = {
  intro: {
    eyebrow: "Why Vastu Vihar Nepal",
    heading: "Where Engineering Meets Meaningful Impact",
    description:
      "At Vastu Vihar Nepal, we combine cutting-edge monolithic construction technology, sustainable master planning, and human-centric design to create communities that stand the test of time.",
  },
  perks: [
    {
      id: "innovation",
      title: "Pioneering Engineering",
      description:
        "Work with advanced monolithic RCC construction, earthquake-resilient structures, and modern master planning.",
    },
    {
      id: "growth",
      title: "Growth & Mentorship",
      description:
        "Continuous learning opportunities, mentorship from senior engineers, and clear advancement trajectories.",
    },
    {
      id: "culture",
      title: "Collaborative Culture",
      description:
        "An open, supportive work environment where architects, project leads, and advisors collaborate closely.",
    },
    {
      id: "benefits",
      title: "Comprehensive Benefits",
      description:
        "Competitive compensation packages, performance incentives, on-site allowances, and health coverage.",
    },
  ],
  gallery: [
    {
      src: "/career/1.png",
      alt: "Vastu Vihar Nepal architecture and planning studio",
      caption: "Architecture & Planning Studio",
    },
    {
      src: "/career/2.png",
      alt: "Engineering team reviewing structural blueprints",
      caption: "Engineering & Technical Review",
    },
    {
      src: "/career/3.png",
      alt: "Collaborative team discussions and planning",
      caption: "Cross-Functional Collaboration",
    },
    {
      src: "/career/4.jpeg",
      alt: "On-site township quality inspection",
      caption: "On-Site Quality Supervision",
    },
  ],
  openings: [
    {
      id: "sr-civil-engineer",
      title: "Senior Civil / Structural Engineer",
      department: "Engineering & Construction",
      type: "Full-Time",
      location: "Birtamode, Jhapa",
      description:
        "Lead structural execution, quality control, monolithic RCC casting, and contractor management for our active township project phases.",
      requirements: [
        "Bachelor’s or Master’s in Civil Engineering (NEC registered)",
        "4+ years experience in residential township / building construction",
        "Proficiency in AutoCAD, ETABS, and on-site quality assurance",
      ],
    },
    {
      id: "arch-visualizer",
      title: "Architectural 3D Visualizer & Designer",
      department: "Architecture & Design",
      type: "Full-Time",
      location: "Kathmandu / Birtamode",
      description:
        "Develop high-fidelity 3D exterior and interior renders, interactive virtual walkthroughs, and spatial plans for upcoming bungalow models.",
      requirements: [
        "Degree/Diploma in Architecture or 3D Architectural Animation",
        "Expertise in 3ds Max, V-Ray/Corona, Lumion, and SketchUp",
        "Strong portfolio showcasing photorealistic residential renders",
      ],
    },
    {
      id: "township-sales-advisor",
      title: "Township Sales & Housing Advisor",
      department: "Sales & Client Relations",
      type: "Full-Time",
      location: "Birtamode / Birgunj",
      description:
        "Guide prospective homebuyers, coordinate township site visits, explain bungalow models, and support booking contracts.",
      requirements: [
        "Bachelor’s degree in Business, Marketing, or related field",
        "2+ years experience in real estate sales or premium client advisory",
        "Outstanding communication skills in Nepali and English",
      ],
    },
    {
      id: "site-supervisor",
      title: "Site Construction Supervisor",
      department: "Site Operations",
      type: "Full-Time",
      location: "Birtamode, Jhapa",
      description:
        "Manage daily on-site labor coordination, material dispatch, safety protocols, and daily construction progress reporting.",
      requirements: [
        "Diploma in Civil Engineering or equivalent site experience",
        "2+ years on-site building supervision experience",
        "Familiarity with construction safety standards and inventory logs",
      ],
    },
  ],
  directApplication: {
    title: "Don’t See Your Ideal Role?",
    description:
      "We are always eager to meet driven professionals. Send your resume, portfolio, or statement of interest to our talent acquisition team.",
    email: "careers@vastuvihar.org",
    phone: "+977 - 97051-91815",
  },
};
