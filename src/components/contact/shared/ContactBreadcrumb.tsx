import Link from "next/link";
import styles from "./ContactBreadcrumb.module.css";

export function ContactBreadcrumb({ current }: { current: string }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true">•</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
