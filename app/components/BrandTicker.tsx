import {useState} from 'react';

function Megaphone() {
  return <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
    <path d="M52 54 140 8 151 32 55 61Z" fill="#FE5100" />
    <path d="m55 61 96-29 5 24-100 12Z" fill="#FE5100" />
    <path d="m56 68 100-12v24L55 75Z" fill="#ff905e" />
    <path d="m55 75 101 5-6 24-97-22Z" fill="#ffc4a1" />
    <path d="m53 82 97 22-10 14-88-29Z" fill="#ffe5d5" />
    <path d="M28 70v29q0 10 10 6l4-30M10 52q-12 14 0 25l20 2 27 14V35L29 50Z" fill="#ff905e" stroke="#482c22" strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 52v24M13 59v10M20 57v14" stroke="#482c22" strokeWidth="3" strokeLinecap="round" />
  </svg>;
}

export function BrandTicker() {
  const [paused, setPaused] = useState(false);
  return <section className={`brand-ticker${paused ? ' is-paused' : ''}`} aria-label="Better for you">
    <div className="brand-ticker-track" aria-hidden="true">
      {[0, 1].map((copy) => <div className="brand-ticker-group" key={copy}>
        {[0, 1].map((item) => <span className="brand-ticker-message" key={item}><Megaphone /><span>BETTER FOR YOU</span></span>)}
      </div>)}
    </div>
    <button className="ticker-control" type="button" aria-label={paused ? 'Play moving text' : 'Pause moving text'} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
  </section>;
}
