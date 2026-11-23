import Image from "next/image";
import styles from "./page.module.css";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/about/AboutSection";
import { ExploreHomes } from "@/components/homes/ExploreHomes";
import { WhyUsSection } from "@/components/why-us";
import { JourneySection } from "@/components/journey/JourneySection";
import { CareerSection } from "@/components/career/CareerSection";
import { AmenitiesMarquee } from "@/components/amenities/AmenitiesMarquee";
import { QualitySection } from "@/components/quality/QualitySection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <Hero />
        <AboutSection />
        <ExploreHomes />
        <AmenitiesMarquee />
        <WhyUsSection />
        <CareerSection />
        <QualitySection />
        <JourneySection />
        <TestimonialsSection />

      </main>
    </div>
  );
}
