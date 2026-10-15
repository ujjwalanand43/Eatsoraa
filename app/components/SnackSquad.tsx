import {ButtonIcon} from './ButtonIcon';
import {useEffect, useRef, useState} from 'react';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link, type FetcherWithComponents} from 'react-router';
import type {HomeProductsQuery} from 'storefrontapi.generated';
import {reviewVideos} from '~/lib/reviewVideos';

type CartResult = {errors?: Array<{message: string}>; cart?: {id: string}};

export function SnackSquad({
  products,
}: {
  products: HomeProductsQuery['products']['nodes'];
}) {
  const track = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Start centred on the first product that has a review video.
  const videoIndex = products.findIndex((product) => reviewVideos[product.handle]);
  const startIndex = videoIndex >= 0 ? videoIndex : Math.min(2, products.length - 1);
  const [position, setPosition] = useState(startIndex);
  const [soundOn, setSoundOn] = useState(true);
  const [alignTick, setAlignTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  const repeatedProducts =
    products.length > 1
      ? [0, 1, 2].flatMap((set) => products.map((product) => ({product, set})))
      : products.map((product) => ({product, set: 0}));

  function centeredPhysicalIndex() {
    const node = track.current;
    if (!node) return 0;
    const center = node.scrollLeft + node.clientWidth / 2;
    let closest = 0;
    let distance = Infinity;
    Array.from(node.children).forEach((element, index) => {
      const card = element as HTMLElement;
      const delta = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (delta < distance) {
        distance = delta;
        closest = index;
      }
    });
    return closest;
  }

  function moveToPhysical(index: number, smooth = true) {
    const node = track.current;
    const card = node?.children[index] as HTMLElement | undefined;
    if (!node || !card) return;
    node.scrollTo({
      left: card.offsetLeft - node.clientWidth / 2 + card.offsetWidth / 2,
      behavior:
        smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth'
          : 'instant',
    });
  }


  useEffect(() => {
    const initial = startIndex;
    const node = track.current;
    if (!node) return;
    let frame = 0;
    let initialized = false;
    const align = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = initialized ? centeredPhysicalIndex() : products.length > 1 ? products.length + initial : initial;
        moveToPhysical(index, false);
        initialized = true;
        setAlignTick((tick) => tick + 1);
      });
    };
    const observer = new ResizeObserver(align);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    align();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [products.length, startIndex]);

  useEffect(() => {
    // Only the centred card's video plays (with sound if the browser allows it).
    const node = track.current;
    if (!node) return;
    const centre = centeredPhysicalIndex();
    node.querySelectorAll('video').forEach((video) => {
      if (video.dataset.physical === String(centre) && inView && !paused) {
        video.muted = !soundOn;
        video.play().catch(() => {
          // Browsers block autoplay with sound until the visitor interacts.
          video.muted = true;
          setSoundOn(false);
          void video.play().catch(() => {});
        });
      } else {
        video.muted = true;
        video.pause();
      }
    });
  }, [position, soundOn, alignTick, paused, inView]);

  // Leaving the section (scrolling up or down) pauses and mutes the videos.
  useEffect(() => {
    const node = track.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setSoundOn(false);
      },
      {threshold: 0.35},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // A new slide always starts playing.
  useEffect(() => setPaused(false), [position]);

  if (!products.length)
    return (
      <p className="social-loading">
        Discover your next favourite snack in our shop.
      </p>
    );

  return (
    <div
      className="squad-carousel"
      role="region"
      aria-label="Customer review videos"
    >
      <div
        className="social-grid"
        ref={track}
        id="snack-squad-cards"
        onScroll={() => {
          const node = track.current;
          if (!node) return;
          const physicalIndex = centeredPhysicalIndex();
          setPosition(physicalIndex % products.length);

          if (scrollTimer.current) clearTimeout(scrollTimer.current);
          scrollTimer.current = setTimeout(() => {
            const settledIndex = centeredPhysicalIndex();
            if (
              products.length > 1 &&
              (settledIndex < products.length ||
                settledIndex >= products.length * 2)
            ) {
              moveToPhysical(
                products.length + (settledIndex % products.length),
                false,
              );
              setAlignTick((tick) => tick + 1);
            }
          }, 140);
        }}
      >
        {repeatedProducts.map(({product, set}, index) => {
          const logicalIndex = index % products.length;
          const video = reviewVideos[product.handle];
          const variant = product.selectedOrFirstAvailableVariant;
          return (
            <article
              key={`${product.id}-${set}`}
              className={`social-card${video ? ' social-card--video' : ''}${position === logicalIndex ? ' is-active' : ''}`}
              aria-label={`Review ${logicalIndex + 1}: ${product.title}`}
            >
              <div
                className="social-image"
                onClick={(event) => {
                  if (!video || (event.target as HTMLElement).closest('.squad-sound')) return;
                  setPaused((value) => !value);
                }}
              >
                {video ? (
                  <>
                  <video
                    key={video.src}
                    data-index={logicalIndex}
                    data-physical={index}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={video.poster}
                    aria-label={`Customer review of ${product.title}`}
                  >
                    <source src={video.src} type="video/mp4" />
                    {video.captions ? (
                      <track
                        kind="captions"
                        src={video.captions}
                        srcLang="en"
                        label="English"
                        default
                      />
                    ) : null}
                  </video>
                  <button
                    type="button"
                    className="squad-sound"
                    aria-label={soundOn ? 'Mute video' : 'Unmute video'}
                    aria-pressed={!soundOn}
                    onClick={() => setSoundOn((on) => !on)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
                      {soundOn ? (
                        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                      ) : (
                        <path d="m16 9 5 6M21 9l-5 6" />
                      )}
                    </svg>
                  </button>
                  {paused && position === logicalIndex ? (
                    <span className="squad-paused" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  ) : null}
                  </>
                ) : (
                  <div className="squad-video-empty">
                    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                      <rect
                        x="5"
                        y="11"
                        width="27"
                        height="26"
                        rx="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m32 20 11-6v20l-11-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <strong>Review video</strong>
                    <span>Coming soon</span>
                  </div>
                )}
              </div>
              <Link
                className="squad-product"
                to={`/products/${product.handle}`}
                prefetch="intent"
              >
                {product.featuredImage && (
                  <Image
                    data={product.featuredImage}
                    alt=""
                    sizes="42px"
                    loading="lazy"
                    style={{width: 42, height: 58}}
                  />
                )}
                <div>
                  <h3>{product.title}</h3>
                  <Money
                    data={variant?.price ?? product.priceRange.minVariantPrice}
                  />
                  <span className="squad-details">View product</span>
                </div>
              </Link>
              <div className="squad-cart">
                <CartForm
                  route="/cart"
                  inputs={{
                    lines: variant
                      ? [{merchandiseId: variant.id, quantity: 1}]
                      : [],
                  }}
                  action={CartForm.ACTIONS.LinesAdd}
                >
                  {(fetcher: FetcherWithComponents<CartResult>) => (
                    <>
                      <button
                        type="submit"
                        disabled={
                          !variant?.availableForSale || fetcher.state !== 'idle'
                        }
                        aria-label={`Add ${product.title} to cart`}
                      >
                        {!variant?.availableForSale
                          ? 'Sold out'
                          : fetcher.state !== 'idle'
                            ? 'Adding…'
                            : 'Add to Cart +'}
                      </button>
                      <p role="status">
                        {fetcher.state === 'idle' &&
                          (fetcher.data?.errors?.length
                            ? fetcher.data.errors
                                .map((error) => error.message)
                                .join(' ')
                            : fetcher.data?.cart
                              ? 'Added to cart ✓'
                              : '')}
                      </p>
                    </>
                  )}
                </CartForm>
              </div>
            </article>
          );
        })}
      </div>
      <div className="review-small-controls" aria-label="Review navigation">
        <button type="button" aria-label="Previous review" onClick={() => moveToPhysical(centeredPhysicalIndex() - 1)}>
          <ButtonIcon name="left" />
        </button>
        <button type="button" aria-label="Next review" onClick={() => moveToPhysical(centeredPhysicalIndex() + 1)}>
          <ButtonIcon name="right" />
        </button>
      </div>
    </div>
  );
}
