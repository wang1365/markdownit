type LogoProps = {
  showWordmark?: boolean;
};

export function Logo({ showWordmark = true }: LogoProps) {
  return (
    <span className="logo-mark" aria-label="Markdownit Online">
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
        <rect className="logo-paper" x="10" y="10" width="44" height="44" rx="12" />
        <path className="logo-stem" d="M20 41V23l7 10 7-10v18" />
        <path className="logo-arrow" d="M42 24v17m-7-7 7 7 7-7" />
      </svg>
      {showWordmark ? <strong>Markdownit</strong> : null}
    </span>
  );
}
