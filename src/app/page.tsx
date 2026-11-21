import Image from "next/image";
import styles from "./page.module.css";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/about/AboutSection";
import { ExploreHomes } from "@/components/homes/ExploreHomes";
import { AwardsSection } from "@/components/awards/AwardsSection";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <Hero />
        <AboutSection />
        <ExploreHomes />
        <AwardsSection />

      </main>
    </div>
  );
}
