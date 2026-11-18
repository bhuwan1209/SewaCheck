type LogoProps = {
  /** "dark" = for light backgrounds, "light" = for navy backgrounds */
  variant?: "dark" | "light";
};

/** SewaCheck logo: a location pin containing a checkmark, plus the wordmark. */
export function Logo({ variant = "dark" }: LogoProps) {
  const textColor = variant === "dark" ? "text-navy-900" : "text-white";
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        {/* pin */}
        <path
          d="M16 2C10.5 2 6 6.4 6 11.9 6 19.3 16 30 16 30s10-10.7 10-18.1C26 6.4 21.5 2 16 2Z"
          fill={variant === "dark" ? "#0b2545" : "#ffffff"}
        />
        {/* checkmark */}
        <path
          d="M11 12.2l3.6 3.6L21.2 9"
          stroke="#2fbf80"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0 1.5)"
        />
      </svg>
      <span className={`text-xl font-bold tracking-tight ${textColor}`}>
        Sewa<span className="text-sewa-green">Check</span>
      </span>
    </span>
  );
}
