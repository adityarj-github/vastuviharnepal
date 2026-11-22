import { contact } from "@/data/contact";
import { siteData } from "@/data/site";
import { SiteContactClient } from "./SiteContactClient";

export function SiteContact() {
  return <SiteContactClient site={siteData} email={contact[0].email} />;
}
