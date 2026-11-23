"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { ActionButton, IconButton } from "@/components/buttons";
import type { ProjectItem } from "@/data/projects";
import styles from "./ModelLeadSection.module.css";

interface ModelLeadSectionProps {
  currentModel?: ProjectItem;
}

const PURPOSE_OPTIONS = [
  "Residential Living",
  "Investment",
  "Vacation / Holiday Home",
  "Commercial / Other",
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

export function ModelLeadSection({ currentModel }: ModelLeadSectionProps) {
  // Store selected residence in background (not shown in UI)
  const residenceName = currentModel?.name ?? "General Inquiry";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on outside click or escape
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    // Background payload includes residenceName, name, phone, budget, purpose
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setPhone("");
    setBudget("");
    setPurpose(PURPOSE_OPTIONS[0]);
  };

  return (
    <section className={styles.section} aria-labelledby="lead-form-heading">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 id="lead-form-heading" className={styles.heading}>
            Inquire About This Residence
          </h2>
          <p className={styles.subheading}>
            Leave your contact details and our team will get in touch with you shortly.
          </p>
        </div>

        {isSubmitted ? (
          <div className={styles.successWrap}>
            <p className={styles.successText}>
              ✓ Thank you, <strong>{fullName}</strong>! Your inquiry has been registered. Our housing advisor will call you at <strong>{phone}</strong> soon.
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleReset}
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Background selected residence */}
            <input type="hidden" name="residence" value={residenceName} />

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="lead-name" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shrestha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-phone" className={styles.label}>
                  Phone Number <span className={styles.required}>*</span>
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  placeholder="+977 98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-budget" className={styles.label}>
                  Budget
                </label>
                <input
                  id="lead-budget"
                  type="text"
                  placeholder="e.g. NPR 80L - 1.5 Cr"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* Redesigned Round-Corner Dropdown with Background */}
              <div className={styles.field} ref={dropdownRef}>
                <label id="lead-purpose-label" className={styles.label}>
                  Purpose
                </label>
                <input type="hidden" name="purpose" value={purpose} />

                <div className={styles.dropdownWrap}>
                  <button
                    type="button"
                    id="lead-purpose"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-labelledby="lead-purpose-label lead-purpose"
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
                      aria-labelledby="lead-purpose-label"
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
            </div>

            {/* Actions row: ActionButton + Round Email + Round Call */}
            <div className={styles.actionsRow}>
              <ActionButton
                text={isSubmitting ? "Submitting..." : "Submit Inquiry"}
                type="submit"
                disabled={isSubmitting}
              />

              <IconButton
                href="mailto:info@vastuvihar.org"
                ariaLabel="Email Vastu Vihar Nepal"
                icon={<EmailIcon />}
              />

              <IconButton
                href="tel:+9779705191815"
                ariaLabel="Call Vastu Vihar Nepal"
                icon={<PhoneIcon />}
              />
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
