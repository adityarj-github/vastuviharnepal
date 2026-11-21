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
            src: "/career/arch.jpeg",
            alt: "Vastu Vihar Nepal architecture and planning team",
        },
        {
            src: "/career/er-review.jpeg",
            alt: "Engineers reviewing residential township blueprints",
        },
        {
            src: "/career/collab-work.jpeg",
            alt: "Collaborative workspace at Vastu Vihar Nepal",
        },
        {
            src: "/career/onsite-dev.jpeg",
            alt: "On-site township development and inspection",
        },
    ],
};
