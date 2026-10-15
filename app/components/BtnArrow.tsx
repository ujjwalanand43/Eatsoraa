/** Small round arrow badge used inside call-to-action buttons. */
export function BtnArrow({direction = 'up-right'}: {direction?: 'up-right' | 'down'}) {
  return (
    <span className={`btn-arrow btn-arrow--${direction}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'down' ? <path d="M8 3v10M4 9l4 4 4-4" /> : <path d="M5 11 11 5M6 5h5v5" />}
      </svg>
    </span>
  );
}
