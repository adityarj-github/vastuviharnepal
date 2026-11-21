import { testimonialsData } from "@/data/testimonials";
import { TestimonialsSectionClient } from "./TestimonialsSectionClient";

export function TestimonialsSection() {
  return <TestimonialsSectionClient {...testimonialsData} />;
}