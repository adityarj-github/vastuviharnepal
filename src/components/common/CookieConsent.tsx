"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CookieConsent.module.css";

const CONSENT_STORAGE_KEY = "vastu_cookie_consent";
const CLIENT_ID_STORAGE_KEY = "vastu_client_id";

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (!id) {
    id = "cl_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
  }
  return id;
}

export function CookieConsent() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Preference switches
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    let timer: NodeJS.Timeout | null = null;
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!stored) {
      // Delay slightly for smooth page entry
      timer = setTimeout(() => {
        setIsBannerVisible(true);
      }, 800);
    } else {
      try {
        const parsed = JSON.parse(stored);
        setAnalytics(Boolean(parsed.analytics));
        setMarketing(Boolean(parsed.marketing));
        setPreferences(Boolean(parsed.preferences));
      } catch {
        setIsBannerVisible(true);
      }
    }

    // Global listener so Footer or any page link can open preferences modal
    const openHandler = () => {
      const current = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (current) {
        try {
          const parsed = JSON.parse(current);
          setAnalytics(Boolean(parsed.analytics));
          setMarketing(Boolean(parsed.marketing));
          setPreferences(Boolean(parsed.preferences));
        } catch { }
      }
      setIsBannerVisible(false);
      setIsModalOpen(true);
    };

    if (typeof window !== "undefined") {
      (window as any).__openCookieConsent = openHandler;
      window.addEventListener("open-cookie-preferences", openHandler);
      document.addEventListener("open-cookie-preferences", openHandler);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (typeof window !== "undefined") {
        delete (window as any).__openCookieConsent;
        window.removeEventListener("open-cookie-preferences", openHandler);
        document.removeEventListener("open-cookie-preferences", openHandler);
      }
    };
  }, []);

  const saveConsent = async (consentState: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }) => {
    const clientId = getOrCreateClientId();
    const payload = {
      clientId,
      ...consentState,
    };

    // 1. Save to localStorage immediately
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    setIsBannerVisible(false);
    setIsModalOpen(false);

    // 2. Sync to Backend Database
    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to sync cookie consent to backend:", err);
    }
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    setPreferences(true);
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleEssentialOnly = () => {
    setAnalytics(false);
    setMarketing(false);
    setPreferences(false);
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      essential: true,
      analytics,
      marketing,
      preferences,
    });
  };

  if (!hasMounted || pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* 1. Floating Cookie Consent Banner */}
      {isBannerVisible && !isModalOpen && (
        <aside
          className={styles.bannerOverlay}
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className={styles.bannerCard}>
            <div className={styles.bannerHeader}>
              <div className={styles.cookieIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <div>
                <h3 className={styles.bannerTitle}>We Value Your Privacy</h3>
                <p className={styles.bannerDesc}>
                  We use cookies to improve your browsing experience across our planned residential townships, analyze site traffic, and deliver relevant architectural updates. Read our{" "}
                  <Link href="/privacy-policy" className={styles.privacyLink}>
                    Privacy Policy
                  </Link>{" "}
                  to learn more.
                </p>
              </div>
            </div>

            <div className={styles.bannerActions}>
              <button
                type="button"
                className={styles.btnAccept}
                onClick={handleAcceptAll}
              >
                Accept All Cookies
              </button>
              <button
                type="button"
                className={styles.btnEssential}
                onClick={handleEssentialOnly}
              >
                Essential Only
              </button>
              <button
                type="button"
                className={styles.btnCustomize}
                onClick={() => setIsModalOpen(true)}
              >
                Customize Preferences
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Granular Cookie Preferences Modal */}
      {isModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 id="cookie-preferences-title" className={styles.modalTitle}>
                Cookie Preferences
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close preferences"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: "0.85rem", color: "rgba(1,28,91,0.7)", margin: "0 0 0.5rem" }}>
                Select which categories of cookies you wish to allow. Strictly necessary cookies cannot be disabled as they are required for basic site security and form functionality.
              </p>

              {/* Category 1: Essential */}
              <div className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <span className={styles.categoryTitle}>Strictly Necessary Cookies</span>
                  <span className={styles.alwaysActiveBadge}>Always Active</span>
                </div>
                <p className={styles.categoryDesc}>
                  Required for site navigation, security verification, lead registration forms, and core architectural portal features.
                </p>
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <span className={styles.categoryTitle}>Performance & Analytics</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      aria-label="Toggle Performance & Analytics cookies"
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
                <p className={styles.categoryDesc}>
                  Allows us to measure visitor traffic, Core Web Vitals, and popular residence model views so we can continuously improve user experience.
                </p>
              </div>

              {/* Category 3: Personalization */}
              <div className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <span className={styles.categoryTitle}>Preferences & Personalization</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={preferences}
                      onChange={(e) => setPreferences(e.target.checked)}
                      aria-label="Toggle Preferences cookies"
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
                <p className={styles.categoryDesc}>
                  Remembers your preferred township location (e.g. Birtamode or Birgunj), budget selections, and previously viewed floor plans.
                </p>
              </div>

              {/* Category 4: Marketing */}
              <div className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <span className={styles.categoryTitle}>Marketing & Communications</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      aria-label="Toggle Marketing cookies"
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
                <p className={styles.categoryDesc}>
                  Used to deliver tailored updates about township construction phases, housing expo invitations, and upcoming bungalow launches.
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnEssential}
                onClick={handleEssentialOnly}
              >
                Reject All Non-Essential
              </button>
              <button
                type="button"
                className={styles.btnSave}
                onClick={handleSaveCustom}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
