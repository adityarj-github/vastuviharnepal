"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import type { Contact as ContactData } from "@/data/contact";
import { ActionButton, FlipButton, IconButton } from "@/components/buttons";
import styles from "./Contact.module.css";

interface ContactClientProps {
  contacts: ContactData[];
}

const PURPOSE_OPTIONS = [
  "General Inquiry",
  "Bungalow & Villa Models",
  "Schedule Site Visit",
  "Investment Consultation",
  "Customer Support",
];

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ContactClient({ contacts }: ContactClientProps) {
  const contact = contacts[0];
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!contact) return null;

  const mapQuery = encodeURIComponent(contact.coordinates);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;
    if (!consent) {
      setConsentError(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Save lead to database
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          source: "Contact Form",
          purpose,
          message: message.trim() || undefined,
        }),
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setPurpose(PURPOSE_OPTIONS[0]);
    setMessage("");
    setConsent(false);
    setConsentError(false);
  };

  const phoneLinks = contact.phones.map((p) => ({
    phone: p,
    href: `tel:${p.replace(/[^+\d]/g, "")}`,
  }));

  return (
    <section
      ref={sectionRef} data-site-motion="off"
      className={`${styles.page} ${isVisible ? styles.visible : ""}`}
    >
      <div className={styles.contentPanel}>
        <div className={styles.container}>
          {/* Top Section: Lead Form (Left) & Map (Right) */}
          <div className={styles.topSection}>
            <div className={styles.contactLead}>
              <div
                className={`${styles.formCard} ${styles.revealItem}`}
                style={{ transitionDelay: "100ms" }}
              >
                <div className={styles.formHeader}>
                  <span className={styles.formEyebrow}>Get In Touch</span>
                  <h2 className={styles.formHeading}>Submit Your Enquiries</h2>
                  <p className={styles.formSubheading}>
                    Have a question, project inquiry, or need assistance? Leave your details and our team will get back to you shortly.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className={styles.successWrap}>
                    <p className={styles.successText}>
                      ✓ Thank you, <strong>{fullName}</strong>! Your inquiry has been registered. Our housing advisor will reach out to you shortly.
                    </p>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={handleReset}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                      {/* Full Name */}
                      <div className={styles.field}>
                        <label htmlFor="contact-name" className={styles.label}>
                          Full Name <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          placeholder="e.g. Ramesh Shrestha"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Phone Number */}
                      <div className={styles.field}>
                        <label htmlFor="contact-phone" className={styles.label}>
                          Phone Number <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+977 98XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Email Address */}
                      <div className={styles.field}>
                        <label htmlFor="contact-email" className={styles.label}>
                          Email Address <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder="e.g. ramesh@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Purpose Dropdown */}
                      <div className={styles.field} ref={dropdownRef}>
                        <label id="contact-purpose-label" className={styles.label}>
                          Purpose / Inquiry
                        </label>
                        <input type="hidden" name="purpose" value={purpose} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="contact-purpose"
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                            aria-labelledby="contact-purpose-label contact-purpose"
                            className={`${styles.dropdownTrigger} ${isDropdownOpen ? styles.dropdownTriggerOpen : ""
                              }`}
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{purpose}</span>
                            <svg
                              viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.dropdownChevronOpen : ""
                                }`}
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>

                          {isDropdownOpen && (
                            <div
                              className={styles.dropdownMenu}
                              role="listbox"
                              aria-labelledby="contact-purpose-label"
                            >
                              {PURPOSE_OPTIONS.map((opt) => {
                                const isSelected = purpose === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""
                                      }`}
                                    onClick={() => {
                                      setPurpose(opt);
                                      setIsDropdownOpen(false);
                                    }}
                                  >
                                    <span>{opt}</span>
                                    {isSelected && (
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={styles.optionCheck}
                                        aria-hidden="true"
                                      >
                                        <path d="M20 6 9 17l-5-5" />
                                      </svg>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message Field (Full width) */}
                      <div className={`${styles.field} ${styles.messageField}`}>
                        <label htmlFor="contact-message" className={styles.label}>
                          Your Message
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={3}
                          placeholder="Write your message or inquiry here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={styles.textarea}
                        />
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <div className={styles.consentRow}>
                      <label className={styles.consentLabel}>
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            if (e.target.checked) setConsentError(false);
                          }}
                          className={styles.consentCheckbox}
                          required
                        />
                        <span className={styles.consentText}>
                          I consent to Vastu Vihar Nepal collecting my details and contacting me via phone, email, or WhatsApp. I agree to the{" "}
                          <Link href="/privacy-policy" className={styles.consentLink}>
                            Privacy Policy
                          </Link>{" "}
                          and{" "}
                          <Link href="/terms" className={styles.consentLink}>
                            Terms &amp; Conditions
                          </Link>.
                        </span>
                      </label>
                      {consentError && (
                        <p className={styles.consentError}>
                          Please agree to the privacy policy and terms before submitting.
                        </p>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className={styles.actionsRow}>
                      <ActionButton
                        text={isSubmitting ? "Sending..." : "Submit Inquiry"}
                        type="submit"
                        disabled={isSubmitting || !consent}
                      />
                      <IconButton
                        href={`mailto:${contact.email}`}
                        ariaLabel="Email Vastu Vihar Nepal"
                        icon={<EmailIcon />}
                      />
                      <IconButton
                        href={`tel:${contact.phones[0]?.replace(/[^+\d]/g, "")}`}
                        ariaLabel="Call Vastu Vihar Nepal"
                        icon={<PhoneIcon />}
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* CTAs Below Form */}
              <div
                className={`${styles.formCtas} ${styles.revealItem}`}
                style={{ transitionDelay: "220ms" }}
                aria-label="More contact options"
              >
                <article className={styles.formCta}>
                  <div className={styles.ctaHeader}>
                    <span className={styles.ctaTag}>Site</span>
                    <span className={styles.ctaCategory}>Project Contacts</span>
                  </div>
                  <h3 className={styles.ctaTitle}>Site Contact</h3>
                  <p className={styles.ctaDescription}>
                    Connect directly with our on-site engineers, project directors, and site office in Birgunj.
                  </p>
                  <FlipButton className={styles.ctaAction} text="Explore Site" href="/contact/site" />
                </article>

                <article className={styles.formCta}>
                  <div className={styles.ctaHeader}>
                    <span className={styles.ctaTag}>Branch</span>
                    <span className={styles.ctaCategory}>Office Contacts</span>
                  </div>
                  <h3 className={styles.ctaTitle}>Branch Contact</h3>
                  <p className={styles.ctaDescription}>
                    Find our branch offices across Birgunj, Kathmandu, Birtamode, and Janakpur.
                  </p>
                  <FlipButton className={styles.ctaAction} text="Find Branches" href="/contact/branch" />
                </article>
              </div>
            </div>

            {/* Right: Map Column */}
            <div
              className={`${styles.mapColumn} ${styles.revealItem}`}
              style={{ transitionDelay: "180ms" }}
            >
              <iframe
                title="Map showing the Birtamode contact office"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <aside className={styles.mapCard}>
                <span className={styles.mapEyebrow}>Our Location</span>
                <h3 className={styles.mapTitle}>Birtamode Office</h3>
                <p className={styles.mapAddress}>
                  <PinIcon />
                  <span>{contact.address}</span>
                </p>
                <ActionButton
                  className={styles.mapButton}
                  text="View on Google Maps"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                />
              </aside>
            </div>
          </div>

          {/* Bottom Contact Tiles */}
          <section className={styles.contactTiles} aria-label="Contact information">
            <article
              className={`${styles.contactTile} ${styles.phoneTile} ${styles.revealItem}`}
              style={{ transitionDelay: "280ms" }}
            >
              <span className={styles.tileIcon}>
                <PhoneIcon />
              </span>
              <div className={styles.tileContent}>
                <span className={styles.tileLabel}>Call Us</span>
                <div className={styles.tileValues}>
                  {phoneLinks.map(({ phone, href }) => (
                    <a href={href} key={phone}>
                      {phone}
                    </a>
                  ))}
                </div>
                <p className={styles.tileNote}>Direct line for project details & site visits</p>
              </div>
            </article>

            <article
              className={`${styles.contactTile} ${styles.emailTile} ${styles.revealItem}`}
              style={{ transitionDelay: "360ms" }}
            >
              <span className={styles.tileIcon}>
                <EmailIcon />
              </span>
              <div className={styles.tileContent}>
                <span className={styles.tileLabel}>Email Us</span>
                <div className={styles.tileValues}>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <p className={styles.tileNote}>We will respond within 24 business hours</p>
              </div>
            </article>

            <article
              className={`${styles.contactTile} ${styles.locationTile} ${styles.revealItem}`}
              style={{ transitionDelay: "440ms" }}
            >
              <span className={styles.tileIcon}>
                <PinIcon />
              </span>
              <div className={styles.tileContent}>
                <span className={styles.tileLabel}>Visit Us</span>
                <div className={styles.tileValues}>
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    Birtamode, Jhapa
                  </a>
                </div>
                <p className={styles.tileNote}>{contact.address}</p>
              </div>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}
