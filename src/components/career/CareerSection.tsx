import { careerData } from "@/data/career";
import { CareerSectionClient } from "./CareerSectionClient";

export function CareerSection() {
  return <CareerSectionClient {...careerData} />;
}