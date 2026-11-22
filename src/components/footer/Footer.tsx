import { footerData } from "@/data/footer";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  "use cache";
  const currentYear = new Date().getFullYear();

  return <FooterClient data={footerData} currentYear={currentYear} />;
}
