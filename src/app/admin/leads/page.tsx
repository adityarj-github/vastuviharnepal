"use client";

import { useEffect, useState, useMemo } from "react";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface LeadItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  source: string;
  residenceName?: string | null;
  budget?: string | null;
  purpose?: string | null;
  locationPref?: string | null;
  interestType?: string | null;
  blogSlug?: string | null;
  message?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
}

const SOURCES = ["ALL", "Model Inquiry", "Blog Lead", "Contact Form", "General"];
const STATUSES = ["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "CONVERTED", "CLOSED"];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [statusInput, setStatusInput] = useState("NEW");

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedSource !== "ALL") params.set("source", selectedSource);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  const handleOpenLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setNoteInput(lead.notes || "");
    setStatusInput(lead.status);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusInput,
          notes: noteInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, ...data.lead } : l))
        );
        setSelectedLead((prev) => (prev ? { ...prev, ...data.lead } : null));
      }
    } catch (err) {
      console.error("Failed to update lead", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedSource !== "ALL") params.set("source", selectedSource);
    if (selectedStatus !== "ALL") params.set("status", selectedStatus);
    return `/api/admin/leads/export?${params.toString()}`;
  }, [selectedSource, selectedStatus]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header & Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.45rem", fontWeight: 700, color: "#011c5b" }}>
            Inquiry Management & CRM
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(1, 28, 91, 0.65)" }}>
            Review inquiries collected from residence models, blog pages, and contact forms.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href={exportUrl}
            className={commonStyles.btnSky}
            title="Download filtered leads in Excel spreadsheet format"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export to Excel (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={commonStyles.card} style={{ padding: "1.25rem" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          {/* Source Tabs */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSource(s)}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: selectedSource === s ? "#011c5b" : "rgba(1, 28, 91, 0.05)",
                  color: selectedSource === s ? "#ffffff" : "#011c5b",
                  transition: "background-color 160ms ease",
                }}
              >
                {s === "ALL" ? "All Channels" : s}
              </button>
            ))}
          </div>

          {/* Status & Search */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={commonStyles.select}
              style={{ width: "auto", padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === "ALL" ? "All Statuses" : st}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Search name, phone, model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={commonStyles.input}
                style={{ width: "220px", padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}
              />
              <button type="submit" className={commonStyles.btnSecondary} style={{ padding: "0.45rem 0.85rem" }}>
                Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Leads Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.tableContainer}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Lead Info</th>
                <th>Channel / Source</th>
                <th>Requirements / Model</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#011c5b", fontSize: "0.92rem" }}>{lead.fullName}</div>
                      <div style={{ fontSize: "0.82rem", color: "#08aaec", fontWeight: 600 }}>{lead.phone}</div>
                      {lead.email && <div style={{ fontSize: "0.76rem", color: "rgba(1, 28, 91, 0.6)" }}>{lead.email}</div>}
                    </td>

                    <td>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0369a1", backgroundColor: "#e0f2fe", padding: "0.25rem 0.6rem", borderRadius: "8px" }}>
                        {lead.source}
                      </span>
                    </td>

                    <td>
                      {lead.residenceName && (
                        <div style={{ fontWeight: 600, fontSize: "0.84rem", color: "#011c5b" }}>{lead.residenceName}</div>
                      )}
                      {lead.budget && (
                        <div style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.7)" }}>Budget: {lead.budget}</div>
                      )}
                      {lead.purpose && (
                        <div style={{ fontSize: "0.75rem", color: "rgba(1, 28, 91, 0.6)" }}>Purpose: {lead.purpose}</div>
                      )}
                      {lead.locationPref && (
                        <div style={{ fontSize: "0.75rem", color: "rgba(1, 28, 91, 0.6)" }}>Location: {lead.locationPref}</div>
                      )}
                      {lead.message && (
                        <div style={{ fontSize: "0.76rem", color: "rgba(1, 28, 91, 0.6)", maxWidth: "240px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          &ldquo;{lead.message}&rdquo;
                        </div>
                      )}
                    </td>

                    <td>
                      <span
                        className={`${commonStyles.pill} ${
                          lead.status === "NEW"
                            ? commonStyles.pillNew
                            : lead.status === "CONTACTED"
                            ? commonStyles.pillContacted
                            : lead.status === "CONVERTED"
                            ? commonStyles.pillConverted
                            : lead.status === "CLOSED"
                            ? commonStyles.pillClosed
                            : commonStyles.pillInProgress
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.8rem", color: "rgba(1, 28, 91, 0.6)" }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenLead(lead)}
                          className={commonStyles.btnSecondary}
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        >
                          Details & Notes
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className={commonStyles.btnDanger}
                          title="Delete inquiry"
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

      {/* Detail / Notes Modal */}
      {selectedLead && (
        <div className={commonStyles.modalBackdrop} onClick={() => setSelectedLead(null)}>
          <div className={commonStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={commonStyles.modalHeader}>
              <h3 className={commonStyles.modalTitle}>Inquiry Details: {selectedLead.fullName}</h3>
              <button type="button" className={commonStyles.closeBtn} onClick={() => setSelectedLead(null)}>
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <span className={commonStyles.label}>Phone Number</span>
                <p style={{ fontWeight: 600, color: "#08aaec", fontSize: "1.05rem" }}>{selectedLead.phone}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Email Address</span>
                <p style={{ fontWeight: 500, color: "#011c5b" }}>{selectedLead.email || "Not provided"}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Lead Source</span>
                <p style={{ fontWeight: 600 }}>{selectedLead.source}</p>
              </div>

              <div>
                <span className={commonStyles.label}>Date Received</span>
                <p>{new Date(selectedLead.createdAt).toLocaleString()}</p>
              </div>

              {selectedLead.residenceName && (
                <div>
                  <span className={commonStyles.label}>Interested Residence</span>
                  <p style={{ fontWeight: 600, color: "#011c5b" }}>{selectedLead.residenceName}</p>
                </div>
              )}

              {selectedLead.budget && (
                <div>
                  <span className={commonStyles.label}>Budget Range</span>
                  <p>{selectedLead.budget}</p>
                </div>
              )}

              {selectedLead.purpose && (
                <div>
                  <span className={commonStyles.label}>Purchase Purpose</span>
                  <p>{selectedLead.purpose}</p>
                </div>
              )}

              {selectedLead.locationPref && (
                <div>
                  <span className={commonStyles.label}>Preferred City / Site</span>
                  <p>{selectedLead.locationPref}</p>
                </div>
              )}
            </div>

            {selectedLead.message && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid rgba(1, 28, 91, 0.08)" }}>
                <span className={commonStyles.label}>Message / Specific Requests</span>
                <p style={{ fontSize: "0.88rem", marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>
                  {selectedLead.message}
                </p>
              </div>
            )}

            {/* Status & Internal Notes */}
            <div style={{ borderTop: "1px solid rgba(1, 28, 91, 0.08)", paddingTop: "1.25rem" }}>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Update Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className={commonStyles.select}
                >
                  <option value="NEW">NEW (Uncontacted)</option>
                  <option value="CONTACTED">CONTACTED (Follow-up in progress)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Site visit scheduled / Proposal sent)</option>
                  <option value="CONVERTED">CONVERTED (Booking confirmed)</option>
                  <option value="CLOSED">CLOSED (Not interested / archived)</option>
                </select>
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Internal Advisor Notes</label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Record customer preferences, site visit notes, loan pre-approval details..."
                  className={commonStyles.textarea}
                  rows={3}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className={commonStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateLead}
                  className={commonStyles.btnPrimary}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
