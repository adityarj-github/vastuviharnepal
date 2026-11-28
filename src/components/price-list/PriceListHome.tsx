"use client";

import { motionScrollBehavior } from "@/components/animation/motionPreference";
import { StatCounter } from "@/components/home/StatCounter";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import { navigationData } from "@/data/navigation";
import { priceListData } from "@/data/priceList";
import styles from "./PriceListHome.module.css";

export interface PriceListBranchItem {
  slug: string;
  name: string;
  phase?: string;
  locationState?: string;
  siteAddress: string;
  modelsCount: number;
  startingPrice?: string;
  bhkRange?: string;
  image?: string;
  statusBadge?: string;
}

interface PriceListHomeProps {
  branches?: PriceListBranchItem[];
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function PriceListHome({ branches }: PriceListHomeProps = {}) {
  const financeRef = useRef<HTMLElement>(null);
  const [isFinanceVisible, setIsFinanceVisible] = useState(false);

  // Timeline horizontal scroll indicators & controls (desktop & mobile)
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkTimelineScroll = () => {
    const el = timelineTrackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(maxScroll > 6 && scrollLeft < maxScroll - 6);
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  };

  useEffect(() => {
    const el = timelineTrackRef.current;
    if (!el) return;
    checkTimelineScroll();
    el.addEventListener("scroll", checkTimelineScroll, { passive: true });
    window.addEventListener("resize", checkTimelineScroll);
    return () => {
      el.removeEventListener("scroll", checkTimelineScroll);
      window.removeEventListener("resize", checkTimelineScroll);
    };
  }, []);

  const handleScrollTimeline = (direction: "left" | "right") => {
    const el = timelineTrackRef.current;
    if (!el) return;
    const step = Math.max(260, Math.round(el.clientWidth * 0.6));
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: motionScrollBehavior(),
    });
  };

  useEffect(() => {
    const el = financeRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsFinanceVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsFinanceVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items: PriceListBranchItem[] =
    branches && branches.length > 0
      ? branches
      : priceListData.locations.map((loc) => {
        const slug = loc.location.toLowerCase();
        return {
          slug,
          name:
            loc.location.includes("Township") || loc.location.includes("Branch")
              ? loc.location
              : `${loc.location} Township`,
          phase: "Phase 1",
          locationState:
            slug === "birgunj"
              ? "Madhesh Province, Parsa"
              : "Koshi Province, Jhapa",
          siteAddress: loc.siteAddress,
          modelsCount: loc.models.length,
          startingPrice:
            slug === "birgunj" ? "From Rs. 30 Lakhs" : "From Rs. 35 Lakhs",
          bhkRange: "2 to 7 BHK Duplex & Villas",
          statusBadge: "Booking Open",
        };
      });

  const constructionMilestones = [
    {
      step: "01",
      percent: "10%",
      title: "Unit Booking",
      description:
        "Reserve your selected unit and lock base contract pricing with zero price escalation.",
      align: "down" as const,
    },
    {
      step: "02",
      percent: "20%",
      title: "Deed Agreement",
      description:
        "Payable within 30 days upon formal allotment and registered deed execution.",
      align: "up" as const,
    },
    {
      step: "03",
      percent: "16%",
      title: "Plinth Level",
      description:
        "Disbursed upon completion of seismic foundation framework and deep waterproofing.",
      align: "down" as const,
    },
    {
      step: "04",
      percent: "16%",
      title: "Ground Floor Slab",
      description:
        "Casting of ground floor reinforced concrete columns, beams and ceiling slab.",
      align: "up" as const,
    },
    {
      step: "05",
      percent: "16%",
      title: "First Floor Slab",
      description:
        "Upper floor structural frame, external masonry envelope and roof casting.",
      align: "down" as const,
    },
    {
      step: "06",
      percent: "22%",
      title: "Finishing & Handover",
      description:
        "Complete vitrified finishes, fittings, statutory deed registry and key possession.",
      align: "up" as const,
    },
  ];

  const whyChooseCards = [
    {
      variant: "navy" as const,
      monogram: "01",
      category: "Core Deliverables",
      title: "Land & Superstructure",
      items: [
        "Dedicated land plot allocation & clear legal title deed transfer",
        "Earthquake-resistant reinforced RCC frame with grade-A masonry",
        "Deep foundation waterproofing & structural seismic engineering",
        "Internal road access & boundary demarcations fully installed",
      ],
    },
    {
      variant: "sky" as const,
      monogram: "02",
      category: "Turnkey Inclusions",
      title: "Finishes & Infrastructure",
      items: [
        "Premium vitrified flooring & modular electrical wiring throughout",
        "Branded sanitary ware, CP plumbing fittings & hot-cold conduits",
        "Wide paved township roads, underground drainage & street lamps",
        "24/7 security gatehouse, perimeter wall & central water reservoir",
      ],
    },
    {
      variant: "light" as const,
      monogram: "03",
      category: "Statutory & Custom",
      title: "Budgeted Separately",
      items: [
        "Government land registration fees, municipal taxes & stamp duty",
        "Individual electricity meter deposit & potable drinking water tap",
        "Optional bespoke interior wood woodwork & designer modular kitchen",
        "Corner or park-facing plot selection premiums where applicable",
      ],
    },
  ];

  const faqs = [
    {
      question: "Is the published base price negotiable?",
      answer:
        "Our pricing is structured transparently to guarantee premium construction quality and timely delivery across all townships. For current branch incentives, seasonal booking privileges, or payment customization, our senior sales advisory team can provide a formal written quotation.",
    },
    {
      question: "Are there any hidden costs beyond the price list?",
      answer:
        "No. Every financial obligation is documented upfront before booking. Statutory government transfer charges, registration stamp duties, and direct utility meter fees are charged strictly as per governmental tariffs and itemized in your allotment schedule.",
    },
    {
      question: "Which commercial banks offer home loan financing?",
      answer:
        "Leading commercial banks in Nepal—including Nabil Bank, Global IME Bank, NIC ASIA Bank, and Everest Bank—offer up to 70-80% retail home mortgage financing on Vastu Vihar residential properties. Our dedicated finance desk assists you with end-to-end documentation.",
    },
    {
      question: "What is the cancellation and refund policy?",
      answer:
        "Your investment is protected under clear contractual terms. Prior to executing the deed agreement, if unforeseen circumstances require booking cancellation, eligible refunds are processed smoothly in accordance with our standard written allotment guidelines without penalty surprises.",
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* 1. Township Showcase Cards (Desktop Padded, No Thumbs) */}
      <section className={styles.section} aria-labelledby="locations-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.headerRow}>
            <h2 id="locations-heading" className={styles.heading}>
              Select Township Price List
            </h2>
            <p className={styles.description}>
              Review transparent base prices, carpet area matrices, and luxury
              construction specifications for our integrated Nepal communities.
            </p>
          </div>
        </div>

        <div className={styles.townshipGrid}>
          {items.map((loc) => {
            const slug = loc.slug;

            return (
              <article key={slug} className={styles.townshipCard}>
                <Link
                  href={`/price-list/${slug}`}
                  className={styles.cardOverlayLink}
                  aria-label={`View ${loc.name} Price Details`}
                  tabIndex={-1}
                />

                <div className={styles.cardMain}>
                  <div className={styles.phaseLabel}>
                    {loc.phase || "Phase 1"}
                  </div>

                  <h3 className={styles.cardTitle}>{loc.name}</h3>

                  <p className={styles.siteAddress}>
                    <PinIcon className={styles.addressIcon} />
                    <span>{loc.siteAddress}</span>
                  </p>

                  <p className={styles.startingPriceText}>
                    Starting investment: <strong>{loc.startingPrice || "From Rs. 35 Lakhs"}</strong>
                  </p>

                  <div className={styles.specChips}>
                    <div className={styles.specChip}>
                      <HomeIcon className={styles.chipIcon} />
                      <span>{loc.bhkRange || "2 to 7 BHK Duplex & Villas"}</span>
                    </div>
                    <div className={styles.specChip}>
                      <LayoutIcon className={styles.chipIcon} />
                      <span>{loc.modelsCount} Property Layouts</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.actionBtnWrap}>
                    <ActionButton
                      text="Explore Price List"
                      href={`/price-list/${slug}`}
                    />
                  </span>
                  <span className={styles.arrowCircle} aria-hidden="true">
                    <ArrowUpRightIcon className={styles.arrowIcon} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. Finance Partners Section (100vh Cover, Full Width Bleed, No Margin, No Border Radius, Animated Arch) */}
      <section
        ref={financeRef} data-site-motion="off"
        className={`${styles.financeSection} ${isFinanceVisible ? styles.financeVisible : ""}`}
        aria-labelledby="finance-heading"
      >
        <div className={styles.financeWrapper}>
          {/* Subtle Vertical Grid Lines & Ghost Tiles Backdrop matching Reference Image 1 */}
          <div className={styles.financeGridBackdrop} aria-hidden="true">
            <div className={styles.gridLineTrack}>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={styles.gridLine} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={`${styles.gridLine} ${styles.hasAccentMark}`} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={styles.gridLine} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={styles.gridLine} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={styles.gridLine} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={`${styles.gridLine} ${styles.hasAccentMarkRight}`} />
              </div>
              <div className={styles.gridLineCol}>
                <div className={styles.ghostTile} />
                <div className={styles.gridLine} />
              </div>
            </div>
          </div>

          {/* Desktop 7-Column Arched Stage */}
          <div className={styles.desktopPartnersStage}>
            {/* Col 1: 2 Cards Stacked */}
            <div className={styles.cardColDouble}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/1.webp"
                  alt="Banking Partner 1"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/2.webp"
                  alt="Banking Partner 2"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 2: 1 Card (Offset Down) */}
            <div className={`${styles.cardColSingle} ${styles.colOffsetDown}`}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/3.webp"
                  alt="Banking Partner 3"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 3: 1 Card (Offset Up) */}
            <div className={`${styles.cardColSingle} ${styles.colOffsetUp}`}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/4.webp"
                  alt="Banking Partner 4"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 4: 1 Card (Peak Top Center) */}
            <div className={`${styles.cardColSingle} ${styles.colOffsetPeak}`}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/5.webp"
                  alt="Banking Partner 5"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 5: 1 Card (Offset Up) */}
            <div className={`${styles.cardColSingle} ${styles.colOffsetUp}`}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/6.webp"
                  alt="Banking Partner 6"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 6: 1 Card (Offset Down) */}
            <div className={`${styles.cardColSingle} ${styles.colOffsetDown}`}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/7.webp"
                  alt="Banking Partner 7"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Col 7: 2 Cards Stacked */}
            <div className={styles.cardColDouble}>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/8.webp"
                  alt="Banking Partner 8"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={styles.imgCard}>
                <Image
                  src="/banks/9.webp"
                  alt="Banking Partner 9"
                  fill
                  sizes="14vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>
          </div>

          {/* Mobile 2-Row Up-Down Waves */}
          <div className={styles.mobilePartnersStage} aria-hidden="true">
            {/* Row 1: 5 Cards (Down, Up, Peak, Up, Down) */}
            <div className={styles.mobileRowTop}>
              <div className={`${styles.imgCard} ${styles.colOffsetDown}`}>
                <Image
                  src="/banks/1.webp"
                  alt="Banking Partner 1"
                  fill
                  sizes="18vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetUp}`}>
                <Image
                  src="/banks/2.webp"
                  alt="Banking Partner 2"
                  fill
                  sizes="18vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetPeak}`}>
                <Image
                  src="/banks/3.webp"
                  alt="Banking Partner 3"
                  fill
                  sizes="18vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetUp}`}>
                <Image
                  src="/banks/4.webp"
                  alt="Banking Partner 4"
                  fill
                  sizes="18vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetDown}`}>
                <Image
                  src="/banks/5.webp"
                  alt="Banking Partner 5"
                  fill
                  sizes="18vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>

            {/* Row 2: 4 Cards (Up, Down, Up, Down) */}
            <div className={styles.mobileRowBottom}>
              <div className={`${styles.imgCard} ${styles.colOffsetUp}`}>
                <Image
                  src="/banks/6.webp"
                  alt="Banking Partner 6"
                  fill
                  sizes="20vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetDown}`}>
                <Image
                  src="/banks/7.webp"
                  alt="Banking Partner 7"
                  fill
                  sizes="20vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetUp}`}>
                <Image
                  src="/banks/8.webp"
                  alt="Banking Partner 8"
                  fill
                  sizes="20vw"
                  className={styles.partnerImg}
                />
              </div>
              <div className={`${styles.imgCard} ${styles.colOffsetDown}`}>
                <Image
                  src="/banks/9.webp"
                  alt="Banking Partner 9"
                  fill
                  sizes="20vw"
                  className={styles.partnerImg}
                />
              </div>
            </div>
          </div>

          {/* Centered Content Below Floating Cards */}
          <div className={styles.financeBottomContent}>
            <span className={styles.financePill}>Finance Partners</span>
            <h2 id="finance-heading" className={styles.financeHeading}>
              Trusted Banking &amp; Financing Partners
            </h2>
            <p className={styles.financeDescription}>
              Our residential townships are pre-approved for retail home loans across Nepal&apos;s
              leading commercial banks with up to 25-year flexible terms.
            </p>
            <div className={styles.financeCtaWrap}>
              <ActionButton
                text="Ask About Financing"
                href="/contact/site"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Construction Milestones (Timeline matching reference image) */}
      <div className={styles.milestoneSectionWrap}>
        <section
          className={styles.timelineSection}
          aria-labelledby="milestones-heading"
        >
          <div className={styles.timelineContainer}>
            {/* Left Header Column */}
            <div className={styles.timelineHeaderCol}>
              <h2 id="milestones-heading" className={styles.timelineHeading}>
                TIMELINE
              </h2>
              <p className={styles.timelineSubheading}>
                Physical construction verification linked directly to every disbursement phase.
              </p>

              {/* Scroll Indicator & Nav Buttons */}
              <div className={styles.timelineScrollControls}>
                <div className={styles.scrollInfoRow}>
                  <span className={styles.scrollHintText}>
                    Scroll Milestones
                  </span>
                  <div className={styles.scrollButtons}>
                    <button
                      type="button"
                      onClick={() => handleScrollTimeline("left")}
                      className={styles.scrollNavBtn}
                      disabled={!canScrollLeft}
                      aria-label="Previous milestone"
                    >
                      <ChevronLeftIcon className={styles.navBtnIcon} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollTimeline("right")}
                      className={styles.scrollNavBtn}
                      disabled={!canScrollRight}
                      aria-label="Next milestone"
                    >
                      <ChevronRightIcon className={styles.navBtnIcon} />
                    </button>
                  </div>
                </div>
                <div className={styles.scrollProgressBar} aria-hidden="true">
                  <div
                    className={styles.scrollProgressThumb}
                    style={{
                      width: `${Math.max(18, scrollProgress)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Horizontal Timeline Track */}
            <div
              ref={timelineTrackRef}
              className={styles.timelineTrackWrap}
            >
              <div className={styles.timelineTrack}>
                {/* Continuous horizontal line passing through the pills */}
                <div className={styles.timelineConnectingLine} data-site-reveal="line" aria-hidden="true" />

                {constructionMilestones.map((item, index) => {
                  const isUp = index % 2 === 1;

                  return (
                    <div key={item.step} className={styles.timelineNode} data-site-reveal="group">
                      {/* Top Area (if isUp, show content above line) */}
                      <div className={styles.timelineNodeTop}>
                        {isUp && (
                          <div className={styles.nodeTextContent}>
                            <h3 className={styles.nodeTitle}>{item.title}</h3>
                            <p className={styles.nodeDesc}>{item.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Center Axis (Pill of brand color with circle inside) */}
                      <div className={styles.timelineNodeAxis}>
                        <div className={styles.brandPill}>
                          <span className={styles.pillCircle}>
                            {item.step}
                          </span>
                          <StatCounter target={Number(item.percent.replace("%", ""))} suffix="%" className={styles.pillText} />
                        </div>
                      </div>

                      {/* Bottom Area (if !isUp, show content below line) */}
                      <div className={styles.timelineNodeBottom}>
                        {!isUp && (
                          <div className={styles.nodeTextContent}>
                            <h3 className={styles.nodeTitle}>{item.title}</h3>
                            <p className={styles.nodeDesc}>{item.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. What Your Investment Covers (Styled as Why Choose Us Cards) */}
      <div className={styles.whySectionWrap}>
        <section className={styles.whySection} aria-labelledby="covers-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.headerRow}>
              <h2 id="covers-heading" className={styles.heading}>
                What Your Investment Covers
              </h2>
              <p className={styles.description}>
                A clear, transparent breakdown of standard deliverables versus statutory
                and custom selections before you reserve.
              </p>
            </div>
          </div>

          <div className={styles.whyTrack}>
            {whyChooseCards.map((card) => {
              const cardClass =
                card.variant === "navy"
                  ? styles.cardNavy
                  : card.variant === "sky"
                    ? styles.cardSky
                    : styles.cardLight;

              return (
                <article key={card.monogram} className={`${styles.whyCard} ${cardClass}`}>
                  <div className={styles.whyTopBlock}>
                    <div className={styles.whyHeaderRow}>
                      <span className={styles.whyMonogram}>{card.monogram}</span>
                      <span className={styles.whyCategory}>{card.category}</span>
                    </div>

                    <h3 className={styles.whyTitle}>{card.title}</h3>

                    <ul className={styles.whyList}>
                      {card.items.map((item, idx) => (
                        <li key={idx} className={styles.whyItem}>
                          <span className={styles.whyCheckIconWrap}>
                            <CheckIcon className={styles.whyCheckIcon} />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5. Minimal Download Master Brochure Banner */}
      <div className={styles.downloadSectionWrap}>
        <section className={styles.downloadSection} aria-labelledby="download-heading">
          <div className={styles.downloadCard}>
            <div className={styles.downloadContent}>
              <h2 id="download-heading" className={styles.downloadHeading}>
                Download Master Brochure &amp; Price Catalog
              </h2>
              <p className={styles.downloadDescription}>
                Get comprehensive architectural floor plans, 3D elevation renders, carpet area matrices,
                and comparative pricing in a single high-resolution document.
              </p>

              <div className={styles.downloadActions}>
                <a
                  href="/Brochure_Layout_Nepal.pdf"
                  download
                  className={styles.minimalDownloadBtn}
                >
                  <DownloadIcon className={styles.downloadIconSvg} />
                  <span>Download Brochure (PDF)</span>
                </a>
                <ActionButton
                  text="Book a Site Visit"
                  href="/contact/site"
                />
                <a
                  href={navigationData.cta.phoneHref}
                  className={styles.minimalAdvisorLink}
                >
                  <span>Talk to Sales Advisor</span>
                  <ArrowUpRightIcon className={styles.advisorArrow} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Frequently Asked Questions (Clean Minimal Lines) */}
      <div className={styles.faqSectionWrap}>
        <section className={styles.faqSection} aria-labelledby="faqs-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.headerRow}>
              <h2 id="faqs-heading" className={styles.heading}>
                Frequently Asked Questions
              </h2>
              <p className={styles.description}>
                Answers to key questions regarding pricing transparency, bank loan
                approvals, and booking security.
              </p>
            </div>
          </div>

          <div className={styles.faqsList}>
            {faqs.map((faq) => (
              <details key={faq.question} className={styles.faqItem} name="price-faq" data-motion-accordion>
                <summary className={styles.faqSummary}>
                  <span className={styles.faqQuestion}>{faq.question}</span>
                  <span className={styles.faqToggleIcon} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PriceListHome;
