import {
  LocationPriceList,
  SpecificationItem,
  PaymentSchedule,
  PriceListNote,
  priceListData,
} from "@/data/priceList";
import type { PdfTemplate, PriceListProject } from "@/lib/priceListTypes";
import { PriceListClient } from "./PriceListClient";

interface PriceListProps {
  locationData: LocationPriceList;
  project?: PriceListProject | null;
  pdfTemplate?: PdfTemplate | null;
  specifications?: SpecificationItem[];
  paymentSchedules?: PaymentSchedule[];
  notes?: PriceListNote[];
  specDisclaimer?: string;
}

export function PriceList({
  locationData,
  project,
  pdfTemplate,
  specifications,
  paymentSchedules,
  notes,
  specDisclaimer,
}: PriceListProps) {
  const locLower = locationData.location.toLowerCase();
  const isBirtamode = locLower.includes("birtamode");

  const resolvedNotes =
    notes && notes.length > 0
      ? notes
      : isBirtamode
        ? priceListData.notes.birtamode
        : priceListData.notes.birgunj;

  const resolvedSpecs =
    specifications && specifications.length > 0
      ? specifications
      : priceListData.specifications;

  const resolvedSchedules =
    paymentSchedules && paymentSchedules.length > 0
      ? paymentSchedules
      : priceListData.paymentSchedules;

  return (
    <PriceListClient
      locationData={locationData}
      project={project}
      pdfTemplate={pdfTemplate}
      specifications={resolvedSpecs}
      specDisclaimer={specDisclaimer || priceListData.specDisclaimer}
      paymentSchedules={resolvedSchedules}
      notes={resolvedNotes}
    />
  );
}

export default PriceList;
