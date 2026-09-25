import {useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {HomeCollectionsQuery} from 'storefrontapi.generated';

type Collection = HomeCollectionsQuery['collections']['nodes'][number];

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
  const [activeHandle, setActiveHandle] = useState(available[0]?.handle);
  const active =
    available.find((collection) => collection.handle === activeHandle) ||
    available[0];
  const product = active?.products.nodes[0];
  const image = product?.featuredImage || active?.image;

  if (!active || !product) return null;

  return (
    <section className="better-showcase" aria-labelledby="better-heading">
      <div className="better-showcase-heading">
        <p>GOOD CHOICES. GREAT TASTE.</p>
        <h2 id="better-heading">
          Feel-good snacks, <span>made better.</span>
        </h2>
      </div>

      <div className="better-tabs" role="tablist" aria-label="Snack category">
        {available.slice(0, 5).map((collection) => {
          const selected = collection.handle === active.handle;
          return (
            <button
              key={collection.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveHandle(collection.handle)}
            >
              {selected && <span aria-hidden="true">✦</span>}
              {collection.title}
            </button>
          );
        })}
      </div>

      <div className="better-showcase-content">
        <div className="better-product-stage">
          <span className="better-spark better-spark-one" aria-hidden="true">
            ✦
          </span>
          <span className="better-spark better-spark-two" aria-hidden="true">
            ✦
          </span>
          <div className="better-burst">
            {image && (
              <Image
                data={image}
                alt={image.altText || product.title}
                sizes="(min-width: 900px) 42vw, 88vw"
              />
            )}
          </div>
          <p>{product.title}</p>
        </div>

        <div className="better-benefits">
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
            TRY NOW <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
