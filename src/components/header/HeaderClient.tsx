"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ActionButton, IconButton } from "@/components/buttons";
import type { LogoAsset } from "@/data/about";
import type { NavItem, SocialLink } from "@/data/navigation";
import styles from "./Header.module.css";

interface HeaderClientProps {
  logos: {
    dark: LogoAsset;
    white: LogoAsset;
  };
  links: NavItem[];
  cta: {
    callLabel: string;
    phoneHref: string;
    emailHref: string;
    emailAria: string;
  };
  socials: SocialLink[];
}

/* Lightweight inline SVGs */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

function MobileNavIcon({ label }: { label: string }) {
  const norm = label.toLowerCase();
  if (norm.includes("home")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (norm.includes("about")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }
  if (norm.includes("model") || norm.includes("residence") || norm.includes("villa") || norm.includes("bungalow")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="M4 22h16" />
        <path d="M5 22V7l7-4 7 4v15" />
        <path d="M10 22V12h4v10" />
      </svg>
    );
  }
  if (norm.includes("gallery")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    );
  }
  if (norm.includes("price") || norm.includes("cost") || norm.includes("rate")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    );
  }
  if (norm.includes("site")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (norm.includes("branch")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <line x1="3" x2="21" y1="22" y2="22" />
        <line x1="6" x2="6" y1="18" y2="11" />
        <line x1="10" x2="10" y1="18" y2="11" />
        <line x1="14" x2="14" y1="18" y2="11" />
        <line x1="18" x2="18" y1="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    );
  }
  if (norm.includes("contact")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (norm.includes("career")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <rect width="20" height="14" x="2" y="7" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 8 8 12 12 16 12 8" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

export function HeaderClient({ logos, links, cta, socials }: HeaderClientProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isAtTop, setIsAtTop] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isForceExpanded, setIsForceExpanded] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Remove: const lastScrollY = useRef(0);

  // Collapse header whenever scrolled past the top; only Menu button stays visible
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const atTop = currentY < 40;

      setIsAtTop(atTop);
      setIsCollapsed(!atTop);
      setIsForceExpanded(false);

      if (!atTop) {
        setContactOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown on outside click or Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContactOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleFloatingMenuClick = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen(true);
    } else {
      setIsCollapsed(false);
      setIsForceExpanded(true);
    }
  };

  const showSolidBg = !isAtTop || isForceExpanded;
  const hideHeader = isCollapsed && !isForceExpanded && !mobileOpen;
  const activeLogo = showSolidBg ? logos.dark : logos.white;

  return (
    <>
      <header
        className={`${styles.header} ${!isHomePage ? styles.headerInnerPage : ""} ${showSolidBg ? styles.headerSolid : ""
          } ${hideHeader ? styles.headerHidden : ""}`}
      >
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink} aria-label="Vastu Vihar Nepal Home">
            <Image
              src={activeLogo.src}
              alt={activeLogo.alt}
              width={activeLogo.width}
              height={activeLogo.height}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* Desktop Center Dark Pill Nav */}
          <nav className={styles.desktopNav} aria-label="Primary Navigation">
            {links.map((item) =>
              item.children ? (
                <div key={item.label} className={styles.navItem} ref={dropdownRef}>
                  <div
                    className={`${styles.navTriggerGroup} ${contactOpen ? styles.navTriggerGroupOpen : ""
                      }`}
                  >
                    <Link
                      href={item.href ?? "/contact"}
                      className={styles.navLinkText}
                      onClick={() => setContactOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className={`${styles.navChevronBtn} ${contactOpen ? styles.navChevronBtnOpen : ""
                        }`}
                      aria-label="Toggle contact menu"
                      aria-expanded={contactOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setContactOpen((prev) => !prev);
                      }}
                    >
                      <span
                        className={`${styles.chevron} ${contactOpen ? styles.chevronOpen : ""
                          }`}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  </div>

                  <div
                    className={`${styles.dropdown} ${contactOpen ? styles.dropdownOpen : ""
                      }`}
                    role="menu"
                  >
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={styles.dropdownItem}
                        role="menuitem"
                        onClick={() => setContactOpen(false)}
                      >
                        <span className={styles.dropdownTitle}>{sub.label}</span>
                        <span className={styles.tiltedArrow}>
                          <ArrowIcon />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href ?? "/"} className={styles.navLink}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className={styles.desktopActions}>
            <ActionButton
              text={cta.callLabel}
              href={cta.phoneHref}
              icon={<PhoneIcon />}
            />
            <IconButton
              ariaLabel={cta.emailAria}
              href={cta.emailHref}
              icon={<MailIcon />}
            />
          </div>

          {/* Mobile Menu Icon Button */}
          <div className={styles.mobileTrigger}>
            <ActionButton
              text={cta.callLabel}
              href={cta.phoneHref}
              icon={<PhoneIcon />}
            />
            <IconButton
              ariaLabel="Open menu"
              icon={<MenuIcon />}
              onClick={() => setMobileOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Floating Menu ActionButton (appears when header collapses on scroll) */}
      <div
        className={`${styles.floatingMenu} ${hideHeader ? styles.floatingMenuVisible : ""
          }`}
      >
        <ActionButton
          text="Menu"
          icon={<MenuIcon />}
          onClick={handleFloatingMenuClick}
        />
      </div>

      {/* Mobile Full-Screen Drawer */}
      <aside
        className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.drawerHeader}>


          <ActionButton
            text="Close"
            icon={<CloseIcon />}
            onClick={() => setMobileOpen(false)}
          />
          {/* <IconButton
            ariaLabel="Close menu"
            icon={<CloseIcon />}
            onClick={() => setMobileOpen(false)}
          /> */}
        </div>

        <nav className={styles.drawerNav} aria-label="Mobile Navigation">
          <div className={styles.mobileNavGroup}>
            {links.map((item) =>
              item.children ? (
                <div key={item.label} className={styles.mobileAccordionItem}>
                  <div className={styles.mobileAccordionHeader}>
                    <Link
                      href={item.href ?? "/contact"}
                      className={styles.mobileAccordionLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className={styles.mobileLinkIcon}>
                        <MobileNavIcon label={item.label} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      className={styles.mobileChevronBtn}
                      aria-label="Toggle contact submenu"
                      aria-expanded={mobileContactOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileContactOpen((prev) => !prev);
                      }}
                    >
                      <span
                        className={`${styles.chevron} ${mobileContactOpen ? styles.chevronOpen : ""
                          }`}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  </div>

                  <div
                    className={`${styles.accordionContent} ${mobileContactOpen ? styles.accordionOpen : ""
                      }`}
                  >
                    <div className={styles.accordionInner}>
                      <div className={styles.mobileSubList}>
                        {item.children.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={styles.mobileSubLink}
                            onClick={() => setMobileOpen(false)}
                          >
                            <div className={styles.mobileSubText}>
                              <span className={styles.mobileSubIcon}>
                                <MobileNavIcon label={sub.label} />
                              </span>
                              <span className={styles.mobileSubTitle}>{sub.label}</span>
                            </div>
                            <span className={styles.tiltedArrow}>
                              <ArrowIcon />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={styles.mobileLinkContent}>
                    <span className={styles.mobileLinkIcon}>
                      <MobileNavIcon label={item.label} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <span className={styles.mobileArrow}>
                    <ArrowIcon />
                  </span>
                </Link>
              )
            )}
          </div>
        </nav>

        <div className={styles.drawerFooter}>
          <div className={styles.socialGroup}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={styles.socialLink}
              >
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>

          <ActionButton
            text={cta.callLabel}
            href={cta.phoneHref}
            icon={<PhoneIcon />}
          />
        </div>
      </aside>
    </>
  );
}