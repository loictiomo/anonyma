import "./Logo.css";

/**
 * LogoMark — the standalone "A" badge, no wordmark.
 * Wrapped in a white tile since the artwork carries its own white background.
 */
function LogoMark({ size = 44 }) {
  return (
    <span
      className="logo-mark-tile"
      style={{ width: size, height: size }}
    >
      <img
        src="/brand/logo-mark.png"
        alt="Anonyma"
        className="logo-mark-img"
      />
    </span>
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

/**
 * FullLogo — the entire artwork as supplied (icon + "Anonyma" wordmark +
 * tagline all baked into one image). Use this when you want the logo
 * exactly as designed, with no separately-typed text alongside it.
 */
function FullLogo({ width = 220 }) {
  return (
    <span
      className="logo-full-tile"
      style={{ width }}
    >
      <img
        src="/brand/logo-full.png"
        alt="Anonyma — Libre de parler, responsable de respecter"
        className="logo-full-img"
      />
    </span>
  );
}

export { LogoMark, FullLogo };
export default Logo;