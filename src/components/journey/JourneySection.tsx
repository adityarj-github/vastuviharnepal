import { journeyData } from "@/data/journey";
import { JourneySectionClient } from "./JourneySectionClient";

export function JourneySection() {
  return <JourneySectionClient {...journeyData} />;
}