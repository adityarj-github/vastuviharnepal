import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import styles from "./Buttons.module.css";

interface FlipButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text: string;
  href?: string;
}

export function FlipButton({
  text,
  href,
  className = "",
  type = "button",
  ...props
}: FlipButtonProps) {
  const content = (
    <span className={styles.flipTextWrap}>
      <span className={styles.flipTextPrimary}>{text}</span>
      <span className={styles.flipTextSecondary} aria-hidden="true">
        {text}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={`${styles.flipBtn} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${styles.flipBtn} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
