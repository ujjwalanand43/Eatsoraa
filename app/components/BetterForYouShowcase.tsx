import {useMemo} from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {HomeCollectionsQuery} from 'storefrontapi.generated';

type Collection = HomeCollectionsQuery['collections']['nodes'][number];
const campaignArt: Record<string, {file: string; alt: string}> = {
  'best-sellers': {file: 'breakfast-mixes.png', alt: 'A woman pouring SORAA Morning Energy Breakfast Mix into a bowl'},
  'breakfast-mixes': {file: 'breakfast-mixes.png', alt: 'SORAA Morning Energy Breakfast Mix'},
  'dates-date-bites': {file: 'dates-date-bites.png', alt: 'SORAA Date Bites with nuts and dates'},
  'dry-fruits': {file: 'dry-fruits.png', alt: 'SORAA Premium Walnut Kernels'},
  'flavored-nuts': {file: 'flavored-nuts.png', alt: 'SORAA Peri-Peri Roasted Cashews'},
};

const benefits = [
  {
    icon: 'seed',
    title: 'Naturally nourishing',
    body: 'Real nuts, seeds and fruits in every satisfying bite.',
  },
  {
    icon: 'leaf',
    title: 'Nothing unnecessary',
    body: 'Straightforward ingredients with flavour you can trust.',
  },
  {
    icon: 'heart',
    title: 'Seriously delicious',
    body: 'Everyday snacking made brighter, crunchier and better.',
  },
] as const;

function BenefitIcon({kind}: {kind: (typeof benefits)[number]['icon']}) {
  if (kind === 'seed') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M13 35c9-2 17-10 20-22 5 12 1 23-8 27-5 2-10 0-12-5Z" />
        <path d="M16 34c5-6 10-10 17-14M25 28l-1-7M21 32l-7-1" />
      </svg>
    );
  }
  if (kind === 'leaf') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M39 9C23 10 12 17 11 29c-1 7 5 11 11 8 9-4 14-13 17-28Z" />
        <path d="M9 41c5-10 12-17 23-24" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 40 8 25C-1 15 13 5 24 16 35 5 49 15 40 25Z" />
      <path d="m31 9 2-5M38 13l5-2" />
    </svg>
  );
}

export function BetterForYouShowcase({
  collections,
}: {
  collections: Collection[];
}) {
  const available = useMemo(
    () => collections.filter((collection) => collection.products.nodes.length),
    [collections],
  );
  const active = available[0];
  const product = active?.products.nodes[0];
  const image = product?.featuredImage || active?.image;
  const artwork = active && campaignArt[active.handle];

  if (!active || !product) return null;

  return (
    <section className="better-showcase" aria-labelledby="better-heading">
      <div className="better-showcase-heading">
        <p>GOOD CHOICES. GREAT TASTE.</p>
        <h2 id="better-heading">
          Feel-good snacks,<br /><span>made better.</span>
        </h2>
      </div>

      <div className="better-showcase-content">
        <div className="better-product-stage">
          <span className="better-spark better-spark-one" aria-hidden="true">
            ✦
          </span>
          <span className="better-spark better-spark-two" aria-hidden="true">
            ✦
          </span>
          <div className={artwork ? 'better-campaign-art' : 'better-burst'}>
            {artwork ? <img key={artwork.file} src={`/feel-good/${artwork.file}`} alt={artwork.alt} loading="lazy" width="1122" height="1402" /> : image && (
              <Image
                data={image}
                alt={image.altText || product.title}
                sizes="(min-width: 900px) 42vw, 88vw"
              />
            )}
          </div>
          <p>{artwork ? active.title : product.title}</p>
        </div>

        <div className="better-benefits">
          <div className="better-benefits-intro">
            <p className="better-benefits-eyebrow">YOUR DAILY DOSE OF DELICIOUS</p>
            <h3>Little breaks.<br /><span>Big flavour.</span></h3>
            <p>From your first bite to your next adventure, find a favourite that fits your day.</p>
          </div>
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <span className="better-benefit-icon">
                <BenefitIcon kind={benefit.icon} />
              </span>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </div>
            </article>
          ))}
          <Link to={`/collections/${active.handle}`} prefetch="intent">
            Explore {active.title.toLowerCase()}
          </Link>
        </div>
      </div>
    </section>
  );
}
