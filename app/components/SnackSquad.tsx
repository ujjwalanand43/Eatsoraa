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
  const [position, setPosition] = useState(Math.min(2, products.length - 1));

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
          : 'auto',
    });
  }

  function moveTo(index: number, smooth = true) {
    if (products.length <= 1) return moveToPhysical(0, smooth);
    const normalized =
      ((index % products.length) + products.length) % products.length;
    const current = centeredPhysicalIndex();
    const candidates = [
      normalized,
      normalized + products.length,
      normalized + products.length * 2,
    ];
    const closest = candidates.reduce((best, candidate) =>
      Math.abs(candidate - current) < Math.abs(best - current)
        ? candidate
        : best,
    );
    moveToPhysical(closest, smooth);
  }

  useEffect(() => {
    const initial = Math.min(2, products.length - 1);
    moveToPhysical(
      products.length > 1 ? products.length + initial : initial,
      false,
    );
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [products.length]);

  useEffect(() => {
    track.current?.querySelectorAll('video').forEach((video) => {
      if (video.dataset.index !== String(position)) video.pause();
    });
  }, [position]);

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
              className={`social-card${position === logicalIndex ? ' is-active' : ''}`}
              aria-label={`Review ${logicalIndex + 1}: ${product.title}`}
            >
              <div className="social-image">
                {video ? (
                  <video
                    key={video.src}
                    data-index={logicalIndex}
                    controls
                    playsInline
                    preload="none"
                    poster={video.poster}
                    aria-label={`Customer review of ${product.title}`}
                  >
                    <source src={video.src} />
                    <track
                      kind="captions"
                      src={video.captions}
                      srcLang="en"
                      label="English"
                      default
                    />
                  </video>
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
                  <span className="squad-details">View product ↗</span>
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
      <div className="social-controls">
        <button
          type="button"
          onClick={() => moveToPhysical(centeredPhysicalIndex() - 1)}
          aria-label="Previous review"
          aria-controls="snack-squad-cards"
        >
          ←
        </button>
        <div className="squad-pagination">
          {products.map((product, index) => (
            <button
              type="button"
              key={product.id}
              className={position === index ? 'is-active' : ''}
              aria-label={`Show review ${index + 1}`}
              aria-current={position === index ? 'true' : undefined}
              onClick={() => moveTo(index)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => moveToPhysical(centeredPhysicalIndex() + 1)}
          aria-label="Next review"
          aria-controls="snack-squad-cards"
        >
          →
        </button>
      </div>
    </div>
  );
}
