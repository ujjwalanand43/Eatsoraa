import {useEffect, useState} from 'react';
import {Link} from 'react-router';

const slides = [
  {
    src: '/hero-snack-range.jpg',
    alt: 'SORAA roasted nuts, trail mixes and everyday snacks.',
    color: '#f75312',
    kicker: 'GOOD SNACKS. BETTER DAYS.',
    headline: 'SNACK PLANS?\nWE’RE IN.',
    description:
      'From everyday cravings to last-minute plans, there’s a SORAA snack made to go with you.',
  },
  {
    src: '/hero-snack-peach.jpg',
    alt: 'SORAA snack range on a warm peach campaign background.',
    color: '#f75312',
    kicker: 'CRUNCH. SMILE. REPEAT.',
    headline: 'GOOD SNACKS.\nGREAT PLANS.',
    description:
      'Big flavour, real ingredients and colourful packs ready for every little adventure.',
  },
  {
    src: '/hero-snack-berry.jpg',
    alt: 'SORAA snack range on a bold berry-red campaign background.',
    color: '#a9002e',
    kicker: 'YOUR KIND OF CRUNCH.',
    headline: 'CRAVINGS?\nSORTED.',
    description:
      'Pick your favourite, tear it open and turn any moment into a better snack break.',
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion]);
  return (
    <section
      className="home-hero-slider"
      aria-label="SORAA featured snacks"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <h1 className="hero-accessible-copy">
        Snack good. Feel good. Discover SORAA.
      </h1>
      <div className="home-hero-stage">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`home-hero-slide${active === index ? ' is-current' : ''}`}
            style={{backgroundColor: slide.color}}
            aria-hidden={active !== index}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              width={2066}
              height={761}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            <div className="home-hero-featured-copy">
              <p className="home-hero-kicker">{slide.kicker}</p>
              <h2>
                {slide.headline.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="home-hero-description">{slide.description}</p>
              <ul className="home-hero-benefits" aria-label="SORAA benefits">
                <li>
                  <strong>REAL</strong>
                  <span>INGREDIENTS</span>
                </li>
                <li>
                  <strong>BOLD</strong>
                  <span>FLAVOURS</span>
                </li>
                <li>
                  <strong>EASY</strong>
                  <span>SNACKING</span>
                </li>
              </ul>
              <div className="home-hero-actions">
                <Link
                  to="/collections/best-sellers"
                  className="home-hero-primary-cta"
                >
                  SHOP NOW <span aria-hidden="true">→</span>
                </Link>
                <Link to="/collections/all" className="home-hero-secondary-cta">
                  EXPLORE MORE <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="home-hero-toolbar">
        <div className="home-hero-controls">
          <button
            onClick={() =>
              setActive((index) => (index + slides.length - 1) % slides.length)
            }
            aria-label="Previous hero slide"
          >
            ←
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              className="home-hero-dot"
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            />
          ))}
          <button
            onClick={() => setActive((index) => (index + 1) % slides.length)}
            aria-label="Next hero slide"
          >
            →
          </button>
          {!reducedMotion && (
            <button
              onClick={() => setPaused((value) => !value)}
              aria-label={
                paused ? 'Play hero slideshow' : 'Pause hero slideshow'
              }
            >
              {paused ? '▶' : 'Ⅱ'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
