import {Link} from 'react-router';
import {useEffect, useState} from 'react';

const moments = [
  {name: 'Work', headline: ['Less scrolling.', 'More snacking.'], cta: 'Shop desk-side favourites', handle: 'seed-mixes'},
  {name: 'Gym', headline: ['Move a little.', 'Crunch a little.'], cta: 'Find your next snack', handle: 'dry-fruits'},
  {name: 'Travel', headline: ['Pack light.', 'Snack right.'], cta: 'Shop travel favourites', handle: 'trail-mixes'},
  {name: 'Chill', headline: ['Slow afternoons.', 'Good company.'], cta: 'Find your cosy favourite', handle: 'flavored-nuts'},
];

function LifestyleScene({index}: {index: number}) {
  return <svg className="snack-life-scene" viewBox={`${index * 543} 0 543 724`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <image href="/lifestyle-scenes.png" width="2172" height="724" />
  </svg>;
}

function LifestyleSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || interacting || reduced) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % moments.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, interacting, reduced, active]);
  const select = (index: number) => {setActive((index + moments.length) % moments.length); setPaused(true);};
  return <div className="snack-life-slider" role="region" aria-roledescription="carousel" aria-label="Everyday snack moments" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setPaused(true)}>
    {moments.map((moment, index) => <Link key={moment.name} className={`snack-life-photo snack-life-slide${index === active ? ' is-active' : ''}`} to={`/collections/${moment.handle}`} tabIndex={index === active ? 0 : -1} aria-hidden={index !== active}>
      <LifestyleScene index={index} />
      <div className="snack-life-overlay"><small>{moment.name.toUpperCase()} / YOUR EVERYDAY RESET</small><h3>{moment.headline[0]}<br />{moment.headline[1]}</h3><span className="snack-life-shop-button">Shop Now <span aria-hidden="true">↗</span></span></div>
    </Link>)}
    <div className="snack-life-slider-controls">
      <button type="button" aria-label="Previous lifestyle slide" onClick={() => select(active - 1)}>←</button>
      <div className="snack-life-slide-dots">{moments.map((moment, index) => <button key={moment.name} type="button" aria-label={`Show ${moment.name} slide`} aria-pressed={active === index} onClick={() => select(index)} />)}</div>
      <button type="button" aria-label="Next lifestyle slide" onClick={() => select(active + 1)}>→</button>
      {!reduced && <button type="button" aria-label={paused ? 'Play lifestyle slideshow' : 'Pause lifestyle slideshow'} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>}
    </div>
  </div>;
}

export function HomeLifestyle() {
  return <section className="snack-life" aria-labelledby="snack-life-heading">
    <header className="snack-life-header">
      <div><p className="snack-life-eyebrow">GOOD COMPANY. WHEREVER YOU GO.</p><h2 id="snack-life-heading">Big days. Little breaks.<br /><span>Make room for good snacks.</span></h2></div>
      <div className="snack-life-intro"><p>For the desk drawer, the weekend bag and those just-for-you moments. Bring a little crunch along.</p><Link className="snack-life-cta" to="/collections/all">Find your everyday favourite <span aria-hidden="true">↗</span></Link></div>
    </header>
    <div className="snack-life-grid">
      <article className="snack-life-note">
        <span className="snack-life-sun" aria-hidden="true">✳</span>
        <h3>A little pause.<br />A lot to love.</h3>
        <p>Close the laptop. Take the scenic route. Make your next break a tasty one.</p>
        <div className="snack-life-moments"><span>01 / WORK</span><span>02 / WANDER</span><span>03 / UNWIND</span></div>
        <Link to="/pages/about">Meet SORAA <span aria-hidden="true">→</span></Link>
      </article>
      <LifestyleSlider />
      <Link className="snack-life-photo snack-life-travel" to="/collections/trail-mixes">
        <LifestyleScene index={2} />
        <div className="snack-life-overlay"><small>PACK A LITTLE GOODNESS</small><h3>Good snacks.<br />Great detours.</h3><div className="snack-life-tags"><span>Work breaks</span><span>Weekend escapes</span><span>Just because</span></div><span className="snack-life-shop-button">Shop Now <span aria-hidden="true">↗</span></span></div>
      </Link>
    </div>
  </section>;
}
