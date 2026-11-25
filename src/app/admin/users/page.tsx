"use client";

import { useEffect, useState, type FormEvent } from "react";
import commonStyles from "@/components/admin/AdminCommon.module.css";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ROOT" | "MEDIA" | "HR" | "SALES" | string;
  createdAt: string;
  updatedAt?: string;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const DEFAULT_ROLE_META = {
  label: "Sales Team",
  desc: "Customer inquiries and leads management only.",
  color: "#011c5b",
  bg: "#e8eef8",
};

const ROLE_DESCRIPTIONS: Record<string, { label: string; desc: string; color: string; bg: string }> = {
  ROOT: {
    label: "Root Admin",
    desc: "Full system access: Leads & CRM, Excel export, Jobs & Candidate Applications, Blog CMS, Photo Gallery, and User Management.",
    color: "#7c3aed",
    bg: "#f3e8ff",
  },
  MEDIA: {
    label: "Media Team",
    desc: "Blog articles and photo gallery management only (publishing articles, inline content images, and album photos).",
    color: "#08aaec",
    bg: "#e0f4fc",
  },
  HR: {
    label: "HR Team",
    desc: "Job openings posting and applicant review only (manage career openings, view candidate resumes, and update hiring statuses).",
    color: "#059669",
    bg: "#ecfdf5",
  },
  SALES: {
    label: "Sales Team",
    desc: "Customer inquiries and leads management only (review leads from all sources, update contact notes, and export to Excel).",
    color: "#011c5b",
    bg: "#e8eef8",
  },
  // Fallbacks for any legacy records
  ADMIN: {
    label: "Sales Team",
    desc: "Customer inquiries and leads management only.",
    color: "#011c5b",
    bg: "#e8eef8",
  },
  EDITOR: {
    label: "Media Team",
    desc: "Blog articles and photo gallery management only.",
    color: "#08aaec",
    bg: "#e0f4fc",
  },
  VIEWER: {
    label: "View Only",
    desc: "Read-only access.",
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

const OFFICIAL_ROLES = ["ROOT", "MEDIA", "HR", "SALES"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ROOT" | "MEDIA" | "HR" | "SALES" | string>("SALES");
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [meRes, usersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/users"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Failed to load users data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("SALES");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    if (!editingUser && (!password || password.length < 6)) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingUser) {
        const payload: Record<string, string> = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
        };
        if (currentUser?.role === "ROOT") {
          payload.role = role;
        }
        if (password.trim()) {
          if (password.trim().length < 6) {
            setFormError("New password must be at least 6 characters.");
            setIsSubmitting(false);
            return;
          }
          payload.password = password.trim();
        }

        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          setFormError(err.error || "Failed to update user");
          return;
        }
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          setFormError(err.error || "Failed to create user");
          return;
        }
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save user error:", err);
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.role === "ROOT") {
      alert("The ROOT account cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete user");
        return;
      }

      await loadData();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user");
    }
  };

  const isRoot = currentUser?.role === "ROOT";

  return (
    <div>
      {/* Header */}
      <div className={commonStyles.cardHeader}>
        <div>
          <h1 className={commonStyles.cardTitle}>Role-Based Access Control (RBAC)</h1>
          <p className={commonStyles.cardSubtitle}>
            Manage privileged admin accounts, assign roles, and safeguard administrative operations
          </p>
        </div>
        <div>
          <button type="button" className={commonStyles.btnPrimary} onClick={openCreateModal}>
            + Add New User
          </button>
        </div>
      </div>

      {/* Role Definitions Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          margin: "1.25rem 0",
        }}
      >
        {OFFICIAL_ROLES.map((key) => {
          const info = ROLE_DESCRIPTIONS[key] || DEFAULT_ROLE_META;
          return (
            <div
              key={key}
              style={{
                background: "#ffffff",
                padding: "1.2rem",
                borderRadius: "16px",
                border: "1px solid rgba(1,28,91,0.08)",
                borderTop: `4px solid ${info.color}`,
                boxShadow: "0 2px 10px rgba(1,28,91,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span
                  style={{
                    background: info.bg,
                    color: info.color,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "8px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {key}
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(1,28,91,0.5)" }}>
                  {users.filter((u) => u.role === key).length} active
                </span>
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#011c5b", margin: "0.4rem 0 0.25rem" }}>
                {info.label}
              </h4>
              <p style={{ fontSize: "0.8rem", color: "rgba(1,28,91,0.65)", lineHeight: 1.45 }}>
                {info.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className={commonStyles.card}>
        <div className={commonStyles.cardHeader}>
          <div>
            <h2 className={commonStyles.cardTitle}>System Users ({users.length})</h2>
            <p className={commonStyles.cardSubtitle}>
              Logged in as <strong style={{ color: "#011c5b" }}>{currentUser?.name}</strong> ({currentUser?.email}) &bull; Role:{" "}
              <strong style={{ color: currentUser?.role === "ROOT" ? "#7c3aed" : "#011c5b" }}>
                {currentUser?.role}
              </strong>
            </p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(1,28,91,0.5)" }}>
            Loading user accounts...
          </div>
        ) : (
          <div className={commonStyles.tableWrapper}>
            <table className={commonStyles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const roleMeta = ROLE_DESCRIPTIONS[u.role] || DEFAULT_ROLE_META;
                  const isCurrent = u.id === currentUser?.id;
                  const isTargetRoot = u.role === "ROOT";

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: roleMeta.bg,
                              color: roleMeta.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.88rem",
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#011c5b" }}>
                              {u.name} {isCurrent && <span style={{ fontSize: "0.72rem", color: "#08aaec", fontWeight: 700 }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(1,28,91,0.5)" }}>
                              ID: {u.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#011c5b" }}>
                          {u.email}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: roleMeta.bg,
                            color: roleMeta.color,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "6px",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.82rem", color: "rgba(1,28,91,0.7)" }}>
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            className={commonStyles.btnSecondary}
                            style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                            onClick={() => openEditModal(u)}
                            disabled={isTargetRoot && !isRoot}
                          >
                            Edit
                          </button>
                          {isRoot && !isTargetRoot && (
                            <button
                              type="button"
                              className={commonStyles.btnDanger}
                              style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                              onClick={() => handleDeleteUser(u)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className={commonStyles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={commonStyles.modalCard}
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={commonStyles.cardHeader}>
              <div>
                <h2 className={commonStyles.cardTitle}>
                  {editingUser ? `Edit User: ${editingUser.name}` : "Create New Admin User"}
                </h2>
                <p className={commonStyles.cardSubtitle}>
                  {editingUser
                    ? "Update account credentials and permission access"
                    : "Root administrators can assign role privileges and initial credentials"}
                </p>
              </div>
              <button
                type="button"
                className={commonStyles.btnSecondary}
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Thapa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={commonStyles.input}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@vastuvihar.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={commonStyles.input}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>
                  {editingUser ? "Reset Password (leave blank to keep current)" : "Password * (min 6 characters)"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? "Enter new password if resetting..." : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={commonStyles.input}
                />
              </div>

              <div className={commonStyles.formGroup}>
                <label className={commonStyles.label}>Assigned Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className={commonStyles.select}
                  disabled={editingUser?.role === "ROOT" && !isRoot}
                >
                  {isRoot && <option value="ROOT">ROOT — Root Admin (Full Access)</option>}
                  <option value="MEDIA">MEDIA — Media Team (Blog & Gallery Only)</option>
                  <option value="HR">HR — HR Team (Job Openings & Candidate Review)</option>
                  <option value="SALES">SALES — Sales Team (Leads CRM Only)</option>
                </select>
                <p style={{ fontSize: "0.78rem", color: "rgba(1,28,91,0.6)", marginTop: "0.4rem" }}>
                  {ROLE_DESCRIPTIONS[role]?.desc}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className={commonStyles.btnSecondary}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={commonStyles.btnPrimary}
                >
                  {isSubmitting ? "Saving..." : editingUser ? "Update User" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
