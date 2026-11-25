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
        smallHeading: "Trusted Finance Partners",
        images: [
            {
                src: "/bh1.webp",
                alt: "Vastu Vihar Nepal villa model",
            },
            {
                src: "/bh2.webp",
                alt: "Vastu Vihar Nepal township greenery",
            },
        ],
        line: "Ready-to-cover your finance backup",
        linkLabel: "connect to our team",
        linkHref: "/contact/site",
    },
};