import { footerData } from "@/data/footer";
import { FooterClient } from "./FooterClient";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return <FooterClient data={footerData} currentYear={currentYear} />;
}