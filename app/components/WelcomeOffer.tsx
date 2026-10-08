import {ButtonIcon} from './ButtonIcon';
import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {Link} from 'react-router';

export function WelcomeOffer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef(0);
  const shownThisMount = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  function tiltArt(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = event.currentTarget;
    const bounds = node.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    node.style.setProperty('--tilt-x', `${-y * 8}deg`);
    node.style.setProperty('--tilt-y', `${x * 12}deg`);
    node.style.setProperty('--shift-x', `${x * 18}px`);
    node.style.setProperty('--shift-y', `${y * 12}px`);
  }
  function resetArt(event: PointerEvent<HTMLDivElement>) {
    for (const property of ['--tilt-x', '--tilt-y', '--shift-x', '--shift-y']) event.currentTarget.style.removeProperty(property);
  }
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const storageKey = 'soraa-welcome-last-shown';
    try {
      const lastShown = Number(localStorage.getItem(storageKey));
      if (!shownThisMount.current && lastShown > 0 && Date.now() - lastShown < 60 * 60 * 1000) return;
    } catch { /* Browsing remains available when storage is disabled. */ }
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const close = () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
    node.addEventListener('close', close);
    node.showModal();
    shownThisMount.current = true;
    try { localStorage.setItem(storageKey, String(Date.now())); } catch { /* Storage may be disabled. */ }
    document.body.style.overflow = 'hidden';
    return () => {node.removeEventListener('close', close); node.close(); document.body.style.overflow = overflow;};
  }, []);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const gold = ctx.createLinearGradient(0, 0, 640, 400);
    gold.addColorStop(0, '#f9d781'); gold.addColorStop(.5, '#c99a39'); gold.addColorStop(1, '#f7dca0');
    ctx.fillStyle = gold; ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = '#653815'; ctx.font = 'bold 36px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SCRATCH HERE', 320, 215);
  }, []);
  return <dialog ref={dialog} className="welcome-offer" aria-labelledby="welcome-offer-title">
    <button className="welcome-offer-close" type="button" aria-label="Close welcome popup" onClick={() => dialog.current?.close()}><ButtonIcon name="close" /></button>
    <div className="welcome-offer-layout">
      <div className="welcome-offer-copy">
        <p className="welcome-offer-brand">SORAA</p>
        <p className="welcome-offer-eyebrow">A LITTLE SURPRISE FOR YOUR SNACK BREAK</p>
        <h2 id="welcome-offer-title">Good snacks.<br /><span>A little luck.</span></h2>
        <p>Scratch the golden card to take a peek.</p>
        <div className="welcome-scratch">
          <div className="welcome-scratch-result" aria-live="polite">{revealed && <><strong>10% OFF</strong><span>Use code at checkout</span><b className="welcome-coupon">SORAA10</b></>}</div>
          {!revealed && <canvas ref={canvas} width="640" height="400" aria-hidden="true" onPointerDown={event => {event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const ctx = event.currentTarget.getContext('2d');
            if (!ctx) return;
            ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath();
            ctx.arc((event.clientX - rect.left) * 640 / rect.width, (event.clientY - rect.top) * 400 / rect.height, 48, 0, Math.PI * 2); ctx.fill();
            if (++strokes.current > 28) setRevealed(true);
          }} />}
        </div>
        {!revealed ? <button className="welcome-offer-action" type="button" onClick={() => setRevealed(true)}>Reveal surprise</button> : <>
          <button className="welcome-offer-action" type="button" onClick={() => {
            if (!navigator.clipboard) { setCopyStatus('Use code SORAA10 at checkout.'); return; }
            void navigator.clipboard.writeText('SORAA10').then(() => setCopyStatus('Copied! Use SORAA10 at checkout.'), () => setCopyStatus('Use code SORAA10 at checkout.'));
          }}>Copy code · SORAA10</button>
          <Link className="welcome-offer-shop" to="/collections/all" onClick={() => dialog.current?.close()}>Shop now</Link>
        </>}
        <small className="welcome-offer-note" role="status">{copyStatus || 'A little treat for your next snack order.'}</small>
        <button className="welcome-offer-skip" type="button" onClick={() => dialog.current?.close()}>Continue browsing</button>
      </div>
      <div className="welcome-offer-art welcome-offer-art-pair" onPointerMove={tiltArt} onPointerDown={tiltArt} onPointerLeave={resetArt} onPointerUp={resetArt} onPointerCancel={resetArt}>
        <div className="welcome-art-depth">
          <img draggable={false} className="welcome-pack-front" src="/feel-good/flavored-nuts.png" alt="SORAA Peri-Peri Roasted Cashews" width="1122" height="1402" />
        </div>
      </div>
    </div>
  </dialog>;
}
