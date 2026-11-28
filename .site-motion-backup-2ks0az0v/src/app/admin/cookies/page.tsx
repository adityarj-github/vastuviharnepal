"use client";

import { useEffect, useState } from "react";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface CookieConsentItem {
  id: string;
  clientId: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  ipHash?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CookieStats {
  total: number;
  analyticsCount: number;
  marketingCount: number;
  preferencesCount: number;
  essentialOnlyCount: number;
}

export default function AdminCookiesPage() {
  const [consents, setConsents] = useState<CookieConsentItem[]>([]);
  const [stats, setStats] = useState<CookieStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [userRole, setUserRole] = useState<string>("SALES");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filter !== "ALL") params.set("filter", filter);

      const [res, meRes] = await Promise.all([
        fetch(`/api/admin/cookies?${params.toString()}`),
        fetch("/api/auth/me"),
      ]);

      if (res.ok) {
        const data = await res.json();
        setConsents(data.consents || []);
        setStats(data.stats || null);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.user?.role || "SALES");
      }
    } catch (err) {
      console.error("Failed to load cookie consents", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id: string, clientId: string) => {
    if (!confirm(`Are you sure you want to delete consent audit record for ${clientId}?`)) return;

    try {
      const res = await fetch(`/api/admin/cookies/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete consent record");
      }
    } catch (err) {
      console.error("Delete consent error", err);
      alert("Error deleting consent record");
    }
  };

  const total = stats?.total || consents.length || 1;
  const analyticsPct = stats ? Math.round((stats.analyticsCount / total) * 100) : 0;
  const marketingPct = stats ? Math.round((stats.marketingCount / total) * 100) : 0;
  const preferencesPct = stats ? Math.round((stats.preferencesCount / total) * 100) : 0;
  const essentialOnlyPct = stats ? Math.round((stats.essentialOnlyCount / total) * 100) : 0;

  return (
    <div>
      {/* Top Banner */}
      <div className={commonStyles.cardHeader}>
        <div>
          <h1 className={commonStyles.cardTitle}>Cookie Consents & Compliance Audit</h1>
          <p className={commonStyles.cardSubtitle}>
            Review visitor privacy choices, consent rates, and anonymized ePrivacy/GDPR compliance logs
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className={commonStyles.btnSecondary}
          style={{ fontSize: "0.82rem" }}
        >
          ↻ Refresh Logs
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          margin: "1.25rem 0",
        }}
      >
        <div className={commonStyles.card} style={{ padding: "1.2rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(1,28,91,0.6)", textTransform: "uppercase" }}>
            Total Audit Records
          </span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#011c5b", marginTop: "0.3rem" }}>
            {stats?.total ?? consents.length}
          </div>
          <span style={{ fontSize: "0.76rem", color: "#059669", fontWeight: 600 }}>Active consent tracking</span>
        </div>

        <div className={commonStyles.card} style={{ padding: "1.2rem", borderTop: "3px solid #08aaec" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(1,28,91,0.6)", textTransform: "uppercase" }}>
            Analytics Allowed
          </span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#08aaec", marginTop: "0.3rem" }}>
            {stats?.analyticsCount ?? 0} <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>({analyticsPct}%)</span>
          </div>
          <span style={{ fontSize: "0.76rem", color: "rgba(1,28,91,0.6)" }}>Core Web Vitals & traffic</span>
        </div>

        <div className={commonStyles.card} style={{ padding: "1.2rem", borderTop: "3px solid #8b5cf6" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(1,28,91,0.6)", textTransform: "uppercase" }}>
            Marketing Allowed
          </span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#8b5cf6", marginTop: "0.3rem" }}>
            {stats?.marketingCount ?? 0} <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>({marketingPct}%)</span>
          </div>
          <span style={{ fontSize: "0.76rem", color: "rgba(1,28,91,0.6)" }}>Project updates & expo alerts</span>
        </div>

        <div className={commonStyles.card} style={{ padding: "1.2rem", borderTop: "3px solid #64748b" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(1,28,91,0.6)", textTransform: "uppercase" }}>
            Essential Only
          </span>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#475569", marginTop: "0.3rem" }}>
            {stats?.essentialOnlyCount ?? 0} <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>({essentialOnlyPct}%)</span>
          </div>
          <span style={{ fontSize: "0.76rem", color: "rgba(1,28,91,0.6)" }}>Rejected all optional trackers</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={commonStyles.card} style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { id: "ALL", label: "All Consents" },
              { id: "ANALYTICS", label: "Analytics Active" },
              { id: "MARKETING", label: "Marketing Active" },
              { id: "PREFERENCES", label: "Preferences Active" },
              { id: "ESSENTIAL_ONLY", label: "Essential Only" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={filter === f.id ? commonStyles.btnPrimary : commonStyles.btnSecondary}
                style={{ fontSize: "0.78rem", padding: "0.4rem 0.85rem", borderRadius: "18px" }}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Search Client ID, IP Hash, Agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={commonStyles.input}
              style={{ width: "240px", padding: "0.45rem 0.75rem", fontSize: "0.82rem" }}
            />
            <button type="submit" className={commonStyles.btnSky} style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Consents Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.cardHeader}>
          <div>
            <h2 className={commonStyles.cardTitle}>Registered Consent Logs ({consents.length})</h2>
            <p className={commonStyles.cardSubtitle}>
              Timestamped user choices synced from the frontend cookie banner & preferences modal
            </p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(1,28,91,0.5)" }}>
            Loading consent audit logs...
          </div>
        ) : consents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(1,28,91,0.5)" }}>
            No cookie consent records match the selected criteria.
          </div>
        ) : (
          <div className={commonStyles.tableWrapper}>
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th>Client Identifier</th>
                  <th>Consent Breakdown</th>
                  <th>Anonymized IP Hash</th>
                  <th>Device / Browser</th>
                  <th>Registered At</th>
                  {userRole === "ROOT" && <th style={{ textAlign: "right" }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {consents.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color: "#011c5b" }}>
                          {item.clientId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.clientId);
                            alert("Client ID copied to clipboard!");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px",
                            color: "rgba(1,28,91,0.4)",
                          }}
                          title="Copy ID"
                        >
                          📋
                        </button>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background: "#dcfce7",
                            color: "#15803d",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          Essential: ON
                        </span>

                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background: item.analytics ? "#e0f2fe" : "#f1f5f9",
                            color: item.analytics ? "#0369a1" : "#94a3b8",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          Analytics: {item.analytics ? "ON" : "OFF"}
                        </span>

                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background: item.marketing ? "#f3e8ff" : "#f1f5f9",
                            color: item.marketing ? "#7e22ce" : "#94a3b8",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          Marketing: {item.marketing ? "ON" : "OFF"}
                        </span>

                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background: item.preferences ? "#ccfbf1" : "#f1f5f9",
                            color: item.preferences ? "#0f766e" : "#94a3b8",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          Prefs: {item.preferences ? "ON" : "OFF"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                          background: "#f8fafc",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "1px solid rgba(1,28,91,0.06)",
                          color: "rgba(1,28,91,0.7)",
                        }}
                      >
                        {item.ipHash ? `sha256:${item.ipHash}` : "Anonymized"}
                      </span>
                    </td>

                    <td style={{ maxWidth: "220px" }}>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          color: "rgba(1,28,91,0.65)",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={item.userAgent || "Browser Client"}
                      >
                        {item.userAgent || "Desktop Web Client"}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.8rem", color: "rgba(1,28,91,0.7)" }}>
                        {new Date(item.updatedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {userRole === "ROOT" && (
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={commonStyles.btnDanger}
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                          onClick={() => handleDelete(item.id, item.clientId)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
