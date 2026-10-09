import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {CategorySlider} from '~/components/CategorySlider';
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
        <CategorySlider>
            <Link
              to="/collections/flavored-nuts"
              className="category-card category-card--swap"
              prefetch="intent"
            >
                <span className="category-swap-media">
                  <img className="category-swap-default" src="/categories/hover/flavoured-nuts-packs.jpg" alt="Cheese & Jalapeno Cashews and Smoked BBQ Almonds" width="1000" height="1000" loading="lazy" />
                  <img className="category-swap-hover" src="/categories/hover/flavoured-nuts-bowl.jpg" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
                </span>
              <h3><span>Flavoured</span><span>Nuts &amp; Mixes</span></h3>
            </Link>
            <Link
              to="/collections/seed-mixes"
              className="category-card category-card--swap category-card--seeds"
              prefetch="intent"
            >
              <span className="category-swap-media">
                <img className="category-swap-default" src="/categories/hover/seeds-pack.jpg" alt="SORAA 5-in-1 Roasted Super Seed Mix" width="1000" height="1000" loading="lazy" />
                <img className="category-swap-hover" src="/categories/hover/seeds-bowl.jpg" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
              </span>
              <h3><span>Seeds &amp;</span><span>Superfoods</span></h3>
            </Link>
            <Link to="/collections/dry-fruits" className="category-card category-card--swap category-card--nuts" prefetch="intent">
              <span className="category-swap-media">
                <img className="category-swap-default" src="/categories/hover/nuts-pack.jpg" alt="Himalayan Pink Salted Pistachios" width="1000" height="1000" loading="lazy" />
                <img className="category-swap-hover" src="/categories/hover/nuts-bowl.jpg" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
              </span>
              <h3><span>Nuts &amp;</span><span>Raisins</span></h3>
            </Link>
            <Link to="/collections/spice-blends" className="category-card category-card--swap category-card--spices" prefetch="intent">
              <span className="category-swap-media">
                <img className="category-swap-default" src="/categories/hover/spices-pack.jpg" alt="Royal Awadhi Biryani Masala" width="1000" height="1000" loading="lazy" />
                <img className="category-swap-hover" src="/categories/hover/spices-bowl.jpg" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
              </span>
              <h3><span>Spices &amp;</span><span>Masalas</span></h3>
            </Link>
            <Link to="/collections/combos-gift-boxes" className="category-card category-card--swap category-card--gifts" prefetch="intent">
              <span className="category-swap-media">
                <img className="category-swap-default" src="/categories/hover/gifts-pack.jpg" alt="SORAA Gift of Love gift box" width="1000" height="1000" loading="lazy" />
                <img className="category-swap-hover" src="/categories/hover/gifts-hover.png" alt="" aria-hidden="true" width="1000" height="708" loading="lazy" />
              </span>
              <h3><span>Bundles &amp;</span><span>Giftpacks</span></h3>
            </Link>
            <Link to="/collections/dry-fruits" className="category-card category-card--swap category-card--dry-fruits" prefetch="intent">
              <span className="category-swap-media">
                <img className="category-swap-default" src="/categories/hover/dry-fruits-pack.jpg" alt="Premium Walnut Kernels" width="1000" height="1000" loading="lazy" />
                <img className="category-swap-hover" src="/categories/hover/dry-fruits-bowl.jpg" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
              </span>
              <h3><span>Dry</span><span>Fruits</span></h3>
            </Link>
        </CategorySlider>
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
          src="/home-final-snacking.jpg"
          width={2400}
          height={1067}
          loading="lazy"
          alt="Three friends enjoying SORAA Berry Blast Mix, Cheese and Jalapeno Cashews, and Date Bites beneath a blue sky"
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
