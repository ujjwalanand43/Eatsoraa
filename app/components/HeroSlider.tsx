import {useEffect, useState} from 'react';
import {Link} from 'react-router';

const slides = [
  {
    src: '/banner-first/background.webp',
    alt: 'Boring snacks? Hard pass. Bold flavours, premium snacks for whatever the day brings. Shop SORAA now.',
    color: '#faf7e6',
    artwork: true,
    kicker: '',
    headline: '',
    description: '',
  },
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
    if (hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [hovered, focused, reducedMotion]);
  return (
    <section
      className="home-hero-slider"
      aria-label="SORAA featured snacks"
      aria-roledescription="carousel"
      data-motion-paused={hovered || focused}
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
            className={`home-hero-slide${active === index ? ' is-current' : ''}${slide.artwork ? ' home-hero-artwork' : ''}`}
            style={{backgroundColor: slide.color}}
            aria-hidden={active !== index}
          >
            {slide.artwork ? (
              <Link
                className="home-hero-artwork-link"
                to="/collections/all"
                tabIndex={active === index ? 0 : -1}
                aria-label="Shop SORAA snacks"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width="8192"
                  height="3641"
                />
                <span className="hero-product-layers" aria-hidden="true">
                  {[
                    [0, 172, 838, 386, 300],
                    [1, 2161, 806, 357, 332],
                    [2, 890, 851, 377, 287],
                    [3, 1730, 852, 379, 286],
                    [4, 539, 878, 369, 260],
                    [5, 1346, 864, 416, 274],
                  ].map(([id, x, y, width, height]) => (
                    <span
                      key={id}
                      className="hero-product-pack"
                      style={{
                        left: `${(x / 2560) * 100}%`,
                        top: `${(y / 1138) * 100}%`,
                        width: `${(width / 2560) * 100}%`,
                        height: `${(height / 1138) * 100}%`,
                        animationDelay: `${-id * 0.7}s`,
                      }}
                    >
                      <img src={`/banner-first/Im${id}.webp`} alt="" />
                    </span>
                  ))}
                </span>
              </Link>
            ) : (
              <>
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={2066}
                  height={761}
                />
                <div className="home-hero-featured-copy">
                  <p className="home-hero-kicker">{slide.kicker}</p>
                  <h2>
                    {slide.headline.split('\n').map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h2>
                  <p className="home-hero-description">{slide.description}</p>
                  <ul
                    className="home-hero-benefits"
                    aria-label="SORAA benefits"
                  >
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
                      SHOP NOW
                    </Link>
                    <Link
                      to="/collections/all"
                      className="home-hero-secondary-cta"
                    >
                      EXPLORE MORE
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
