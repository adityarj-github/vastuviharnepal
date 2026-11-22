import { footerData } from "@/data/footer";
import { FooterClient } from "./FooterClient";

const CURRENT_YEAR = 2026;

export function Footer() {
  return <FooterClient data={footerData} currentYear={CURRENT_YEAR} />;
}