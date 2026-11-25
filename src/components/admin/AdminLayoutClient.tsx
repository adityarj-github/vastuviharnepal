"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminLayout.module.css";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminLayoutClientProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    roles: ["ROOT", "MEDIA", "HR", "SALES"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "Leads & CRM",
    href: "/admin/leads",
    roles: ["ROOT", "SALES"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Job Openings",
    href: "/admin/jobs",
    roles: ["ROOT", "HR"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect width="20" height="14" x="2" y="7" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Job Applications",
    href: "/admin/applications",
    roles: ["ROOT", "HR"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Blog Posts",
    href: "/admin/blogs",
    roles: ["ROOT", "MEDIA"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
        <path d="M6 14h6" />
      </svg>
    ),
  },
  {
    label: "Gallery Section",
    href: "/admin/gallery",
    roles: ["ROOT", "MEDIA"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    label: "Cookie Consents",
    href: "/admin/cookies",
    roles: ["ROOT", "SALES"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    ),
  },
  {
    label: "Users & Roles",
    href: "/admin/users",
    roles: ["ROOT"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
];

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If on login page, render children directly without admin chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Route protection by role
  useEffect(() => {
    if (!user || isLoginPage) return;
    const matchedItem = NAV_ITEMS.find(
      (item) => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href))
    );
    if (matchedItem && !matchedItem.roles.includes(user.role)) {
      const fallbackItem = NAV_ITEMS.find((item) => item.roles.includes(user.role));
      router.replace(fallbackItem ? fallbackItem.href : "/admin");
    }
  }, [user, pathname, isLoginPage, router]);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(8, 170, 236, 0.2)", borderTopColor: "#08aaec", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "#011c5b", fontWeight: 600, fontSize: "0.95rem" }}>Loading Vastu Vihar Admin...</p>
        </div>
      </div>
    );
  }

  const currentNav = NAV_ITEMS.find(
    (item) => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  return (
    <div className={styles.adminShell}>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brandWrap}>
            <Image
              src="/vastu-white.svg"
              alt="Vastu Vihar Nepal"
              width={140}
              height={36}
              className={styles.brandLogo}
              priority
            />
            <div className={styles.brandText}>
              <span className={styles.brandBadge}>Admin Portal</span>
            </div>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navGroupTitle}>Management</div>
          {NAV_ITEMS.filter((item) => !user || item.roles.includes(user.role)).map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "Admin"}</span>
              <span className={styles.userRoleBadge}>
                {user?.role === "ROOT"
                  ? "Root Admin"
                  : user?.role === "MEDIA"
                    ? "Media Team"
                    : user?.role === "HR"
                      ? "HR Team"
                      : user?.role === "SALES"
                        ? "Sales Team"
                        : user?.role || "ADMIN"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Log out of admin"
            aria-label="Logout"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className={styles.pageTitleGroup}>
              <h1 className={styles.pageTitle}>{currentNav?.label || "Admin Console"}</h1>
              <span className={styles.breadcrumb}>Vastu Vihar Nepal / {currentNav?.label || "Portal"}</span>
            </div>
          </div>

          <div className={styles.topBarRight}>
            <Link href="/" target="_blank" className={styles.viewSiteBtn}>
              <span>View Public Site</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </header>

        <main className={styles.bodyContent}>{children}</main>
      </div>
    </div>
  );
}
