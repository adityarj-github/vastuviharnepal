interface StatCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function StatCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1050,
  className,
}: StatCounterProps) {
  return (
    <span className={className}>
      <span
        className="site-count"
        data-site-count={target}
        data-site-prefix={prefix}
        data-site-suffix={suffix}
        data-site-duration={duration}
      >
        <span className="site-count-final">{prefix}{target}{suffix}</span>
        <span className="site-count-digits" aria-hidden="true" />
      </span>
    </span>
  );
}
