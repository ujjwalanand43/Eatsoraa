import {useState} from 'react';

const images = [
  ['social-cashews.jpg', 'SORAA Sea Salt Cashews at a street festival'],
  ['social-berry.jpg', 'Berry Blast Mix tucked into an everyday bag'],
  ['social-breakfast.jpg', 'Breakfast Mix ready for a busy day'],
  ['social-sea-salt.jpg', 'Sea Salt Cashews on the go'],
  ['social-snack-selection.jpg', 'A handful of SORAA snack favourites'],
  ['social-date-bites.jpg', 'SORAA Date Bites with a little good company'],
];

export function BulkSocialGallery() {
  const [paused, setPaused] = useState(false);
  return <section className="bulk-social" aria-labelledby="bulk-social-title">
    <header className="bulk-social-heading">
      <h1 id="bulk-social-title">GET TO KNOW SORAA</h1>
      <a href="https://www.instagram.com/eat_soraa/" target="_blank" rel="noreferrer">@eat_soraa</a>
    </header>
    <div className="bulk-social-window">
      <div className="bulk-social-track" style={{animationPlayState: paused ? 'paused' : undefined}}>
        {[0, 1].map(copy => <div className="bulk-social-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {images.map(([src, alt]) => <img key={src} src={`/feel-good/${src}`} alt={copy === 0 ? alt : ''} loading="lazy" width="900" height="1200" />)}
        </div>)}
      </div>
    </div>
    <button className="bulk-social-pause" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Play gallery' : 'Pause gallery'}</button>
  </section>;
}
