import { aboutData } from "@/data/about";
import { navigationData } from "@/data/navigation";
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
      socials={navigationData.socials}
    />
  );
}