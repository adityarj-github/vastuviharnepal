"use client";

import { motionScrollBehavior } from "@/components/animation/motionPreference";
import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActionButton } from "@/components/buttons";
import { careerPageData, type JobOpening } from "@/data/career";
import styles from "./CareerApply.module.css";

interface CareerApplyClientProps {
  initialOpenings?: JobOpening[];
}

const EXPERIENCE_OPTIONS = [
  "Entry Level / Fresher (< 1 Year)",
  "1 - 3 Years",
  "3 - 5 Years",
  "5 - 8 Years",
  "8+ Years",
];

const NOTICE_PERIOD_OPTIONS = [
  "Immediate Joiner (< 15 Days)",
  "15 - 30 Days",
  "1 - 2 Months",
  "2+ Months",
];

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.dropdownChevron} ${isOpen ? styles.dropdownChevronOpen : ""}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="m12 2 9 4.5-9 4.5-9-4.5L12 2Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  );
}

export function CareerApplyClient({ initialOpenings }: CareerApplyClientProps = {}) {
  const searchParams = useSearchParams();
  const urlPosition = searchParams.get("position");

  const openings =
    initialOpenings && initialOpenings.length > 0
      ? initialOpenings
      : careerPageData.openings;

  const positionOptions = [
    ...openings.map((job) => job.title),
    "General / Open Application",
  ];

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const initialPosition =
    urlPosition && positionOptions.some((p) => p.toLowerCase() === urlPosition.toLowerCase())
      ? positionOptions.find((p) => p.toLowerCase() === urlPosition.toLowerCase())!
      : positionOptions[0];

  const [position, setPosition] = useState(initialPosition);
  const [prevUrlPosition, setPrevUrlPosition] = useState(urlPosition);
  if (urlPosition !== prevUrlPosition) {
    setPrevUrlPosition(urlPosition);
    if (urlPosition) {
      const match = positionOptions.find(
        (p) => p.toLowerCase() === urlPosition.toLowerCase()
      );
      if (match) {
        setPosition(match);
      }
    }
  }
  const selectedJob =
    openings.find((job) => job.title.toLowerCase() === position.toLowerCase()) ?? null;
  const isJobLocked = Boolean(
    urlPosition &&
      openings.some((job) => job.title.toLowerCase() === urlPosition.toLowerCase())
  );
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[1]);
  const [currentOrg, setCurrentOrg] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [noticePeriod, setNoticePeriod] = useState(NOTICE_PERIOD_OPTIONS[0]);
  const [message, setMessage] = useState("");

  // Resume File state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Dropdown states
  const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);

  // Consent & Submission states
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posDropdownRef = useRef<HTMLDivElement>(null);
  const expDropdownRef = useRef<HTMLDivElement>(null);
  const noticeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        posDropdownRef.current &&
        !posDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPosDropdownOpen(false);
      }
      if (
        expDropdownRef.current &&
        !expDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpDropdownOpen(false);
      }
      if (
        noticeDropdownRef.current &&
        !noticeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNoticeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File handling helpers
  const validateAndSetFile = (file: File) => {
    setFileError(null);
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setFileError("Please upload a valid PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10 MB. Please upload a smaller file.");
      return;
    }

    setResumeFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!consent) {
      setConsentError(true);
      return;
    }

    if (!resumeFile) {
      setFileError("Please attach your resume or CV before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("location", city.trim());
      formData.append("position", position.trim());
      if (selectedJob?.department) {
        formData.append("department", selectedJob.department);
      }
      formData.append("experience", experience.trim());
      formData.append("currentOrg", currentOrg.trim());
      formData.append("portfolioUrl", portfolio.trim());
      formData.append("noticePeriod", noticePeriod.trim());
      formData.append("coverNote", message.trim());
      formData.append("resume", resumeFile);

      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error || "Failed to submit application.");
        return;
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 380, behavior: motionScrollBehavior() });
    } catch (err) {
      console.error("Error submitting job application:", err);
      setSubmitError("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setCity("");
    setPosition(initialPosition);
    setExperience(EXPERIENCE_OPTIONS[1]);
    setCurrentOrg("");
    setPortfolio("");
    setNoticePeriod(NOTICE_PERIOD_OPTIONS[0]);
    setMessage("");
    setResumeFile(null);
    setConsent(false);
    setConsentError(false);
    setFileError(null);
    setSubmitError(null);
    setIsSubmitted(false);
  };

  return (
    <div className={styles.page}>
      <section className={styles.contentPanel} aria-label="Career Application Section">
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            {/* Left Column: Selected Job Details (Role Overview, Description, Requirements) */}
            <aside className={styles.jobDetailsColumn} aria-label="Selected Job Details">
              <div className={styles.jobDetailsCard}>
                {selectedJob ? (
                  <>
                    <div className={styles.jobDetailsHeader}>
                      <span className={styles.formEyebrow}>Role Overview</span>
                      <span className={styles.jobStatusPill}>★ Open Role</span>
                    </div>

                    <h2 className={styles.jobDetailsTitle}>{selectedJob.title}</h2>

                    <div className={styles.jobMetaBadges}>
                      <span className={styles.jobMetaBadge}>
                        <LayersIcon />
                        <span>{selectedJob.department}</span>
                      </span>
                      <span className={styles.jobMetaBadge}>
                        <BriefcaseIcon />
                        <span>{selectedJob.type}</span>
                      </span>
                      <span className={styles.jobMetaBadge}>
                        <PinIcon />
                        <span>{selectedJob.location}</span>
                      </span>
                    </div>

                    <div className={styles.jobSection}>
                      <h3 className={styles.jobSectionTitle}>Role Overview</h3>
                      <p className={styles.jobDescription}>{selectedJob.description}</p>
                    </div>

                    {selectedJob.jobDescription && selectedJob.jobDescription.length > 0 && (
                      <div className={styles.jobSection}>
                        <h3 className={styles.jobSectionTitle}>Job Description</h3>
                        <ul className={styles.requirementsList}>
                          {selectedJob.jobDescription.map((item, idx) => (
                            <li key={idx} className={styles.requirementItem}>
                              <span className={styles.requirementBullet} aria-hidden="true">
                                <CheckmarkIcon />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                      <div className={styles.jobSection}>
                        <h3 className={styles.jobSectionTitle}>Job Requirements</h3>
                        <ul className={styles.requirementsList}>
                          {selectedJob.requirements.map((req, idx) => (
                            <li key={idx} className={styles.requirementItem}>
                              <span className={styles.requirementBullet} aria-hidden="true">
                                <CheckmarkIcon />
                              </span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className={styles.jobDetailsHeader}>
                      <span className={styles.formEyebrow}>Open Application</span>
                      <span className={styles.jobStatusPill}>★ General Pool</span>
                    </div>

                    <h2 className={styles.jobDetailsTitle}>General / Open Application</h2>

                    <div className={styles.jobSection}>
                      <h3 className={styles.jobSectionTitle}>Role Overview</h3>
                      <p className={styles.jobDescription}>
                        {careerPageData.directApplication.description}
                      </p>
                    </div>

                    {openings.length > 0 && (
                      <div className={styles.jobSection}>
                        <h3 className={styles.jobSectionTitle}>Current Open Positions</h3>
                        <div className={styles.openRolesQuickList}>
                          {openings.map((job) => (
                            <button
                              key={job.id}
                              type="button"
                              className={styles.openRoleChip}
                              onClick={() => setPosition(job.title)}
                            >
                              <span>{job.title}</span>
                              <span className={styles.openRoleChipMeta}>{job.location}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </aside>

            {/* Right Column: Form Card */}
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h1 className={styles.formHeading}>Apply</h1>
                <p className={styles.formSubheading}>
                  Join our forward-thinking team designing and constructing earthquake-resilient, monolithic master-planned communities across Nepal.
                </p>
              </div>

              {isSubmitted ? (
                <div className={styles.successWrap} data-motion-feedback role="alert">
                  <div className={styles.successIconBadge}>
                    <CheckmarkIcon />
                  </div>
                  <h2 className={styles.successTitle}>Application Submitted Successfully!</h2>
                  <p className={styles.successText}>
                    Thank you, <strong>{fullName}</strong>. We have received your application for the <strong>{position}</strong> role along with your resume (<em>{resumeFile?.name}</em>).
                  </p>
                  <p className={styles.successText}>
                    Our talent acquisition team will review your profile against our active project requirements. Shortlisted candidates are contacted within 3 to 5 business days.
                  </p>
                  <button type="button" className={styles.resetBtn} onClick={handleReset}>
                    Submit another application
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
                  {/* Block 1: Personal Details */}
                  <div className={styles.sectionBlock} data-site-reveal="quiet">
                    <h2 className={styles.sectionBlockTitle}>1. Personal Information</h2>
                    <div className={styles.grid}>
                      {/* Full Name */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-name" className={styles.label}>
                          Full Name <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="applicant-name"
                          name="name"
                          type="text"
                          required
                          placeholder="e.g. Ramesh Shrestha"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Email Address */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-email" className={styles.label}>
                          Email Address <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="applicant-email"
                          name="email"
                          type="email"
                          required
                          placeholder="e.g. ramesh@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Phone Number */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-phone" className={styles.label}>
                          Phone Number <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="applicant-phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+977 98XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Current City / Town */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-city" className={styles.label}>
                          Current City / Town <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="applicant-city"
                          name="city"
                          type="text"
                          required
                          placeholder="e.g. Birtamode, Jhapa"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Block 2: Professional Profile & Role */}
                  <div className={styles.sectionBlock} data-site-reveal="quiet">
                    <h2 className={styles.sectionBlockTitle}>2. Role &amp; Professional Background</h2>
                    <div className={styles.grid}>
                      {/* Position Applied For */}
                      <div className={`${styles.field} ${styles.fullWidth}`} ref={posDropdownRef}>
                        <label id="applicant-pos-label" className={styles.label}>
                          Position Applying For <span className={styles.required}>*</span>
                        </label>
                        <input type="hidden" name="position" value={position} />
                        {isJobLocked && selectedJob ? (
                          <div className={styles.lockedPositionDisplay} aria-labelledby="applicant-pos-label">
                            <span className={styles.lockedPositionTitle}>{selectedJob.title}</span>
                            <span className={styles.lockedPositionMeta}>{selectedJob.department}</span>
                          </div>
                        ) : (
                          <div className={styles.dropdownWrap}>
                            <button
                              type="button"
                              id="applicant-position"
                              aria-haspopup="listbox"
                              aria-expanded={isPosDropdownOpen}
                              aria-labelledby="applicant-pos-label applicant-position"
                              className={`${styles.dropdownTrigger} ${isPosDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                              onClick={() => setIsPosDropdownOpen((prev) => !prev)}
                            >
                              <span className={styles.dropdownValue}>{position}</span>
                              <ChevronDownIcon isOpen={isPosDropdownOpen} />
                            </button>

                            {isPosDropdownOpen && (
                              <div className={styles.dropdownMenu} role="listbox" data-motion-popover aria-labelledby="applicant-pos-label">
                                {positionOptions.map((opt) => {
                                  const isSelected = position === opt;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      role="option"
                                      aria-selected={isSelected}
                                      className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""}`}
                                      onClick={() => {
                                        setPosition(opt);
                                        setIsPosDropdownOpen(false);
                                      }}
                                    >
                                      <span>{opt}</span>
                                      {isSelected && <span className={styles.optionCheck}><CheckmarkIcon /></span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Total Relevant Experience */}
                      <div className={styles.field} ref={expDropdownRef}>
                        <label id="applicant-exp-label" className={styles.label}>
                          Relevant Experience <span className={styles.required}>*</span>
                        </label>
                        <input type="hidden" name="experience" value={experience} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="applicant-experience"
                            aria-haspopup="listbox"
                            aria-expanded={isExpDropdownOpen}
                            aria-labelledby="applicant-exp-label applicant-experience"
                            className={`${styles.dropdownTrigger} ${isExpDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                            onClick={() => setIsExpDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{experience}</span>
                            <ChevronDownIcon isOpen={isExpDropdownOpen} />
                          </button>

                          {isExpDropdownOpen && (
                            <div className={styles.dropdownMenu} role="listbox" data-motion-popover aria-labelledby="applicant-exp-label">
                              {EXPERIENCE_OPTIONS.map((opt) => {
                                const isSelected = experience === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""}`}
                                    onClick={() => {
                                      setExperience(opt);
                                      setIsExpDropdownOpen(false);
                                    }}
                                  >
                                    <span>{opt}</span>
                                    {isSelected && <span className={styles.optionCheck}><CheckmarkIcon /></span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notice Period / Availability */}
                      <div className={styles.field} ref={noticeDropdownRef}>
                        <label id="applicant-notice-label" className={styles.label}>
                          Notice Period / Availability
                        </label>
                        <input type="hidden" name="noticePeriod" value={noticePeriod} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="applicant-notice"
                            aria-haspopup="listbox"
                            aria-expanded={isNoticeDropdownOpen}
                            aria-labelledby="applicant-notice-label applicant-notice"
                            className={`${styles.dropdownTrigger} ${isNoticeDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                            onClick={() => setIsNoticeDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{noticePeriod}</span>
                            <ChevronDownIcon isOpen={isNoticeDropdownOpen} />
                          </button>

                          {isNoticeDropdownOpen && (
                            <div className={styles.dropdownMenu} role="listbox" data-motion-popover aria-labelledby="applicant-notice-label">
                              {NOTICE_PERIOD_OPTIONS.map((opt) => {
                                const isSelected = noticePeriod === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""}`}
                                    onClick={() => {
                                      setNoticePeriod(opt);
                                      setIsNoticeDropdownOpen(false);
                                    }}
                                  >
                                    <span>{opt}</span>
                                    {isSelected && <span className={styles.optionCheck}><CheckmarkIcon /></span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current / Previous Employer or College */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-org" className={styles.label}>
                          Current Employer / Institution
                        </label>
                        <input
                          id="applicant-org"
                          name="organization"
                          type="text"
                          placeholder="e.g. ABC Engineering Consultancy"
                          value={currentOrg}
                          onChange={(e) => setCurrentOrg(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      {/* Portfolio / LinkedIn URL */}
                      <div className={styles.field}>
                        <label htmlFor="applicant-portfolio" className={styles.label}>
                          LinkedIn or Portfolio Link
                        </label>
                        <input
                          id="applicant-portfolio"
                          name="portfolio"
                          type="url"
                          placeholder="https://linkedin.com/in/... or portfolio"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Block 3: Resume Upload with Custom Picking Button */}
                  <div className={styles.sectionBlock} data-site-reveal="quiet">
                    <h2 className={styles.sectionBlockTitle}>3. Resume / Curriculum Vitae</h2>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Attach Resume <span className={styles.required}>*</span>
                      </label>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        id="resume-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className={styles.hiddenFileInput}
                        aria-label="Upload resume file"
                      />

                      {resumeFile ? (
                        /* Selected File Card */
                        <div className={styles.selectedFileCard} data-motion-feedback>
                          <div className={styles.selectedFileInfo}>
                            <div className={styles.docIconWrap}>
                              <DocumentIcon />
                            </div>
                            <div className={styles.selectedFileMeta}>
                              <span className={styles.selectedFileName} title={resumeFile.name}>
                                {resumeFile.name}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span className={styles.selectedFileSize}>
                                  {formatFileSize(resumeFile.size)}
                                </span>
                                <span className={styles.fileSuccessBadge}>
                                  <CheckmarkIcon /> Attached
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className={styles.removeFileBtn}
                            title="Remove attached resume"
                            aria-label="Remove attached resume"
                          >
                            <CloseIcon />
                          </button>
                        </div>
                      ) : (
                        /* Upload Dropzone with Custom Action-Style Button */
                        <div
                          className={`${styles.uploadDropzone} ${isDragging ? styles.uploadDropzoneDragging : ""}`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              fileInputRef.current?.click();
                            }
                          }}
                        >
                          <div className={styles.uploadIconBadge}>
                            <UploadCloudIcon />
                          </div>
                          <div className={styles.uploadPrompt}>
                            <span className={styles.uploadTitle}>
                              Drag and drop your resume here, or browse
                            </span>
                            <span className={styles.uploadHint}>
                              Supports PDF, DOC, or DOCX (Max file size: 10 MB)
                            </span>
                          </div>

                          {/* Designed Picking File Button matching our philosophy */}
                          <button
                            type="button"
                            className={styles.filePickerBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <span>Choose Resume File</span>
                            <span className={styles.filePickerIconCircle}>
                              <ArrowUpIcon />
                            </span>
                          </button>
                        </div>
                      )}

                      {fileError && <p className={styles.consentError}>{fileError}</p>}
                    </div>
                  </div>

                  {/* Block 4: Cover Letter / Message */}
                  <div className={styles.sectionBlock} data-site-reveal="quiet">
                    <h2 className={styles.sectionBlockTitle}>4. Brief Note / Message (Optional)</h2>
                    <div className={styles.field}>
                      <label htmlFor="applicant-message" className={styles.label}>
                        Cover Note / Why Vastu Vihar Nepal?
                      </label>
                      <textarea
                        id="applicant-message"
                        name="message"
                        rows={3}
                        placeholder="Tell us briefly about your engineering/design highlights, key achievements, or motivation to join Vastu Vihar Nepal..."
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
                        I certify that the information provided is accurate and consent to Vastu Vihar Nepal storing my resume and contacting me regarding career opportunities in accordance with the{" "}
                        <Link href="/privacy-policy" className={styles.consentLink} target="_blank">
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" className={styles.consentLink} target="_blank">
                          Terms &amp; Conditions
                        </Link>.
                      </span>
                    </label>
                    {consentError && (
                      <p className={styles.consentError}>
                        Please check the agreement box before submitting your application.
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p className={styles.consentError} role="alert" style={{ paddingLeft: 0 }}>
                      {submitError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className={styles.actionsRow}>
                    <ActionButton
                      text={isSubmitting ? "Submitting Application..." : "Submit Application"}
                      type="submit"
                      disabled={isSubmitting}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Section: Hiring Process & Career Information */}
          <aside className={styles.bottomSection} aria-label="Career Information and Steps">
            {/* Card 1: Navy Grid */}
            <div className={`${styles.bottomCard} ${styles.bottomCardNavy}`}>
              <h3 className={styles.bottomCardTitle}>Build Meaningful Communities</h3>
              <p className={styles.bottomCardText}>
                At Vastu Vihar Nepal, your work directly shapes master-planned townships, earthquake-resilient monolithic housing, and modern urban sanctuaries for generations of families.
              </p>
            </div>

            {/* Card 2: Sky Blue */}
            <div className={`${styles.bottomCard} ${styles.bottomCardSky}`}>
              <h3 className={styles.bottomCardTitle}>Our Hiring Process</h3>
              <ol className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <span className={styles.stepNum}>1</span>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepHeading}>Application &amp; CV Review</strong>
                    <span className={styles.stepDesc}>
                      Our technical leads evaluate your experience, qualifications, and project portfolio.
                    </span>
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNum}>2</span>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepHeading}>Technical Interview</strong>
                    <span className={styles.stepDesc}>
                      A focused conversation regarding architectural design, site execution, or sales domain expertise.
                    </span>
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNum}>3</span>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepHeading}>Leadership &amp; Offer</strong>
                    <span className={styles.stepDesc}>
                      Discussion with project directors regarding career growth, compensation, and onboarding roadmap.
                    </span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Card 3: Light Minimal */}
            <div className={`${styles.bottomCard} ${styles.bottomCardLight}`}>
              <h3 className={styles.bottomCardTitle}>Talent Acquisition Desk</h3>
              <p className={styles.bottomCardText}>
                Have questions regarding active roles, compensation, or internship programs? Reach our recruiting team directly:
              </p>
              <div className={styles.contactList}>
                <a
                  href={`mailto:${careerPageData.directApplication.email}`}
                  className={styles.contactLink}
                >
                  <span className={styles.contactIconCircle}>
                    <EmailIcon />
                  </span>
                  <span>{careerPageData.directApplication.email}</span>
                </a>
                <a
                  href={`tel:${careerPageData.directApplication.phone.replace(/[^+\d]/g, "")}`}
                  className={styles.contactLink}
                >
                  <span className={styles.contactIconCircle}>
                    <PhoneIcon />
                  </span>
                  <span>{careerPageData.directApplication.phone}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
