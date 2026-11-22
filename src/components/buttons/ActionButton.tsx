import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Buttons.module.css";

interface ActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text: string;
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

function DefaultArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ActionButton({
  text,
  icon,
  href,
  target,
  rel,
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) {
  const isCustomIcon = Boolean(icon);

  const content = (
    <>
      <span className={styles.actionLabel}>{text}</span>
      <span className={styles.iconCircle}>
        <span
          className={`${styles.iconWrapper} ${
            isCustomIcon ? "" : styles.defaultArrow
          }`}
        >
          {icon ?? <DefaultArrowIcon />}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`${styles.actionBtn} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`${styles.actionBtn} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
