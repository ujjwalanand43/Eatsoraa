import {ButtonIcon} from './ButtonIcon';
import './WelcomeOffer.css';
import './WelcomeOfferMotion.css';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';

export function WelcomeOffer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const shownThisMount = useRef(false);
  const [step, setStep] = useState<'email' | 'pick' | 'reveal'>('email');
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  useEffect(() => {
    if (!unlocking) return;
    const timer = window.setTimeout(() => { setStep('pick'); setUnlocking(false); }, 500);
    return () => window.clearTimeout(timer);
  }, [unlocking]);
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
    if (selected === null) return;
    const timer = window.setTimeout(() => setStep('reveal'), 700);
    return () => window.clearTimeout(timer);
  }, [selected]);
  return <dialog ref={dialog} className="welcome-offer snack-game" aria-labelledby="welcome-offer-title">
    {step === 'reveal' && <div className="coupon-celebration" aria-hidden="true">
      {Array.from({length: 64}, (_, index) => <i key={index} style={{
        left: `${(index * 37) % 100}%`,
        backgroundColor: ['#ff5900', '#ffd447', '#bd3e65', '#7248a5', '#63bba2', '#ffffff'][index % 6],
        animationDelay: `${(index % 13) * 0.09}s`,
        animationDuration: `${2.3 + (index % 7) * 0.19}s`,
      }} />)}
    </div>}
    <span className="game-decor game-decor--star" aria-hidden="true">✦</span>
    <span className="game-decor game-decor--float" aria-hidden="true">✦</span>
    <span className="game-decor game-decor--circle" aria-hidden="true" />
    <button className="game-close" type="button" aria-label="Close welcome popup" onClick={() => dialog.current?.close()}><ButtonIcon name="close" /></button>
    <div className="game-layout">
      <div className="game-art">
        <img src="/feel-good/popup-breakfast.webp" alt="Woman pouring SORAA Breakfast Mix into a bowl" width="1080" height="1350" />
        <span className="game-sticker">GOOD SNACKS<br />GOOD MOOD</span>
      </div>
      <div className="game-content" key={step}>
        <p className="game-eyebrow">{step === 'email' ? '✦ HEY SNACKER! ✦' : step === 'pick' ? '✦ PICK YOUR DEAL! ✦' : '✦ YOU SCORED! ✦'}</p>
        <h2 id="welcome-offer-title">{step === 'email' ? 'PLAY & WIN A SNACK DEAL!' : step === 'pick' ? 'PICK YOUR SNACK SURPRISE!' : 'YOU WON 15% OFF!'}</h2>
        {step === 'email' && <>
          <div className="game-mini-cards" aria-hidden="true"><span><b>?</b></span><span><b>?</b></span><span><b>?</b></span></div>
          <p>Enter your email and unlock your special snack offer.</p>
          <form onSubmit={event => {event.preventDefault(); setUnlocking(true);}}>
            <label className="sr-only" htmlFor="game-email">Email address</label>
            <input id="game-email" type="email" required autoComplete="email" placeholder="Enter email address" />
            <button className="game-action" type="submit" disabled={unlocking}>{unlocking ? 'UNLOCKING…' : 'UNLOCK MY OFFER'} {!unlocking && <ButtonIcon name="right" />}</button>
          </form>
          <small>Preview experience — email signup and offer activation coming soon.</small>
        </>}
        {step === 'pick' && <>
          <p>One pick. One deal. Choose your mystery card.</p>
          <div className="game-cards">
            {[0, 1, 2].map(index => <button key={index} type="button" disabled={selected !== null} className={selected === index ? 'is-picked' : ''} onClick={() => setSelected(index)} aria-label={`Reveal mystery card ${index + 1}`}><strong>?</strong><span>MYSTERY</span></button>)}
          </div>
          <p role="status">{selected === null ? 'Pick one mystery snack to reveal your deal.' : 'Unwrapping your surprise…'}</p>
        </>}
        {step === 'reveal' && <>
          <p>Your snack deal preview is ready!</p>
          <div className="game-code"><strong>SORAA15</strong><button type="button" onClick={() => {void navigator.clipboard?.writeText('SORAA15').then(() => setCopied(true)).catch(() => setCopied(false));}}>{copied ? 'COPIED!' : 'COPY CODE'}</button></div>
          <Link className="game-action" to="/collections/all" onClick={() => dialog.current?.close()}>START SNACKING <ButtonIcon name="right" /></Link>
          <small role="status">Demo offer — this code is not active at checkout yet.</small>
        </>}
      </div>
    </div>
  </dialog>;
}
