"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import commonStyles from "@/components/admin/AdminCommon.module.css";
import styles from "@/components/admin/AdminDashboard.module.css";

interface DashboardData {
  stats: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    convertedLeads: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    totalBlogs: number;
    publishedBlogs: number;
    totalGalleryFolders: number;
    totalGalleryImages: number;
    totalUsers: number;
    totalCookieConsents?: number;
  };
  sources: {
    modelInquiry: number;
    blogLead: number;
    contactForm: number;
    other: number;
  };
  recentLeads: Array<{
    id: string;
    fullName: string;
    phone: string;
    source: string;
    residenceName?: string;
    status: string;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    fullName: string;
    position: string;
    experience: string;
    status: string;
    createdAt: string;
  }>;
  currentUser: {
    name: string;
    role: string;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "3rem 0", textAlign: "center", color: "#011c5b" }}>
        <p>Loading dashboard overview...</p>
      </div>
    );
  }

  const { stats, sources, recentLeads, recentApplications, currentUser } = data;

  const totalLeadsCount = stats.totalLeads || 1; // avoid divide by zero
  const modelPct = Math.round((sources.modelInquiry / totalLeadsCount) * 100);
  const blogPct = Math.round((sources.blogLead / totalLeadsCount) * 100);
  const contactPct = Math.round((sources.contactForm / totalLeadsCount) * 100);
  const otherPct = Math.round((sources.other / totalLeadsCount) * 100);

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-involve), sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#011c5b" }}>
            Welcome back, {currentUser?.name || "Admin"}
          </h2>
          <p style={{ fontSize: "0.88rem", color: "rgba(1, 28, 91, 0.65)" }}>
            Here is what&apos;s happening across Vastu Vihar Nepal residential leads, careers, blogs, and gallery.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="/api/admin/leads/export"
            className={commonStyles.btnSky}
            title="Download Excel spreadsheet of all leads"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Leads (.xlsx)</span>
          </a>

          <Link href="/admin/leads" className={commonStyles.btnPrimary}>
            <span>Manage All Leads</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className={styles.statsGrid}>
        {/* Card 1: Leads */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Total Inquiries</span>
            <div className={styles.statIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalLeads}</div>
          <div className={styles.statFooter}>
            <span style={{ color: "#0369a1", fontWeight: 700 }}>{stats.newLeads} new</span>
            <span>unprocessed leads waiting</span>
          </div>
        </div>

        {/* Card 2: Careers */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Career Openings</span>
            <div className={styles.statIconWrap} style={{ color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.activeJobs}</div>
          <div className={styles.statFooter}>
            <span style={{ color: "#059669", fontWeight: 700 }}>{stats.totalApplications} applications</span>
            <span>received</span>
          </div>
        </div>

        {/* Card 3: Blogs */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Published Blogs</span>
            <div className={styles.statIconWrap} style={{ color: "#8b5cf6", backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.publishedBlogs}</div>
          <div className={styles.statFooter}>
            <span>{stats.totalBlogs} articles created</span>
          </div>
        </div>

        {/* Card 4: Gallery */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Gallery Photos</span>
            <div className={styles.statIconWrap} style={{ color: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalGalleryImages}</div>
          <div className={styles.statFooter}>
            <span>Across {stats.totalGalleryFolders} community folders</span>
          </div>
        </div>

        {/* Card 5: Cookie Consents */}
        <Link href="/admin/cookies" className={styles.statCard} style={{ textDecoration: "none" }}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Cookie Consents</span>
            <div className={styles.statIconWrap} style={{ color: "#08aaec", backgroundColor: "rgba(8, 170, 236, 0.1)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <circle cx="16" cy="15.5" r="1.5" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalCookieConsents ?? 0}</div>
          <div className={styles.statFooter}>
            <span style={{ color: "#08aaec", fontWeight: 700 }}>View audit records →</span>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Leads & Sources/Quick Actions */}
      <div className={styles.contentGrid}>
        {/* Left: Recent Leads */}
        <div className={commonStyles.card}>
          <div className={commonStyles.cardHeader}>
            <div>
              <h3 className={commonStyles.cardTitle}>Recent Incoming Inquiries</h3>
              <p className={commonStyles.cardSubtitle}>Direct leads from residence models, blog pages, and contact forms</p>
            </div>
            <Link href="/admin/leads" style={{ fontSize: "0.84rem", fontWeight: 600, color: "#08aaec", textDecoration: "none" }}>
              View All ({stats.totalLeads}) →
            </Link>
          </div>

          <div className={commonStyles.tableContainer}>
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "rgba(1, 28, 91, 0.5)" }}>
                      No inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: 600 }}>{lead.fullName}</td>
                      <td>{lead.phone}</td>
                      <td>
                        <span style={{ fontSize: "0.78rem", color: "#0369a1", backgroundColor: "#e0f2fe", padding: "0.2rem 0.5rem", borderRadius: "6px" }}>
                          {lead.source}
                        </span>
                        {lead.residenceName && (
                          <div style={{ fontSize: "0.74rem", color: "rgba(1, 28, 91, 0.6)", marginTop: "0.2rem" }}>
                            {lead.residenceName}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`${commonStyles.pill} ${lead.status === "NEW"
                            ? commonStyles.pillNew
                            : lead.status === "CONTACTED"
                              ? commonStyles.pillContacted
                              : lead.status === "CONVERTED"
                                ? commonStyles.pillConverted
                                : commonStyles.pillInProgress
                            }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.55)" }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Lead Sources Breakdown & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Breakdown Card */}
          <div className={commonStyles.card}>
            <h3 className={commonStyles.cardTitle} style={{ marginBottom: "1rem" }}>Inquiry Channels</h3>
            <div className={styles.sourceBreakdown}>
              <div className={styles.sourceItem}>
                <div className={styles.sourceItemHeader}>
                  <span>Model Pages</span>
                  <span>{sources.modelInquiry} ({modelPct}%)</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: `${modelPct}%`, background: "#08aaec" }} />
                </div>
              </div>

              <div className={styles.sourceItem}>
                <div className={styles.sourceItemHeader}>
                  <span>Blog Articles</span>
                  <span>{sources.blogLead} ({blogPct}%)</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: `${blogPct}%`, background: "#8b5cf6" }} />
                </div>
              </div>

              <div className={styles.sourceItem}>
                <div className={styles.sourceItemHeader}>
                  <span>Contact Form</span>
                  <span>{sources.contactForm} ({contactPct}%)</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: `${contactPct}%`, background: "#10b981" }} />
                </div>
              </div>

              {sources.other > 0 && (
                <div className={styles.sourceItem}>
                  <div className={styles.sourceItemHeader}>
                    <span>Direct / Other</span>
                    <span>{sources.other} ({otherPct}%)</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: `${otherPct}%`, background: "#64748b" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              {(currentUser?.role === "ROOT" || currentUser?.role === "SALES") && (
                <>
                  <a href="/api/admin/leads/export" className={styles.quickActionBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Export Leads (.xlsx)</span>
                  </a>

                  <Link href="/admin/cookies" className={styles.quickActionBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <circle cx="16" cy="15.5" r="1.5" />
                    </svg>
                    <span>Review Cookie Consents</span>
                  </Link>
                </>
              )}

              {(currentUser?.role === "ROOT" || currentUser?.role === "HR") && (
                <Link href="/admin/jobs" className={styles.quickActionBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Post Job Opening</span>
                </Link>
              )}

              {(currentUser?.role === "ROOT" || currentUser?.role === "MEDIA") && (
                <>
                  <Link href="/admin/blogs" className={styles.quickActionBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Publish New Blog</span>
                  </Link>

                  <Link href="/admin/gallery" className={styles.quickActionBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Upload Gallery Photos</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Job Applications Row */}
      <div className={commonStyles.card}>
        <div className={commonStyles.cardHeader}>
          <div>
            <h3 className={commonStyles.cardTitle}>Recent Job Applications</h3>
            <p className={commonStyles.cardSubtitle}>Candidates who submitted their profile through the Career portal</p>
          </div>
          <Link href="/admin/applications" style={{ fontSize: "0.84rem", fontWeight: 600, color: "#08aaec", textDecoration: "none" }}>
            View All Applications ({stats.totalApplications}) →
          </Link>
        </div>

        <div className={commonStyles.tableContainer}>
          <table className={commonStyles.table}>
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Position Applied</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "1.5rem", color: "rgba(1, 28, 91, 0.5)" }}>
                    No job applications submitted yet.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.fullName}</td>
                    <td>{app.position}</td>
                    <td>{app.experience}</td>
                    <td>
                      <span className={`${commonStyles.pill} ${commonStyles.pillNew}`}>{app.status}</span>
                    </td>
                    <td style={{ fontSize: "0.78rem", color: "rgba(1, 28, 91, 0.55)" }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
