export interface HeroImageAsset {
    src: string;
    alt: string;
}

export interface HeroData {
    heading: string;
    description: string;
    backgroundImage: HeroImageAsset;
    cta: {
        label: string;
        href: string;
    };
    highlight: {
        smallHeading: string;
        images: [HeroImageAsset, HeroImageAsset];
        line: string;
        linkLabel: string;
        linkHref: string;
    };
}

export const heroData: HeroData = {
    heading: "Thoughtfully Planned Homes Across Nepal",
    description:
        "Discover modern residential townships, reliable infrastructure, and peaceful living spaces crafted by Vastu Vihar Nepal.",
    backgroundImage: {
        src: "/landing-hero.png",
        alt: "Vastu Vihar Nepal residential township view",
    },
    cta: {
        label: "Explore Models",
        href: "/models",
    },
    highlight: {
        smallHeading: "Trusted Communities",
        images: [
            {
                src: "/models/bagmati/thumb.webp", // Add in public/
                alt: "Vastu Vihar Nepal villa model",
            },
            {
                src: "/ananta.webp", // Add in public/
                alt: "Vastu Vihar Nepal township greenery",
            },
        ],
        line: "Ready-to-move plots & villas",
        linkLabel: "Book a Site Visit",
        linkHref: "/contact/site",
    },
};