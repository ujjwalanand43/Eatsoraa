import type {PointerEvent} from 'react';

export function BannerProductArt() {
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    node.style.setProperty('--art-x', `${x * 12}deg`);
    node.style.setProperty('--art-y', `${-y * 8}deg`);
  }
  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty('--art-x');
    event.currentTarget.style.removeProperty('--art-y');
  }
  return <div className="pdp-banner-art" onPointerMove={tilt} onPointerDown={tilt} onPointerLeave={reset} onPointerUp={reset} onPointerCancel={reset}>
    <div className="pdp-banner-art-depth">
      <img className="pdp-banner-pack-back" src="/feel-good/dry-fruits.png" alt="SORAA Premium Walnut Kernels" loading="lazy" draggable={false} width="1122" height="1402" />
      <img className="pdp-banner-pack-front" src="/feel-good/flavored-nuts.png" alt="SORAA Peri-Peri Roasted Cashews" loading="lazy" draggable={false} width="1122" height="1402" />
    </div>
  </div>;
}
