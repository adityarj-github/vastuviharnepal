import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found/NotFoundContent";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Vastu Vihar Nepal",
  description:
    "The page you were looking for could not be found. Explore our luxury bungalows or contact Vastu Vihar Nepal.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
