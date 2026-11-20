import { projectsList } from "@/data/projects";
import { ExploreHomesClient } from "./ExploreHomesClient";

export function ExploreHomes() {
  const featuredProjects = projectsList.slice(0, 4);

  return <ExploreHomesClient projects={featuredProjects} />;
}