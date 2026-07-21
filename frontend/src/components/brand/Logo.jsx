import "./Logo.css";

/**
 * LogoMark — the standalone "A" badge, no wordmark.
 * Used anywhere space is tight (favicon-style spots, compact headers).
 */
function LogoMark({ size = 44 }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Anonyma"
    >
      <defs>
        <linearGradient id="anonymaNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B3E6E" />
          <stop offset="100%" stopColor="#0B2038" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="62" height="62" rx="16" fill="url(#anonymaNavy)" />

      {/* Flat-topped geometric A */}
      <polygon points="17,49 26,15 31,15 22,49" fill="#FFFFFF" />
      <polygon points="47,49 38,15 33,15 42,49" fill="#FFFFFF" />
      <polygon points="24.2,39 39.8,39 38.2,34 25.8,34" fill="#FFFFFF" />

      {/* Signature ribbon */}
      <rect x="17" y="53" width="9" height="3" rx="1.5" fill="#2F9E5C" />
      <rect x="27.5" y="53" width="9" height="3" rx="1.5" fill="#E8A93A" />
      <rect x="38" y="53" width="9" height="3" rx="1.5" fill="#D6524B" />
    </svg>
  );
}

/**
 * Logo — the full lockup: badge + "Anonyma" wordmark.
 * variant="light" for use on the navy brand panel (white text).
 * variant="dark" for use on white backgrounds (navy text).
 */
function Logo({ size = 44, variant = "light", tagline }) {
  return (
    <div className={`logo-lockup logo-lockup--${variant}`}>
      <LogoMark size={size} />

      <div className="logo-text">
        <span className="logo-wordmark">Anonyma</span>

        {tagline && (
          <span className="logo-tagline">{tagline}</span>
        )}
      </div>
    </div>
  );
}

export { LogoMark };
export default Logo;