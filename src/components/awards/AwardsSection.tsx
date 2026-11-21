import { awardsSectionData } from "@/data/awards";
import { AwardsSectionClient } from "./AwardsSectionClient";

export function AwardsSection() {
    return (
        <AwardsSectionClient
            headingLine1={awardsSectionData.headingLine1}
            headingLine2={awardsSectionData.headingLine2}
            description={awardsSectionData.description}
            awards={awardsSectionData.awards}
        />
    );
}