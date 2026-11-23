import { officeData } from "@/data/office";
import { OfficeContactClient } from "./OfficeContactClient";

export function OfficeContact() {
  return <OfficeContactClient offices={officeData} />;
}
