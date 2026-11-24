import { whyUsSectionData } from "@/data/why-us";
import { WhyUsSectionClient } from "./WhyUsSectionClient";

export function WhyUsSection() {
  return (
    <WhyUsSectionClient
      headingLine1={whyUsSectionData.headingLine1}
      headingLine2={whyUsSectionData.headingLine2}
      description={whyUsSectionData.description}
      items={whyUsSectionData.items}
    />
  );
}

export default WhyUsSection;
