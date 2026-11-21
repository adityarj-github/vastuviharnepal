export interface CareerImage {
    src: string;
    alt: string;
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
            src: "/career/team-1.webp",
            alt: "Vastu Vihar Nepal architecture and planning team",
        },
        {
            src: "/career/team-2.webp",
            alt: "Engineers reviewing residential township blueprints",
        },
        {
            src: "/career/team-3.webp",
            alt: "Collaborative workspace at Vastu Vihar Nepal",
        },
        {
            src: "/career/team-4.webp",
            alt: "On-site township development and inspection",
        },
    ],
};