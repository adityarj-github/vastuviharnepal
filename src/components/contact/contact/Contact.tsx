import { contact } from "@/data/contact";
import { ContactClient } from "./ContactClient";

export function Contact() {
  return <ContactClient contacts={contact} />;
}
