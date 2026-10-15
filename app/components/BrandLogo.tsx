export function BrandLogo({tone = 'orange'}: {tone?: 'orange' | 'white'}) {
  return (
    <span className="brand-logo-art">
      <svg viewBox={tone === 'white' ? '352 248 4051 870' : '607 1637 16915 3660'} role="img" aria-label="SORAA" focusable="false">
        {tone === 'white' ? (
          <image href="/soraa-logo-white.png" width="1349" height="4769" transform="translate(4769 0) rotate(90)" />
        ) : (
          <image href="/soraa-logo-orange-updated.png" width="6639" height="17806" transform="translate(17806 0) rotate(90)" />
        )}
      </svg>
    </span>
  );
}
