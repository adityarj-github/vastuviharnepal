import {
  LocationPriceList,
  SpecificationItem,
  PaymentSchedule,
  PriceListNote,
  priceListData,
} from "@/data/priceList";
import { PriceListClient } from "./PriceListClient";

interface PriceListProps {
  locationData: LocationPriceList;
}

export function PriceList({ locationData }: PriceListProps) {
  const isBirtamode = locationData.location.toLowerCase() === "birtamode";
  const notes: PriceListNote[] = isBirtamode
    ? priceListData.notes.birtamode
    : priceListData.notes.birgunj;

  return (
    <PriceListClient
      locationData={locationData}
      specifications={priceListData.specifications}
      specDisclaimer={priceListData.specDisclaimer}
      paymentSchedules={priceListData.paymentSchedules}
      notes={notes}
    />
  );
}

export default PriceList;
