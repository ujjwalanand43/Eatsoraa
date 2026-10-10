export function BrandLogo({tone = 'orange'}: {tone?: 'orange' | 'white'}) {
  return (
    <span className="brand-logo-art">
      <svg viewBox={tone === 'white' ? '352 248 4051 870' : '647 3589 4505 1007'} role="img" aria-label="SORAA" focusable="false">
        {tone === 'white' ? (
          <image href="/soraa-logo-white.png" width="1349" height="4769" transform="translate(4769 0) rotate(90)" />
        ) : (
          <image href="/soraa-logo-orange.png" width="5791" height="8192" />
        )}
      </svg>
    </span>
  );
}
