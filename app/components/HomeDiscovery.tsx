import {useRef, useState} from 'react';
import {Link} from 'react-router';
import type {ArticleItemFragment} from 'storefrontapi.generated';

export function HomeDiscovery({articles, journalOnly = false}: {articles: ArticleItemFragment[]; journalOnly?: boolean}) {
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
      {!journalOnly && <section className="home-find" aria-labelledby="home-find-title">
        <div className="home-find-panel">
          <div>
            <p className="discovery-eyebrow">YOUR NEXT SNACK STOP</p>
            <h2 id="home-find-title">
              Find us.
              <br />
              <span>Snack happy.</span>
            </h2>
            <p>
              Your favourite snacks, on your favourite apps. Search for SORAA to
              discover what&apos;s available in your area.
            </p>
            <Link className="orange-button" to="/collections/all">
              SHOP DIRECT <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div
            className={`home-retailers${logosPaused ? ' logos-paused' : ''}`}
            aria-label="Find SORAA on these platforms"
          >
            {[
              {name: 'Amazon Now', image: 'amazon-now.jpeg'},
              {name: 'Flipkart Minutes', image: 'flipkart-minutes.jpeg'},
              {name: 'Blinkit', image: 'blinkit.svg'},
              {name: 'Zepto', image: 'zepto.svg'},
              {name: 'Swiggy Instamart', image: 'instamart.avif'},
              {name: 'Bigbasket', image: 'bigbasket.png'},
            ].map(({name, image}) => (
              <div
                key={name}
                className={
                  name === 'Blinkit' ? 'home-retailer-blinkit' : undefined
                }
              >
                <img
                  className="home-retailer-logo"
                  src={`/retailers/${image}`}
                  alt={name}
                  loading="lazy"
                  width="180"
                  height="100"
                />
              </div>
            ))}
            <p>Availability varies by location.</p>
            <button className="retailer-motion-toggle" type="button" aria-pressed={logosPaused} onClick={() => setLogosPaused(!logosPaused)}>
              {logosPaused ? '▶ Resume animation' : 'Ⅱ Pause animation'}
            </button>
          </div>
        </div>
      </section>}
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
            <Link to="/blogs/news">Explore the journal ↗</Link>
            {articles.length > 1 && (
              <div className="home-journal-controls">
                <button onClick={() => move(-1)} aria-label="Previous stories">
                  ←
                </button>
                <button onClick={() => move(1)} aria-label="Next stories">
                  →
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
                    <span className="home-story-read">Read story ↗</span>
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
                <Link to="/collections/all">Discover SORAA →</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
