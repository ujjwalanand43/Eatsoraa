import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {SnackSquad} from '~/components/SnackSquad';
import {BrandTicker} from '~/components/BrandTicker';
import {CollectionShowcase} from '~/components/CollectionShowcase';
import {HomeMotion} from '~/components/HomeMotion';
import {BetterForYouShowcase} from '~/components/BetterForYouShowcase';
import {HomeDiscovery} from '~/components/HomeDiscovery';
import {BLOGS_QUERY} from './blogs.$blogHandle._index';

import type {Route} from './+types/_index';

/* =========================================================
   META
========================================================= */

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: 'SORAA — Good Snacks, Better Days',
    },
    {
      name: 'description',
      content:
        'Premium nuts, dry fruits, seeds, trail mixes and healthy snacks for a healthier, happier you.',
    },
  ];
};

/* =========================================================
   LOADER
========================================================= */

export async function loader({context}: Route.LoaderArgs) {
  const products = context.storefront
    .query(HOME_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const collections = context.storefront
    .query(HOME_COLLECTIONS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    products,
    collections,
    journal: context.storefront
      .query(BLOGS_QUERY, {variables: {blogHandle: 'news', first: 6}})
      .catch(() => null),
  };
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default function Homepage() {
  const {products, collections, journal} = useLoaderData<typeof loader>();

  return (
    <div className="soraa-home">
      <HomeMotion />

      {/* Wide artwork includes lettering with space for a real CTA.
          Keep an accessible heading alongside the image.
          Mobile uses live copy and the separate product collage. */}
      <section className="hero-section" aria-label="Good snacks, better days">
        <div className="hero-desktop">
          <img
            className="hero-reference"
            src="/hero-wide.png"
            alt="SORAA walnut kernels, roasted super seed mix, dried cranberries, date bites and pistachios. Same snack, different energy. Fuel your fun."
            width={1881}
            height={836}
            fetchPriority="high"
          />
          <div className="hero-accessible-copy">
            <h1>Snack good. Feel good.</h1>
            <p>Real ingredients. Real good vibes.</p>
            <p>
              Premium dry fruits, nuts, seeds, trail mixes, dates, healthy
              snacks and spice blends — made for your everyday adventures.
            </p>
          </div>
          <Link
            to="/collections/all"
            className="hero-artwork-cta"
            aria-label="Shop now — explore all SORAA snacks"
            prefetch="intent"
          >
            SHOP NOW <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="hero-content hero-mobile">
          {/* HERO COPY */}

          <div className="hero-copy">
            <h1>
              SNACK
              <br />
              GOOD
              <br />
              FEEL
              <br />
              GOOD
            </h1>

            <div className="hero-script">
              Real ingredients.
              <br />
              Real good vibes.
            </div>

            <p>
              Premium dry fruits, nuts, seeds, trail mixes, dates, healthy
              snacks and spice blends — made for your everyday adventures.
            </p>

            <Link to="/collections/all" className="orange-button">
              SHOP NOW →
            </Link>
          </div>

          {/* HERO PRODUCT COLLAGE (static image) */}

          <div className="hero-products">
            <img
              src="/hero.png"
              alt="SORAA snacks — walnut kernels, 5-in-1 roasted super seed mix, dried whole cranberries, premium pistachios and date bites"
              width={1536}
              height={1024}
              loading="lazy"
            />
          </div>

          {/* HERO SIDE MESSAGE */}

          <div className="hero-side-message">
            Healthy
            <br />
            Looks Good
            <br />
            On You ♡
          </div>
        </div>
      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="category-section" aria-labelledby="category-heading">
        <div className="category-heading-row">
          <svg
            className="category-rays"
            viewBox="0 0 90 70"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M19 51 10 39M32 39 26 13M45 34 47 5"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="m60 39 15-22"
              stroke="#FE5100"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <h2 id="category-heading">
            SHOP BY <span>CATEGORY</span>
          </h2>
          <p className="category-note" aria-hidden="true">
            Healthy looks
            <br />
            good on you ♡
          </p>
        </div>
        <div className="category-grid">
          {[
            {title: 'Dry Fruits', handle: 'dry-fruits'},
            {title: 'Seeds & Superfoods', handle: 'seed-mixes'},
            {title: 'Trail Mixes', handle: 'trail-mixes'},
            {title: 'Flavoured Nuts & Mixes', handle: 'flavored-nuts'},
            {title: 'Spices & Masalas', handle: 'spice-blends'},
            {title: 'Bundles & Giftpacks', handle: 'combos-gift-boxes'},
            {title: 'Best Sellers', handle: 'best-sellers'},
          ].map((category, index) => (
            <Link
              key={category.handle}
              to={`/collections/${category.handle}`}
              className="category-card"
              prefetch="intent"
            >
              <span
                className="category-image"
                style={{backgroundPosition: `${(index * 100) / 6}% 50%`}}
                aria-hidden="true"
              />
              <h3>{category.title}</h3>
              <span className="category-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          SOCIAL PROOF
      ===================================================== */}

      <section className="social-section" aria-labelledby="snack-squad-heading">
        <div className="social-header">
          <h2 id="snack-squad-heading">
            REAL PEOPLE.
            <br />
            <span>REAL SNACKING.</span>
          </h2>
          <svg
            className="social-crown"
            viewBox="0 0 90 75"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m15 60-7-40 24 15L44 7l12 28 25-18-10 43c-20-7-37-7-56 0Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
          <div className="social-squad">
            Snack
            <br />
            Squad ♡
          </div>
        </div>
        <Suspense
          fallback={
            <p className="social-loading">Loading snack inspiration…</p>
          }
        >
          <Await resolve={products}>
            {(response) => (
              <SnackSquad products={response?.products.nodes ?? []} />
            )}
          </Await>
        </Suspense>
        <div className="social-footer">
          <Link className="orange-button" to="/collections/all">
            EXPLORE ALL PRODUCTS <span aria-hidden="true">→</span>
          </Link>
          <p>Customer review videos coming soon</p>
        </div>
      </section>

      <BrandTicker />

      <Suspense
        fallback={<p className="collections-loading">Loading collections…</p>}
      >
        <Await resolve={collections}>
          {(response) => {
            const collectionNodes = response?.collections.nodes ?? [];
            return (
              <>
                <BetterForYouShowcase collections={collectionNodes} />
                <CollectionShowcase collections={collectionNodes} />
              </>
            );
          }}
        </Await>
      </Suspense>

      {/* =====================================================
          LIFESTYLE
      ===================================================== */}

      <section
        className="lifestyle-section"
        aria-labelledby="lifestyle-heading"
      >
        <div className="lifestyle-copy">
          <p className="lifestyle-eyebrow">GOOD SNACKS. EVERYWHERE.</p>
          <h2 id="lifestyle-heading">
            More than a snack.
            <br />
            <span>It’s a lifestyle.</span>
          </h2>
          <p className="lifestyle-intro">
            A little goodness, wherever your day takes you.
          </p>
        </div>

        <div className="lifestyle-cards">
          {['Work', 'Gym', 'Travel', 'Chill'].map((label, index) => (
            <Link
              to="/collections/trail-mixes"
              className="lifestyle-card"
              key={label}
            >
              <div
                className="lifestyle-photo"
                style={{backgroundPosition: `${(index * 100) / 3}% center`}}
                role="img"
                aria-label={`Healthy snacks for ${label.toLowerCase()} time`}
              />
              <span>{label} ♡</span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHY SORAA
      ===================================================== */}

      <Suspense
        fallback={<p className="social-loading">Loading the SORAA journal…</p>}
      >
        <Await resolve={journal}>
          {(data) => (
            <HomeDiscovery articles={data?.blog?.articles.nodes ?? []} />
          )}
        </Await>
      </Suspense>

      <section className="why-sky-section" aria-labelledby="why-soraa-heading">
        <div className="why-sky-copy">
          <h2 id="why-soraa-heading">Why SORAA?</h2>
          <p>
            Good snacking starts with ingredients you love. Discover our nuts,
            dried fruits, seeds and flavour-packed mixes—made for work breaks,
            big adventures and all the little moments in between.
          </p>
          <Link className="why-sky-button" to="/collections/all">
            Find Your Favourite <span aria-hidden="true">→</span>
          </Link>
        </div>
        <img
          className="why-sky-art"
          src="/why-soraa-orange.png"
          width={1774}
          height={887}
          loading="lazy"
          alt="SORAA date bites, walnut kernels, roasted super seed mix, dried cranberries and pistachios against bold orange clouds"
        />
      </section>
    </div>
  );
}

/* =========================================================
   SHOPIFY PRODUCTS QUERY
========================================================= */

const HOME_PRODUCTS_QUERY = `#graphql

  query HomeProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {

    products(
      first: 8
      sortKey: BEST_SELLING
    ) {

      nodes {

        id

        title

        handle

        selectedOrFirstAvailableVariant {
          id
          availableForSale
          title
          selectedOptions { name value }
          image { id url altText width height }
          product { id handle title }
          price { amount currencyCode }
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }

        featuredImage {
          id
          url
          altText
          width
          height
        }

      }

    }

  }

` as const;

/* =========================================================
   SHOPIFY COLLECTIONS QUERY
========================================================= */

const HOME_COLLECTIONS_QUERY = `#graphql

  query HomeCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {

    collections(
      first: 7
      sortKey: TITLE
    ) {

      nodes {

        id

        title

        handle

        products(first: 10) {
          nodes {
            id
            title
            handle
            selectedOrFirstAvailableVariant {
              id
              availableForSale
              title
              selectedOptions { name value }
              image { id url altText width height }
              product { id handle title }
              price { amount currencyCode }
            }
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { id url altText width height }
          }
        }

        image {
          id
          url
          altText
          width
          height
        }

      }

    }

  }

` as const;
