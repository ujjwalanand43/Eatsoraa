import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {OrderGlobe} from '~/components/OrderGlobe';
import {parseGlobeLocations} from '~/lib/orderGlobe';
import {SnackSquad} from '~/components/SnackSquad';
import {CollectionShowcase} from '~/components/CollectionShowcase';
import {HomeMotion} from '~/components/HomeMotion';
import {HeroSlider} from '~/components/HeroSlider';
import {BetterForYouShowcase} from '~/components/BetterForYouShowcase';
import {HomeDiscovery} from '~/components/HomeDiscovery';
import {HomeExplore} from '~/components/HomeExplore';
import {HomeReviews} from '~/components/HomeReviews';
import {HomeLifestyle} from '~/components/HomeLifestyle';
import {WelcomeOffer} from '~/components/WelcomeOffer';
import {LandingOverlays} from '~/components/LandingOverlays';
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
    globe: context.storefront.query(ORDER_GLOBE_QUERY).then((data) => parseGlobeLocations(data.shop.metafield?.value)).catch(() => []),
    journal: context.storefront
      .query(BLOGS_QUERY, {variables: {blogHandle: 'news', first: 6}})
      .catch(() => null),
  };
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default function Homepage() {
  const {products, collections, journal, globe} = useLoaderData<typeof loader>();

  return (
    <div className="soraa-home">
      <HomeMotion />

      <HeroSlider />
      <WelcomeOffer />

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="category-section" aria-labelledby="category-heading">
        <div className="category-heading-row">
          <h2 id="category-heading">
            SHOP BY <span>CATEGORY</span>
          </h2>
        </div>
        <div className="category-grid">
          {[
            {title: 'Nuts & Raisins', handle: 'dry-fruits'},
            {title: 'Seeds & Superfoods', handle: 'seed-mixes'},
            {title: 'Trail Mixes', handle: 'trail-mixes'},
            {title: 'Flavoured Nuts & Mixes', handle: 'flavored-nuts'},
            {title: 'Spices & Masalas', handle: 'spice-blends'},
            {title: 'Bundles & Giftpacks', handle: 'combos-gift-boxes'},
            {title: 'Dry Fruits', handle: 'dry-fruits', id: 'dried-fruit-bowl'},
          ].map((category, index) => (
            <Link
              key={category.id ?? category.handle}
              to={`/collections/${category.handle}`}
              className="category-card"
              prefetch="intent"
            >
              <img
                className="category-image"
                src={`/categories/category-${String(index + 1).padStart(2, '0')}.jpg`}
                alt={category.title}
                width="5001"
                height="5001"
                loading="lazy"
              />
              <h3>{category.title}</h3>
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
            {(response) => {
              const productNodes = response?.products.nodes ?? [];
              return (
                <>
                  <SnackSquad products={productNodes} />
                  <LandingOverlays products={productNodes} />
                </>
              );
            }}
          </Await>
        </Suspense>
        <div className="social-footer">
          <p>Customer review videos coming soon</p>
        </div>
      </section>


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



      <HomeExplore />
      <HomeLifestyle />
      <HomeReviews />
      <Suspense fallback={<OrderGlobe />}><Await resolve={globe}>{(locations) => <OrderGlobe locations={locations} />}</Await></Suspense>

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
            Find Your Favourite
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

const ORDER_GLOBE_QUERY = `#graphql
  query OrderGlobe {
    shop { metafield(namespace: "soraa", key: "order_locations") { value } }
  }
` as const;
