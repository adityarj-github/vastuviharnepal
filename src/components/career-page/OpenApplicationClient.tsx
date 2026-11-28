"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import { careerPageData } from "@/data/career";
import styles from "./CareerApply.module.css";

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

const DEPARTMENT_OPTIONS = [
  "Engineering & Design",
  "Planning & Architecture",
  "Construction Operations",
  "Sales & Customer Relations",
  "Marketing & Communications",
  "Finance & Administration",
  "Quality Assurance",
  "Other / General",
];

const DISCIPLINES = [
  "Architecture & 3D Visualization",
  "Civil & Structural Engineering (RCC / Monolithic)",
  "Site Supervision & Quality Assurance",
  "Township Sales & Client Advisory",
  "Project Management, Finance & Operations",
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

export function OpenApplicationClient() {
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);
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
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isExpDropdownOpen, setIsExpDropdownOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);

  // Consent & Submission states
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const expDropdownRef = useRef<HTMLDivElement>(null);
  const noticeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
      if (expDropdownRef.current && !expDropdownRef.current.contains(event.target as Node)) {
        setIsExpDropdownOpen(false);
      }
      if (noticeDropdownRef.current && !noticeDropdownRef.current.contains(event.target as Node)) {
        setIsNoticeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateAndSetFile = (file: File) => {
    setFileError(null);
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setFileError("Please upload a valid PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

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

      const formattedPosition = desiredRole.trim()
        ? `${desiredRole.trim()} (Open Application)`
        : "General / Open Application";

      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("location", city.trim());
      formData.append("position", formattedPosition);
      formData.append("department", department.trim());
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
        setSubmitError(err.error || "Failed to submit open application.");
        return;
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 380, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting open application:", err);
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
    setDesiredRole("");
    setDepartment(DEPARTMENT_OPTIONS[0]);
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
      <section className={styles.contentPanel} aria-label="Standalone Open Application Section">
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            {/* Left Column: Standalone Open Application Overview */}
            <aside className={styles.jobDetailsColumn} aria-label="Open Application Information">
              <div className={styles.jobDetailsCard}>
                <div className={styles.jobDetailsHeader}>
                  <span className={styles.formEyebrow}>Spontaneous Application</span>
                  <span className={styles.jobStatusPill}>★ Talent Pool</span>
                </div>

                <h2 className={styles.jobDetailsTitle}>
                  Don&apos;t See Your Exact Role? Pitch Yourself.
                </h2>

                <div className={styles.jobSection}>
                  <h3 className={styles.jobSectionTitle}>How Open Applications Work</h3>
                  <p className={styles.jobDescription}>
                    {careerPageData.directApplication.description} Even when a specific vacancy isn&apos;t listed, our leadership team regularly creates roles for standout engineers, architects, and township advisors.
                  </p>
                </div>

                <div className={styles.jobSection}>
                  <h3 className={styles.jobSectionTitle}>Disciplines We Regularly Hire For</h3>
                  <ul className={styles.requirementsList}>
                    {DISCIPLINES.map((item) => (
                      <li key={item} className={styles.requirementItem}>
                        <span className={styles.requirementBullet} aria-hidden="true">
                          <CheckmarkIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Right Column: Standalone Open Application Form */}
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formEyebrow}>Open Application</span>
                <h1 className={styles.formHeading}>Submit Your Profile</h1>
                <p className={styles.formSubheading}>
                  Tell us about your expertise and the kind of impact you want to make at Vastu Vihar Nepal.
                </p>
              </div>

              {isSubmitted ? (
                <div className={styles.successWrap} role="alert">
                  <div className={styles.successIconBadge}>
                    <CheckmarkIcon />
                  </div>
                  <h2 className={styles.successTitle}>Open Application Received!</h2>
                  <p className={styles.successText}>
                    Thank you, <strong>{fullName}</strong>. We have received your open application for{" "}
                    <strong>{desiredRole.trim() || "General / Open Application"}</strong> along with your resume (<em>{resumeFile?.name}</em>).
                  </p>
                  <p className={styles.successText}>
                    Our talent acquisition team will keep your profile in our active talent pool and reach out when a matching opportunity aligns with your background.
                  </p>
                  <button type="button" className={styles.resetBtn} onClick={handleReset}>
                    Submit another open application
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
                  {/* Block 1: Personal Details */}
                  <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionBlockTitle}>1. Personal Information</h2>
                    <div className={styles.grid}>
                      <div className={styles.field}>
                        <label htmlFor="open-name" className={styles.label}>
                          Full Name <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="open-name"
                          name="name"
                          type="text"
                          required
                          placeholder="e.g. Ramesh Shrestha"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="open-email" className={styles.label}>
                          Email Address <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="open-email"
                          name="email"
                          type="email"
                          required
                          placeholder="e.g. ramesh@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="open-phone" className={styles.label}>
                          Phone Number <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="open-phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+977 98XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="open-city" className={styles.label}>
                          Current City / Town <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="open-city"
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

                  {/* Block 2: Desired Role & Background */}
                  <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionBlockTitle}>2. Desired Role &amp; Experience</h2>
                    <div className={styles.grid}>
                      <div className={styles.field}>
                        <label htmlFor="open-role" className={styles.label}>
                          Desired Role or Area of Expertise <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="open-role"
                          name="desiredRole"
                          type="text"
                          required
                          placeholder="e.g. Quantity Surveyor, Junior Architect"
                          value={desiredRole}
                          onChange={(e) => setDesiredRole(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.field} ref={deptDropdownRef}>
                        <label id="open-dept-label" className={styles.label}>
                          Department <span className={styles.required}>*</span>
                        </label>
                        <input type="hidden" name="department" value={department} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="open-department"
                            aria-haspopup="listbox"
                            aria-expanded={isDeptDropdownOpen}
                            aria-labelledby="open-dept-label open-department"
                            className={`${styles.dropdownTrigger} ${isDeptDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                            onClick={() => setIsDeptDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{department}</span>
                            <ChevronDownIcon isOpen={isDeptDropdownOpen} />
                          </button>

                          {isDeptDropdownOpen && (
                            <div className={styles.dropdownMenu} role="listbox" aria-labelledby="open-dept-label">
                              {DEPARTMENT_OPTIONS.map((opt) => {
                                const isSelected = department === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""}`}
                                    onClick={() => {
                                      setDepartment(opt);
                                      setIsDeptDropdownOpen(false);
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

                      <div className={styles.field} ref={expDropdownRef}>
                        <label id="open-exp-label" className={styles.label}>
                          Relevant Experience <span className={styles.required}>*</span>
                        </label>
                        <input type="hidden" name="experience" value={experience} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="open-experience"
                            aria-haspopup="listbox"
                            aria-expanded={isExpDropdownOpen}
                            aria-labelledby="open-exp-label open-experience"
                            className={`${styles.dropdownTrigger} ${isExpDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                            onClick={() => setIsExpDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{experience}</span>
                            <ChevronDownIcon isOpen={isExpDropdownOpen} />
                          </button>

                          {isExpDropdownOpen && (
                            <div className={styles.dropdownMenu} role="listbox" aria-labelledby="open-exp-label">
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

                      <div className={styles.field} ref={noticeDropdownRef}>
                        <label id="open-notice-label" className={styles.label}>
                          Notice Period / Availability
                        </label>
                        <input type="hidden" name="noticePeriod" value={noticePeriod} />
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="open-notice"
                            aria-haspopup="listbox"
                            aria-expanded={isNoticeDropdownOpen}
                            aria-labelledby="open-notice-label open-notice"
                            className={`${styles.dropdownTrigger} ${isNoticeDropdownOpen ? styles.dropdownTriggerOpen : ""}`}
                            onClick={() => setIsNoticeDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{noticePeriod}</span>
                            <ChevronDownIcon isOpen={isNoticeDropdownOpen} />
                          </button>

                          {isNoticeDropdownOpen && (
                            <div className={styles.dropdownMenu} role="listbox" aria-labelledby="open-notice-label">
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

                      <div className={styles.field}>
                        <label htmlFor="open-org" className={styles.label}>
                          Current Employer / Institution
                        </label>
                        <input
                          id="open-org"
                          name="organization"
                          type="text"
                          placeholder="e.g. ABC Engineering Consultancy"
                          value={currentOrg}
                          onChange={(e) => setCurrentOrg(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="open-portfolio" className={styles.label}>
                          LinkedIn or Portfolio Link
                        </label>
                        <input
                          id="open-portfolio"
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

                  {/* Block 3: Resume Upload */}
                  <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionBlockTitle}>3. Resume / Curriculum Vitae</h2>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Attach Resume <span className={styles.required}>*</span>
                      </label>

                      <input
                        ref={fileInputRef}
                        id="open-resume-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className={styles.hiddenFileInput}
                        aria-label="Upload resume file"
                      />

                      {resumeFile ? (
                        <div className={styles.selectedFileCard}>
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

                  {/* Block 4: Pitch / Cover Note */}
                  <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionBlockTitle}>4. Your Pitch / Note (Optional)</h2>
                    <div className={styles.field}>
                      <label htmlFor="open-message" className={styles.label}>
                        How can you contribute to Vastu Vihar Nepal?
                      </label>
                      <textarea
                        id="open-message"
                        name="message"
                        rows={3}
                        placeholder="Share your key skills, past projects, or what kind of role you are looking to build with us..."
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
                      text={isSubmitting ? "Submitting Application..." : "Submit Open Application"}
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
