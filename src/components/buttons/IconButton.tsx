import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Buttons.module.css";

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode;
  ariaLabel: string;
  href?: string;
}

export function IconButton({
  icon,
  ariaLabel,
  href,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  const content = <span className={styles.iconBtnSvg}>{icon}</span>;

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={`${styles.iconBtn} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`${styles.iconBtn} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}