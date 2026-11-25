"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/components/admin/AdminLogin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network connection error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image
            src="/vastu-logo-dark.webp"
            alt="Vastu Vihar Nepal"
            width={180}
            height={50}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Admin Portal</h1>
          <p className={styles.subtitle}>Sign in to manage leads, careers, blogs & gallery</p>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="login-email" className={styles.label}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@vastuvihar.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className={styles.demoBox}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#011c5b", marginBottom: "0.5rem" }}>
            Role Quick Login:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleFill("info@vastuvihar.org", "info123")}
              className={styles.demoFillBtn}
              style={{ textAlign: "center", padding: "0.35rem 0.5rem" }}
            >
              👑 Root Admin
            </button>
            <button
              type="button"
              onClick={() => handleFill("sales@vastuvihar.org", "sales123")}
              className={styles.demoFillBtn}
              style={{ textAlign: "center", padding: "0.35rem 0.5rem" }}
            >
              📈 Sales Team
            </button>
            <button
              type="button"
              onClick={() => handleFill("hr@vastuvihar.org", "hr123")}
              className={styles.demoFillBtn}
              style={{ textAlign: "center", padding: "0.35rem 0.5rem" }}
            >
              💼 HR Team
            </button>
            <button
              type="button"
              onClick={() => handleFill("media@vastuvihar.org", "media123")}
              className={styles.demoFillBtn}
              style={{ textAlign: "center", padding: "0.35rem 0.5rem" }}
            >
              🎨 Media Team
            </button>
          </div>
          <div style={{ fontSize: "0.74rem", color: "rgba(1,28,91,0.6)", marginTop: "0.5rem", textAlign: "center" }}>
            Click any role above to automatically load credentials
          </div>
        </div>
      </div>
    </div>
  );
}
