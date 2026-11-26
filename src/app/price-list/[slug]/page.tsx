import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  priceListData,
  type LocationPriceList,
  type PriceListModel,
  type SpecificationItem,
  type PaymentSchedule,
  type PriceListNote,
} from "@/data/priceList";
import { PriceList } from "@/components/price-list/PriceList";
import { PageHero } from "@/components/common/PageHero";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getPublicPriceList, getAllPriceLists } from "@/lib/priceLists";
import type { PriceListProject, PdfTemplate } from "@/lib/priceListTypes";

interface PriceListPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getAllPriceLists().catch(() => []);
  const slugs = new Set<string>();
  entries.forEach((e) => slugs.add(e.project.slug));
  priceListData.locations.forEach((l) => slugs.add(l.location.toLowerCase()));
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PriceListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const publicData = await getPublicPriceList(slug).catch(() => null);

  if (publicData?.project) {
    const p = publicData.project;
    return {
      title: `${p.projectName} Price Details | Vastu Vihar Nepal`,
      description: `Official price list, specifications, and staged payment schedules for residential duplexes and bungalows at ${p.projectName}, Nepal.`,
    };
  }

  const location = priceListData.locations.find(
    (l) => l.location.toLowerCase() === slug.toLowerCase()
  );

  if (!location) {
    return {
      title: "Price List Not Found | Vastu Vihar Nepal",
    };
  }

  return {
    title: `${location.location} Price Details | Vastu Vihar Nepal`,
    description: `Official price list, specifications, and payment schedules for residential bungalows and duplexes in ${location.location}, Nepal.`,
  };
}

function projectToLocationData(project: PriceListProject): {
  locationData: LocationPriceList;
  specifications: SpecificationItem[];
  paymentSchedules: PaymentSchedule[];
  notes: PriceListNote[];
} {
  const dates = project.effectiveDate
    ? project.effectiveDate.split(/\s+(?:to|-)\s+/i)
    : [];
  const effectiveFrom = dates[0] || project.effectiveDate || "Current";
  const effectiveTo = dates[1] || "";

  const models: PriceListModel[] = (project.bungalows || []).map((b) => ({
    name: b.name,
    config: b.model || "",
    landArea: Number(String(b.landArea || "0").replace(/,/g, "")) || 0,
    carpetArea: Number(String(b.carpetArea || "0").replace(/,/g, "")) || 0,
    builtupArea: Number(String(b.builtUpArea || "0").replace(/,/g, "")) || 0,
    luxuryCost:
      Number(String(b.luxuryPrice || b.deluxePrice || "0").replace(/,/g, "")) ||
      0,
    deluxeCost: b.deluxePrice
      ? Number(String(b.deluxePrice).replace(/,/g, ""))
      : undefined,
    ooe: 300000,
  }));

  const specifications: SpecificationItem[] = (
    project.specifications || []
  ).map((s) => ({
    particular: s.particular,
    luxury: s.luxury || s.deluxe || "—",
  }));

  const paymentSchedules: PaymentSchedule[] = (
    project.paymentSchedules || []
  ).map((ps) => ({
    type: (ps.title as any) || "Payment Schedule",
    steps: (ps.steps || []).map((step, idx) => ({
      step: idx + 1,
      description: step,
    })),
  }));

  const notes: PriceListNote[] = (project.notes || []).map((note, idx) => ({
    id: idx + 1,
    text: note,
  }));

  const locationData: LocationPriceList = {
    location: project.projectName,
    officeAddress: project.officeAddress,
    siteAddress: project.siteAddress,
    phone: project.contactPhones,
    effectiveFrom,
    effectiveTo,
    models,
  };

  return { locationData, specifications, paymentSchedules, notes };
}

async function PriceListDetail({ params }: PriceListPageProps) {
  const { slug } = await params;
  const publicData = await getPublicPriceList(slug).catch(() => null);

  let locationData: LocationPriceList | null = null;
  let project: PriceListProject | null = null;
  let pdfTemplate: PdfTemplate | null = null;
  let specifications: SpecificationItem[] | undefined;
  let paymentSchedules: PaymentSchedule[] | undefined;
  let notes: PriceListNote[] | undefined;

  if (publicData?.project) {
    project = publicData.project;
    pdfTemplate = publicData.pdfTemplate;
    const mapped = projectToLocationData(publicData.project);
    locationData = mapped.locationData;
    specifications = mapped.specifications;
    paymentSchedules = mapped.paymentSchedules;
    notes = mapped.notes;
  } else {
    const loc = priceListData.locations.find(
      (l) => l.location.toLowerCase() === slug.toLowerCase()
    );
    if (loc) {
      locationData = loc;
    }
  }

  if (!locationData) {
    notFound();
  }

  const displayName = locationData.location.includes("Township")
    ? locationData.location
    : `${locationData.location} Township`;

  return (
    <main>
      <PageHero
        location={[
          { label: "Home", href: "/" },
          { label: "Price List", href: "/price-list" },
          { label: `${displayName} Price Details` },
        ]}
        bgImage="/hero/price-list-hero.webp"
        bgImageAlt={`Vastu Vihar Nepal ${displayName} Price Details`}
        headingLine1={`${displayName} Price Details`}
        description={`Explore comprehensive duplex and bungalow pricing, land area dimensions, luxury material specifications, and staged construction payment plans for ${displayName}.`}
      />
      <PriceList
        locationData={locationData}
        project={project}
        pdfTemplate={pdfTemplate}
        specifications={specifications}
        paymentSchedules={paymentSchedules}
        notes={notes}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Price List", path: "/price-list/" },
          { name: displayName },
        ]}
      />
    </main>
  );
}

export default function Page({ params }: PriceListPageProps) {
  return (
    <Suspense>
      <PriceListDetail params={params} />
    </Suspense>
  );
}
