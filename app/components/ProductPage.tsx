import {ButtonIcon} from './ButtonIcon';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money, type MappedProductOptions} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
  PdpRecommendationsQuery,
} from 'storefrontapi.generated';
import {ProductPurchase} from './ProductPurchase';
import {packSavings} from '~/lib/packSavings';
import {RelatedProductCard} from './RelatedProductCard';
import {WishlistButton} from './WishlistButton';
import {ProductWorld, ProductFaq} from './ProductExtras';

type Row = {label: string; value: string};
type Review = {
  name: string;
  rating: number;
  text: string;
  verified?: boolean;
  date?: string;
};
function json(value?: string) {
  try {
    return JSON.parse(value || 'null') as unknown;
  } catch {
    return null;
  }
}
function strings(value?: string): string[] {
  const parsed = json(value);
  return Array.isArray(parsed)
    ? parsed.filter((x): x is string => typeof x === 'string')
    : [];
}
function nutritionRows(value?: string): Row[] {
  const parsed = json(value);
  return Array.isArray(parsed)
    ? parsed.filter(
        (x): x is Row =>
          !!x &&
          typeof x === 'object' &&
          'label' in x &&
          'value' in x &&
          typeof x.label === 'string' &&
          typeof x.value === 'string',
      )
    : [];
}
function reviewRows(value?: string): Review[] {
  const parsed = json(value);
  return Array.isArray(parsed)
    ? parsed.filter(
        (x): x is Review =>
          !!x &&
          typeof x === 'object' &&
          'name' in x &&
          'text' in x &&
          'rating' in x &&
          typeof x.name === 'string' &&
          typeof x.text === 'string' &&
          typeof x.rating === 'number' &&
          x.rating >= 1 &&
          x.rating <= 5,
      )
    : [];
}
function Icon({kind}: {kind: 'leaf' | 'heart' | 'truck' | 'shield'}) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'leaf' ? (
        <>
          <path d="M20 3C8 2 2 7 5 15s16 3 15-12Z" />
          <path d="m4 21 12-13" />
        </>
      ) : kind === 'heart' ? (
        <path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 2 11 8 15 6-4 13-10 8-15Z" />
      ) : kind === 'truck' ? (
        <>
          <path d="M2 5h12v12H2zM14 9h4l4 5v3h-8" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </>
      ) : (
        <>
          <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
          <path d="m8 12 3 3 5-6" />
        </>
      )}
    </svg>
  );
}
function Gallery({
  product,
  variant,
}: {
  product: ProductFragment;
  variant: ProductVariantFragment | null;
}) {
  const images = [variant?.image, ...product.images.nodes].filter(
    (image, index, list): image is NonNullable<typeof image> =>
      Boolean(image) &&
      list.findIndex((item) => item?.url === image?.url) === index,
  );
  const [chosen, setChosen] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => setChosen(0), [variant?.id]);
  const active = images[chosen] || images[0];
  const move = (step: number) =>
    setChosen((index) => (index + step + images.length) % images.length);
  return (
    <div className="pdp-gallery">
      {images.length > 1 && (
        <div className="pdp-thumbnails" aria-label="Product photographs">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id || image.url}
              className={chosen === index ? 'selected' : ''}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={chosen === index}
              onClick={() => setChosen(index)}
            >
              <Image data={image} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="pdp-photo">
        {active ? (
          <>
            <button
              type="button"
              className="pdp-image-open"
              aria-label="Enlarge product image"
              onClick={() => dialog.current?.showModal()}
            >
              <Image
                key={active.url}
                data={active}
                alt={active.altText || product.title}
                sizes="(min-width: 1024px) 48vw, 90vw"
                loading="eager"
              />
            </button>
            <button
              type="button"
              className="pdp-zoom"
              aria-label="Zoom product image"
              onClick={() => dialog.current?.showModal()}
            >
              ⌕
            </button>
          </>
        ) : (
          <p>Product photograph coming soon</p>
        )}
      </div>
      {images.length > 1 && (
        <div className="pdp-editorial-grid" aria-label="More product moments">
          {(images.length > 3 ? images.slice(2, 4) : images.slice(1, 3)).map(
            (image, index) => (
              <button
                type="button"
                key={`editorial-${image.id || image.url}`}
                onClick={() => {
                  setChosen(images.findIndex((item) => item.url === image.url));
                  dialog.current?.showModal();
                }}
                aria-label={`Open product lifestyle image ${index + 2}`}
              >
                <Image
                  data={image}
                  alt={image.altText || `${product.title} lifestyle`}
                  sizes="(min-width: 900px) 24vw, 46vw"
                  loading="lazy"
                />
              </button>
            ),
          )}
        </div>
      )}
      <dialog
        ref={dialog}
        className="pdp-lightbox"
        aria-label={`${product.title} image gallery`}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') move(-1);
          if (event.key === 'ArrowRight') move(1);
        }}
      >
        <button
          type="button"
          className="pdp-lightbox-close"
          aria-label="Close enlarged image"
          onClick={() => dialog.current?.close()}
        >
          <ButtonIcon name="close" />
        </button>
        <div className="pdp-lightbox-stage">
          {images.length > 1 && (
            <button
              type="button"
              className="pdp-lightbox-arrow prev"
              aria-label="Previous product image"
              onClick={() => move(-1)}
            >
              <ButtonIcon name="left" />
            </button>
          )}
          {active && (
            <Image
              key={active.url}
              data={active}
              alt={active.altText || `${product.title}, image ${chosen + 1}`}
              sizes="90vw"
            />
          )}
          {images.length > 1 && (
            <button
              type="button"
              className="pdp-lightbox-arrow next"
              aria-label="Next product image"
              onClick={() => move(1)}
            >
              <ButtonIcon name="right" />
            </button>
          )}
        </div>
        {images.length > 1 && (
          <div
            className="pdp-lightbox-thumbnails"
            aria-label="Choose product image"
          >
            {images.map((image, index) => (
              <button
                type="button"
                key={image.id || image.url}
                className={chosen === index ? 'selected' : ''}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={chosen === index}
                onClick={() => setChosen(index)}
              >
                <Image data={image} alt="" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </dialog>
    </div>
  );
}
const tabs = ['Description', 'Ingredients', 'Nutrition facts', 'Reviews'];
export function ProductPage({
  product,
  selectedVariant,
  productOptions,
  recommendations,
}: {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment | null;
  productOptions: MappedProductOptions[];
  recommendations: Promise<PdpRecommendationsQuery | null>;
}) {
  const [tab, setTab] = useState(0);
  const reviews = reviewRows(product.reviews?.value);
  const featuredReviews = reviews.slice(0, 5);
  const [reviewSlide, setReviewSlide] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [reviewLimit, setReviewLimit] = useState(4);
  const nutrition = nutritionRows(product.nutrition?.value);
  const highlights = strings(product.highlights?.value).slice(0, 4);
  const collection = product.collections.nodes.find(
    (item) => item.handle !== 'frontpage',
  );
  const image =
    product.images.nodes.find((item) =>
      /lifestyle|serving|bowl/i.test(item.altText || ''),
    ) ||
    product.images.nodes[0] ||
    selectedVariant?.image;
  const rating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;
  useEffect(() => {
    if (featuredReviews.length < 2 || reviewPaused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setReviewSlide((current) => (current + 1) % featuredReviews.length);
      }
    }, 4800);
    return () => window.clearInterval(timer);
  }, [featuredReviews.length, reviewPaused]);
  useEffect(() => {
    if (reviewSlide >= featuredReviews.length) setReviewSlide(0);
  }, [reviewSlide, featuredReviews.length]);
  const featuredReview = featuredReviews[reviewSlide];
  const savings = packSavings(productOptions, selectedVariant);
  const comparisonPrice = savings?.price || selectedVariant?.compareAtPrice;
  const compare = Number(comparisonPrice?.amount);
  const price = Number(selectedVariant?.price.amount);
  const discount =
    compare > price ? Math.round((1 - price / compare) * 100) : 0;
  const ingredients =
    product.ingredients?.type === 'list.single_line_text_field'
      ? strings(product.ingredients.value).join(', ')
      : product.ingredients?.value;
  const related = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLElement>(null);
  const showDescription = () => {
    setTab(0);
    requestAnimationFrame(() =>
      details.current?.scrollIntoView({behavior: 'smooth', block: 'start'}),
    );
  };
  const nutritionPanel = (
    <div className="pdp-nutrition">
      <h3>Nutrition facts</h3>
      {nutrition.length ? (
        <>
          <p className="pdp-muted">Per 100 g</p>
          <dl>
            {nutrition.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p>
          Refer to the product packaging for the nutrition panel and serving
          information.
        </p>
      )}
    </div>
  );
  return (
    <div className="pdp">
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        {collection && (
          <>
            <Link to={`/collections/${collection.handle}`}>
              {collection.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span aria-current="page">{product.title}</span>
      </nav>
      <section className="pdp-top">
        <Gallery product={product} variant={selectedVariant} />
        <div className="pdp-summary">
          <div className="pdp-offer-ribbon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 5.5V12l8 8 9-9-8-8H5.5A2.5 2.5 0 0 0 3 5.5Z" />
              <circle cx="8" cy="8" r="1.25" />
            </svg>
            <span className="pdp-offer-copy">
              <strong>Get 10% off your first order!</strong>
              <small>
                First time? Use code <b>SORAA10</b> at checkout.
              </small>
            </span>
          </div>
          <p className="pdp-eyebrow">
            {product.productType || collection?.title || 'SORAA SNACKS'}
          </p>
          <h1>{product.title}</h1>
          <p className="pdp-snack-proof">
            <span aria-hidden="true">✓</span>
            {reviews.length
              ? `Loved by ${reviews.length} verified snack moments`
              : 'Made for brighter everyday snack breaks'}
          </p>
          <div className="pdp-meta-row">
            <a className="pdp-rating" href="#customer-reviews">
              {rating ? (
                <>
                  <span className="pdp-stars" aria-hidden="true">
                    {'★'.repeat(Math.round(rating))}
                    {'☆'.repeat(5 - Math.round(rating))}
                  </span>{' '}
                  {rating.toFixed(1)} <span>({reviews.length} reviews)</span>
                </>
              ) : (
                'Customer reviews ↓'
              )}
            </a>
            <WishlistButton
              item={{
                handle: product.handle,
                title: product.title,
                image:
                  selectedVariant?.image?.url || product.images.nodes[0]?.url,
                price: selectedVariant?.price.amount || '0',
                currencyCode: selectedVariant?.price.currencyCode || 'INR',
              }}
              className="pdp-wishlist"
            />
          </div>
          <div className="pdp-price">
            {selectedVariant?.price && <Money data={selectedVariant.price} />}
            {discount > 0 && comparisonPrice && (
              <>
                <s>
                  <Money data={comparisonPrice} />
                </s>
                <span className="pdp-discount">{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="pdp-tax-note">
            {savings
              ? `Compared with ${savings.count} single packs bought separately`
              : 'Price for the selected option'}
          </p>
          <div className="pdp-intro-wrap">
            <p className="pdp-intro">
              {product.description ||
                'Find your new everyday favourite from SORAA.'}
            </p>
            {product.description && (
              <button
                type="button"
                className="pdp-read-more"
                onClick={showDescription}
              >
                Read more ↓
              </button>
            )}
          </div>
          {highlights.length > 0 && (
            <div className="pdp-highlights">
              {highlights.map((highlight, index) => (
                <div key={highlight}>
                  <Icon kind={index % 2 ? 'heart' : 'leaf'} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}
          {featuredReview && (
            <div
              className="pdp-review-slider"
              aria-label="Verified customer reviews"
              onMouseEnter={() => setReviewPaused(true)}
              onMouseLeave={() => setReviewPaused(false)}
              onFocusCapture={() => setReviewPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setReviewPaused(false);
                }
              }}
            >
              <a className="pdp-review-peek" href="#customer-reviews">
                <img
                  className="pdp-review-photo"
                  src={/an[ku]+sh/i.test(featuredReview.name) ? '/reviews/ankush.jpg' : '/hero-snack-better.jpg'}
                  style={/an[ku]+sh/i.test(featuredReview.name) ? {objectPosition: '50% 32%'} : undefined}
                  alt={/an[ku]+sh/i.test(featuredReview.name) ? featuredReview.name : 'SORAA snack moment'}
                  width="58"
                  height="58"
                />
                <span className="pdp-review-peek-copy">
                  <span>
                    <strong>{featuredReview.name}</strong>
                    <b aria-label="Verified buyer">
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="m10 1.5 2.1 1.4 2.6-.1.7 2.5 2.1 1.5-.9 2.4.9 2.4-2.1 1.5-.7 2.5-2.6-.1L10 18.5l-2.1-1.4-2.6.1-.7-2.5-2.1-1.5.9-2.4-.9-2.4 2.1-1.5.7-2.5 2.6.1Z" />
                        <path d="m6.8 10.1 2 2 4.4-4.5" />
                      </svg>
                      Verified
                    </b>
                    <i aria-label={`${featuredReview.rating} out of 5`}>
                      {'★'.repeat(featuredReview.rating)}
                    </i>
                  </span>
                  <small>{featuredReview.text}</small>
                </span>
              </a>
            </div>
          )}
          <ProductPurchase
            options={productOptions}
            variant={selectedVariant}
            productTitle={product.title}
          />
          <div className="pdp-assurances">
            <Link to="/pages/shipping-policy">
              <Icon kind="truck" />
              <span>
                Fast shipping<small>Free above ₹999</small>
              </span>
            </Link>
            <div>
              <Icon kind="shield" />
              <span>
                Quality checked<small>Carefully packed</small>
              </span>
            </div>
            <div>
              <Icon kind="heart" />
              <span>
                Good ingredients<small>Clear product details</small>
              </span>
            </div>
            <Link to="/pages/returns-refunds">
              <Icon kind="heart" />
              <span>
                Easy support<small>Returns &amp; refunds</small>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="pdp-details" ref={details}>
        <div
          className="pdp-tabs"
          role="tablist"
          aria-label="Product information"
        >
          {tabs.map((label, index) => (
            <button
              type="button"
              role="tab"
              key={label}
              id={`pdp-tab-${index}`}
              aria-controls={`pdp-panel-${index}`}
              aria-selected={tab === index}
              tabIndex={tab === index ? 0 : -1}
              onClick={() => setTab(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === 'ArrowRight')
                  next = (index + 1) % tabs.length;
                else if (event.key === 'ArrowLeft')
                  next = (index + tabs.length - 1) % tabs.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = tabs.length - 1;
                else return;
                event.preventDefault();
                setTab(next);
                document.getElementById(`pdp-tab-${next}`)?.focus();
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          className="pdp-panel"
          role="tabpanel"
          id={`pdp-panel-${tab}`}
          aria-labelledby={`pdp-tab-${tab}`}
          tabIndex={0}
        >
          {tab === 0 && (
            <div className="pdp-story">
              <div>
                <h2>
                  More than just
                  <br />
                  <span>a snack.</span>
                </h2>
                <div
                  className="pdp-description"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.descriptionHtml ||
                      '<p>A little goodness for your everyday moments.</p>',
                  }}
                />
              </div>
              {image && (
                <Image
                  className="pdp-story-image"
                  style={{aspectRatio: '4 / 3'}}
                  data={image}
                  alt={image.altText || product.title}
                  sizes="(min-width: 900px) 35vw, 90vw"
                  loading="lazy"
                />
              )}
              {nutritionPanel}
            </div>
          )}
          {tab === 1 && (
            <div className="pdp-text-panel">
              <h2>What goes into your snack</h2>
              <p>
                {ingredients ||
                  'The ingredient list is not available online yet. Please check the product label for ingredients and allergen information.'}
              </p>
            </div>
          )}
          {tab === 2 && nutritionPanel}
          {tab === 3 && (
            <div className="pdp-text-panel">
              <h2>From the SORAA community</h2>
              <p>
                {reviews.length
                  ? `${reviews.length} customer reviews available below.`
                  : 'There are no published reviews for this product yet.'}
              </p>
              <a href="#customer-reviews">View customer reviews ↓</a>
            </div>
          )}
        </div>
      </section>
      <section
        className="pdp-reviews"
        id="customer-reviews"
        aria-labelledby="pdp-reviews-heading"
      >
        <div className="pdp-review-summary">
          <p>THE SORAA COMMUNITY</p>
          <h2 id="pdp-reviews-heading">
            What are snackers
            <br />
            saying?
          </h2>
          {rating !== null ? (
            <div className="pdp-review-total">
              <strong className="pdp-review-score">{rating.toFixed(1)}</strong>
              <span
                className="pdp-stars"
                aria-label={`${rating.toFixed(1)} out of 5`}
              >
                {'★'.repeat(Math.round(rating))}
                {'☆'.repeat(5 - Math.round(rating))}
              </span>
              <p>{reviews.length} reviews</p>
              <span className="pdp-verified-total">
                <span aria-hidden="true">✓</span> Verified
              </span>
            </div>
          ) : (
            <p className="pdp-muted">No reviews yet</p>
          )}
        </div>
        <div className="pdp-review-cards">
          {reviews.length ? (
            reviews.slice(0, reviewLimit).map((review, index) => {
              const reviewImage =
                product.images.nodes[index % product.images.nodes.length] ||
                selectedVariant?.image;
              return (
                <article key={`${review.name}-${review.text}`}>
                  {reviewImage && (
                    <Image
                      className="pdp-review-card-image"
                      data={reviewImage}
                      alt={`${product.title} snack moment`}
                      sizes="(min-width: 900px) 22vw, 75vw"
                      loading="lazy"
                    />
                  )}
                  <div className="pdp-review-copy">
                    <p
                      className="pdp-stars"
                      aria-label={`${review.rating} out of 5`}
                    >
                      {'★'.repeat(Math.round(review.rating))}
                      {'☆'.repeat(5 - Math.round(review.rating))}
                    </p>
                    <h3>{product.title}</h3>
                    <p>“{review.text}”</p>
                  </div>
                  <div className="pdp-review-author">
                    <strong>{review.name}</strong>
                    {review.verified === true && (
                      <small>
                        <span aria-hidden="true">✓</span> Verified Buyer
                      </small>
                    )}
                  </div>
                  {typeof review.date === 'string' && (
                    <time>{review.date}</time>
                  )}
                </article>
              );
            })
          ) : (
            <div className="pdp-review-empty">
              <Icon kind="heart" />
              <h3>Your next favourite snack?</h3>
              <p>Customer stories will appear here once published.</p>
            </div>
          )}
        </div>
        {reviews.length > reviewLimit && (
          <button
            className="pdp-review-load"
            type="button"
            onClick={() => setReviewLimit((limit) => limit + 4)}
          >
            Load more reviews
          </button>
        )}
      </section>
      <ProductWorld />
      <ProductFaq product={product} />
      <section className="pdp-related collection-showcase pdp-recommendation-cards" aria-label="Recommended products">
        <div className="pdp-related-heading">
          <div>
            <button
              type="button"
              aria-label="Previous recommended products"
              onClick={() =>
                related.current?.scrollBy({left: -350, behavior: 'smooth'})
              }
            >
              <ButtonIcon name="left" />
            </button>
            <button
              type="button"
              aria-label="Next recommended products"
              onClick={() =>
                related.current?.scrollBy({left: 350, behavior: 'smooth'})
              }
            >
              <ButtonIcon name="right" />
            </button>
          </div>
        </div>
        <Suspense fallback={<p>Finding your next favourite…</p>}>
          <Await resolve={recommendations}>
            {(response) => {
              const products = (
                response?.productRecommendations?.length
                  ? response.productRecommendations
                  : response?.products.nodes || []
              )
                .filter((item) => item.id !== product.id)
                .slice(0, 5);
              return products.length ? (
                <div className="pdp-related-track" ref={related}>
                  {products.map((item) => (
                    <RelatedProductCard key={item.id} product={item} />
                  ))}
                </div>
              ) : (
                <Link to="/collections/all">Explore all snacks</Link>
              );
            }}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}
