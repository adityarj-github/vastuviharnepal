"use client";

import { useEffect, useState } from "react";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface JobItem {
  id: string;
  jobId: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  jobDescription?: string;
  requirements: string;
  isOpen: boolean;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

const DEPARTMENTS = [
  "Engineering & Design",
  "Planning & Architecture",
  "Construction Operations",
  "Sales & Customer Relations",
  "Marketing & Communications",
  "Finance & Administration",
  "Quality Assurance",
];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [type, setType] = useState("Full-Time");
  const [location, setLocation] = useState("Birtamode / Birgunj, Nepal");
  const [description, setDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setTitle("");
    setDepartment(DEPARTMENTS[0]);
    setType("Full-Time");
    setLocation("Birtamode / Birgunj, Nepal");
    setDescription("");
    setJobDescription("");
    setRequirements("");
    setIsOpen(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: JobItem) => {
    setEditingJob(job);
    setTitle(job.title);
    setDepartment(job.department);
    setType(job.type);
    setLocation(job.location);
    setDescription(job.description);
    setIsOpen(job.isOpen);

    try {
      const parsedDesc = job.jobDescription ? JSON.parse(job.jobDescription) : [];
      setJobDescription(Array.isArray(parsedDesc) ? parsedDesc.join("\n") : (job.jobDescription || ""));
    } catch {
      setJobDescription(job.jobDescription || "");
    }

    try {
      const parsed = JSON.parse(job.requirements);
      setRequirements(Array.isArray(parsed) ? parsed.join("\n") : job.requirements);
    } catch {
      setRequirements(job.requirements);
    }

    setIsModalOpen(true);
  };

  const handleToggleStatus = async (job: JobItem) => {
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !job.isOpen }),
      });

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, isOpen: !j.isOpen } : j))
        );
      }
    } catch (err) {
      console.error("Failed to toggle job status", err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job opening?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !department.trim() || !description.trim()) {
      alert("Please fill in title, department, and role overview.");
      return;
    }

    setIsSaving(true);

    const payload = {
      title: title.trim(),
      department: department.trim(),
      type: type.trim(),
      location: location.trim(),
      description: description.trim(),
      jobDescription: jobDescription.split("\n").map((r) => r.trim()).filter(Boolean),
      requirements: requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      isOpen,
    };

    try {
      if (editingJob) {
        const res = await fetch(`/api/admin/jobs/${editingJob.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setJobs((prev) =>
            prev.map((j) => (j.id === editingJob.id ? { ...j, ...data.job } : j))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setJobs((prev) => [data.job, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Failed to save job opening", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.45rem", fontWeight: 700, color: "#011c5b" }}>
            Career Job Openings
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(1, 28, 91, 0.65)" }}>
            Post and manage job positions displayed on the public /career and /career/apply pages.
          </p>
        </div>

        <button type="button" onClick={handleOpenCreateModal} className={commonStyles.btnPrimary}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Post New Opening</span>
        </button>
      </div>

      {/* Jobs Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.tableContainer}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Job Title & Location</th>
                <th>Department</th>
                <th>Type</th>
                <th>Applications</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    Loading job openings...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    No job openings created yet. Click &ldquo;Post New Opening&rdquo; to add your first position.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#011c5b", fontSize: "0.92rem" }}>{job.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.65)" }}>{job.location}</div>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#011c5b" }}>
                        {job.department}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0369a1", backgroundColor: "#e0f2fe", padding: "0.2rem 0.55rem", borderRadius: "6px" }}>
                        {job.type}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: "#08aaec", fontSize: "0.9rem" }}>
                        {job._count?.applications || 0}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(job)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title="Click to toggle Open / Closed"
                      >
                        <span
                          className={`${commonStyles.pill} ${
                            job.isOpen ? commonStyles.pillOpen : commonStyles.pillClosed
                          }`}
                        >
                          {job.isOpen ? "Active (Open)" : "Closed"}
                        </span>
                      </button>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(job)}
                          className={commonStyles.btnSecondary}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                          className={commonStyles.btnDanger}
                          title="Delete position"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className={commonStyles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={`${commonStyles.modal} ${commonStyles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={commonStyles.modalHeader}>
              <h3 className={commonStyles.modalTitle}>
                {editingJob ? "Edit Job Opening" : "Create New Job Opening"}
              </h3>
              <button type="button" className={commonStyles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Structural Engineer (RCC & Monolithic)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={commonStyles.select}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Employment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={commonStyles.select}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Birtamode / Birgunj, Nepal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={commonStyles.input}
                  />
                </div>

                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.label}>Hiring Status</label>
                  <select
                    value={isOpen ? "open" : "closed"}
                    onChange={(e) => setIsOpen(e.target.value === "open")}
                    className={commonStyles.select}
                  >
                    <option value="open">Active / Accepting Applications</option>
                    <option value="closed">Closed / On Hold</option>
                  </select>
                </div>
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Role Overview * (Shown on Career cards &amp; Apply page)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Short summary of the role and its core mission..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={commonStyles.textarea}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Job Description (One bullet point per line — shown only on Apply page)</label>
                <textarea
                  rows={4}
                  placeholder="Lead structural modeling and seismic simulations&#10;Coordinate with site engineers on monolithic formwork&#10;Review contractor quality logs"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className={commonStyles.textarea}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Key Requirements (One bullet point per line)</label>
                <textarea
                  rows={4}
                  placeholder="B.E. Civil / Structural Engineering&#10;3+ years on-site experience&#10;Proficiency in AutoCAD & ETABS"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className={commonStyles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={commonStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={commonStyles.btnPrimary}
                >
                  {isSaving ? "Saving..." : editingJob ? "Update Opening" : "Publish Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
