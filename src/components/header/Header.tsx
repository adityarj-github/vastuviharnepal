import { aboutData } from "@/data/about";
import { navigationData } from "@/data/navigation";
import { footerData } from "@/data/footer";
import { HeaderClient } from "./HeaderClient";

export function Header() {
  return (
    <HeaderClient
      logos={{
        dark: aboutData.logos.dark,
        white: aboutData.logos.white,
      }}
      links={navigationData.links}
      cta={navigationData.cta}
      socials={footerData.socialLinks}
    />
  );
}