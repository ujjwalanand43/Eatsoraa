import {ButtonIcon} from './ButtonIcon';
import {useRef, useState} from 'react';
import {Link} from 'react-router';
import type {ArticleItemFragment} from 'storefrontapi.generated';

export function HomeDiscovery({
  articles,
  journalOnly = false,
}: {
  articles: ArticleItemFragment[];
  journalOnly?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [logosPaused, setLogosPaused] = useState(false);
  function move(direction: number) {
    const node = track.current;
    if (!node) return;
    node.scrollBy({
      left: direction * (node.clientWidth * 0.8),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }
  return (
    <>
      {!journalOnly && (
        <section className="home-find" aria-labelledby="home-find-title">
          <div className="home-find-panel">
            <div className="home-find-copy">
              <h2 id="home-find-title">
                FIND US ON
                <br />
                <span>YOUR FAVOURITE</span><br />SNACK APPS.
              </h2>
              <Link className="orange-button" to="/collections/all">
                SHOP SORAA <span aria-hidden="true">↗</span>
              </Link>
              <svg className="home-find-arrow" viewBox="0 0 180 100" fill="none" aria-hidden="true"><path d="M8 88C50 10 112 8 164 42M151 12l17 32-36 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div
              className={`home-retailers${logosPaused ? ' logos-paused' : ''}`}
              aria-label="Find SORAA on these platforms"
            >
              <div className="retailer-reels">
                {(['left', 'center', 'right'] as const).map(
                  (laneName, lane) => {
                    const brands = [
                      {name: 'Amazon Now', image: 'amazon-now.jpeg'},
                      {
                        name: 'Flipkart Minutes',
                        image: 'flipkart-minutes.jpeg',
                      },
                      {name: 'Blinkit', image: 'blinkit.svg'},
                      {name: 'Zepto', image: 'zepto.svg'},
                      {name: 'Swiggy Instamart', image: 'instamart.avif'},
                      {name: 'Bigbasket', image: 'bigbasket.png'},
                    ];
                    // Cycle every platform in each lane, with staggered orders.
                    const order = [0, 3, 5, 1, 4, 2];
                    const ordered = order.map((_, index) => {
                      const brand = brands[order[(index + lane * 2) % order.length]];
                      return {...brand, key: brand.name};
                    });
                    return (
                      <div className="retailer-reel" key={laneName}>
                        <div className="retailer-reel-track">
                          {(['primary', 'duplicate'] as const).map((copy) => (
                            <div
                              className="retailer-reel-set"
                              key={copy}
                              aria-hidden={copy === 'duplicate'}
                            >
                              {ordered.map((brand) => (
                                <div
                                  className="retailer-reel-logo"
                                  key={brand.key}
                                >
                                  <img
                                    src={`/retailers/${brand.image}`}
                                    alt={brand.name}
                                    width="180"
                                    height="100"
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
              <p>Availability varies by location.</p>
              <button
                className="retailer-motion-toggle"
                type="button"
                aria-pressed={logosPaused}
                onClick={() => setLogosPaused(!logosPaused)}
              >
                {logosPaused ? '▶ Resume animation' : 'Ⅱ Pause animation'}
              </button>
            </div>
          </div>
        </section>
      )}
      <section className="home-journal" aria-labelledby="home-journal-title">
        <div className="home-journal-panel">
          <div className="home-journal-intro">
            <p className="discovery-eyebrow">FRESH READS. GOOD IDEAS.</p>
            <h2 id="home-journal-title">
              The daily
              <br />
              <span>snack.</span>
            </h2>
            <p>Stories, ingredients and inspiration for your everyday.</p>
            <Link to="/blogs/news">Explore the journal</Link>
            {articles.length > 1 && (
              <div className="home-journal-controls">
                <button onClick={() => move(-1)} aria-label="Previous stories">
                  <ButtonIcon name="left" />
                </button>
                <button onClick={() => move(1)} aria-label="Next stories">
                  <ButtonIcon name="right" />
                </button>
              </div>
            )}
          </div>
          <div
            ref={track}
            className="home-journal-track"
            aria-label="Latest SORAA stories"
          >
            {articles.map((article) => (
              <article className="home-story" key={article.id}>
                <Link to={`/blogs/news/${article.handle}`}>
                  <div className="home-story-image">
                    {article.image ? (
                      <img
                        src={article.image.url}
                        alt={article.image.altText ?? article.title}
                        loading="lazy"
                        width={article.image.width ?? 600}
                        height={article.image.height ?? 600}
                      />
                    ) : (
                      <span>SORAA JOURNAL</span>
                    )}
                  </div>
                  <div className="home-story-copy">
                    <small>THE SORAA JOURNAL</small>
                    <h3>{article.title}</h3>
                    <span className="home-story-read">Read story</span>
                  </div>
                </Link>
              </article>
            ))}
            {!articles.length && (
              <div className="home-journal-empty">
                <h3>A little food for thought.</h3>
                <p>
                  New stories are on the way. Explore our snacks while we get
                  the next read ready.
                </p>
                <Link to="/collections/all">Discover SORAA</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
