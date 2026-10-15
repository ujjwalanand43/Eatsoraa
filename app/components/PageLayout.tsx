import {Await, Link, useFetcher, useFetchers, useLocation, useSearchParams} from 'react-router';
import {Suspense, useEffect, useId, useRef} from 'react';
import {CartForm} from '@shopify/hydrogen';
import type {loader as cartLoader} from '~/routes/cart';
import {HomeProductCard} from './HomeProductCard';
import {WhatsAppButton} from './WhatsAppButton';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartRouteTrigger />
      <HomeCartAddTrigger />
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <WhatsAppButton />
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return (
              <div className="cart-drawer-shell">
                <CartDrawerRecommendations />
                <div className="cart-drawer-body">
                  <CartMain
                    cart={cart}
                    layout="aside"
                    recommendations={<CartDrawerRecommendations inline />}
                  />
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartDrawerRecommendations({inline = false}: {inline?: boolean}) {
  const {close} = useAside();
  const {type} = useAside();
  const fetcher = useFetcher<typeof cartLoader>();
  useEffect(() => {
    // Wide screens show recommendations in a side column; phones show them as
    // a strip inside the cart. Only the variant that is visible fetches.
    const phone = window.matchMedia('(max-width: 720px)').matches;
    if (phone !== inline) return;
    if (type === 'cart' && !fetcher.data && fetcher.state === 'idle') {
      void fetcher.load('/cart');
    }
  }, [type, fetcher, inline]);
  const cards = (
    <Suspense fallback={<p>Finding your next snack…</p>}>
      <Await resolve={fetcher.data?.recommendations}>
        {(result) => result?.products.nodes.length ? result.products.nodes.slice(0, 6).map((product) => (
          <HomeProductCard key={product.id} product={product} />
        )) : <Link to="/collections/all" onClick={close}>Explore all snacks</Link>}
      </Await>
    </Suspense>
  );
  return (
    <div
      className={`cart-drawer-recommendations${inline ? ' cart-drawer-recommendations--inline' : ''}`}
      aria-label="You may also like"
    >
      <h4>You may also like</h4>
      {inline ? <div className="cart-drawer-recommendations-track">{cards}</div> : cards}
    </div>
  );
}

// Opens the cart drawer when a product is added from the home or product pages.
function HomeCartAddTrigger() {
  const {pathname} = useLocation();
  const fetchers = useFetchers();
  const {open} = useAside();
  const pending = useRef(new Set<string>());

  useEffect(() => {
    if (pathname !== '/' && !pathname.startsWith('/products/')) {
      pending.current.clear();
      return;
    }
    const submittingKeys = new Set(fetchers.filter(fetcher => fetcher.state === 'submitting').map(fetcher => fetcher.key));
    for (const key of pending.current) {
      if (!submittingKeys.has(key)) pending.current.delete(key);
    }
    for (const fetcher of fetchers) {
      if (fetcher.state === 'submitting' && fetcher.formData) {
        const raw = fetcher.formData.get(CartForm.INPUT_NAME);
        if (typeof raw === 'string') {
          try {
            const payload = JSON.parse(raw) as {action?: string} | null;
            if (payload?.action === CartForm.ACTIONS.LinesAdd && !pending.current.has(fetcher.key)) {
              pending.current.add(fetcher.key);
              open('cart');
            }
          } catch { /* Ignore unrelated forms. */ }
        }
      }
    }
  }, [fetchers, pathname, open]);
  return null;
}

function CartRouteTrigger() {
  const {open} = useAside();
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get('cart') !== 'open') return;
    open('cart');
    const next = new URLSearchParams(params);
    next.delete('cart');
    setParams(next, {replace: true, preventScrollReset: true});
  }, [open, params, setParams]);
  return null;
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
