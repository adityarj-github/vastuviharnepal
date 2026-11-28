import { projectsList } from "@/data/projects";
import { ExploreHomesClient } from "./ExploreHomesClient";

export function ExploreHomes() {
  return <ExploreHomesClient projects={projectsList} />;
}