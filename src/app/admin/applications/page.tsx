"use client";

import { useEffect, useState } from "react";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface ApplicationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  department?: string | null;
  experience: string;
  portfolioUrl?: string | null;
  coverNote?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  jobOpening?: {
    title: string;
    department: string;
  } | null;
}

const STATUSES = ["ALL", "NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [statusInput, setStatusInput] = useState("NEW");
  const [noteInput, setNoteInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const handleOpenDetail = (app: ApplicationItem) => {
    setSelectedApp(app);
    setStatusInput(app.status);
    setNoteInput(app.notes || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusInput,
          notes: noteInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, ...data.application } : a))
        );
        setSelectedApp((prev) => (prev ? { ...prev, ...data.application } : null));
      }
    } catch (err) {
      console.error("Failed to update application", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selectedApp?.id === id) setSelectedApp(null);
      }
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.45rem", fontWeight: 700, color: "#011c5b" }}>
            Job Applications
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(1, 28, 91, 0.65)" }}>
            Review candidate resumes, experience details, and applicant portfolios submitted through /career/apply.
          </p>
        </div>

        {/* Status Filter */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedStatus === st ? "#011c5b" : "rgba(1, 28, 91, 0.05)",
                color: selectedStatus === st ? "#ffffff" : "#011c5b",
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.tableContainer}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Candidate Name & Contact</th>
                <th>Position Applied</th>
                <th>Experience</th>
                <th>Resume / CV</th>
                <th>Status</th>
                <th>Submitted</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    No job applications found matching filter.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#011c5b", fontSize: "0.92rem" }}>{app.fullName}</div>
                      <div style={{ fontSize: "0.82rem", color: "#08aaec", fontWeight: 600 }}>{app.phone}</div>
                      <div style={{ fontSize: "0.76rem", color: "rgba(1, 28, 91, 0.6)" }}>{app.email}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "#011c5b" }}>{app.position}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.6)" }}>Location: {app.location}</div>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#011c5b" }}>{app.experience}</span>
                    </td>

                    <td>
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#08aaec",
                            textDecoration: "none",
                            backgroundColor: "rgba(8, 170, 236, 0.1)",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>{app.resumeFileName || "View Resume"}</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.76rem", color: "rgba(1, 28, 91, 0.45)" }}>No file attached</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`${commonStyles.pill} ${
                          app.status === "NEW"
                            ? commonStyles.pillNew
                            : app.status === "SHORTLISTED" || app.status === "HIRED"
                            ? commonStyles.pillConverted
                            : commonStyles.pillInProgress
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.6)" }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(app)}
                          className={commonStyles.btnSecondary}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        >
                          Review
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteApplication(app.id)}
                          className={commonStyles.btnDanger}
                          title="Delete application"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / HR Review Modal */}
      {selectedApp && (
        <div className={commonStyles.modalBackdrop} onClick={() => setSelectedApp(null)}>
          <div className={commonStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={commonStyles.modalHeader}>
              <h3 className={commonStyles.modalTitle}>Candidate Profile: {selectedApp.fullName}</h3>
              <button type="button" className={commonStyles.closeBtn} onClick={() => setSelectedApp(null)}>
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <span className={commonStyles.label}>Position Applied</span>
                <p style={{ fontWeight: 700, color: "#011c5b", fontSize: "1.05rem" }}>{selectedApp.position}</p>
                {(selectedApp.department || selectedApp.jobOpening?.department) && (
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.35rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#0369a1",
                      backgroundColor: "#e0f2fe",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {selectedApp.department || selectedApp.jobOpening?.department}
                  </span>
                )}
              </div>

              <div>
                <span className={commonStyles.label}>Experience Level</span>
                <p style={{ fontWeight: 600 }}>{selectedApp.experience}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Email Address</span>
                <p>{selectedApp.email}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Phone Number</span>
                <p style={{ fontWeight: 600, color: "#08aaec" }}>{selectedApp.phone}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Location</span>
                <p>{selectedApp.location}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Submitted On</span>
                <p>{new Date(selectedApp.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedApp.portfolioUrl && (
              <div style={{ marginBottom: "1rem" }}>
                <span className={commonStyles.label}>Portfolio / Profile Link</span>
                <p>
                  <a href={selectedApp.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: "#08aaec", fontWeight: 600 }}>
                    {selectedApp.portfolioUrl} ↗
                  </a>
                </p>
              </div>
            )}

            {selectedApp.coverNote && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid rgba(1, 28, 91, 0.08)" }}>
                <span className={commonStyles.label}>Cover Note / Motivation</span>
                <p style={{ fontSize: "0.88rem", marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>
                  {selectedApp.coverNote}
                </p>
              </div>
            )}

            {selectedApp.resumeUrl && (
              <div style={{ marginBottom: "1.5rem" }}>
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={commonStyles.btnSky}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download / Open Resume ({selectedApp.resumeFileName || "PDF"})</span>
                </a>
              </div>
            )}

            {/* Status & HR Notes */}
            <div style={{ borderTop: "1px solid rgba(1, 28, 91, 0.08)", paddingTop: "1.25rem" }}>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Application Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className={commonStyles.select}
                >
                  <option value="NEW">NEW (Awaiting review)</option>
                  <option value="REVIEWING">REVIEWING (Under evaluation)</option>
                  <option value="SHORTLISTED">SHORTLISTED (Selected for interview)</option>
                  <option value="HIRED">HIRED (Offer accepted)</option>
                  <option value="REJECTED">REJECTED (Not moving forward)</option>
                </select>
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Internal HR Evaluation Notes</label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Interview feedback, expected salary, notice period notes..."
                  className={commonStyles.textarea}
                  rows={3}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className={commonStyles.btnSecondary}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateStatus}
                  className={commonStyles.btnPrimary}
                >
                  {isUpdating ? "Saving..." : "Update Status & Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
