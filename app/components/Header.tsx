import {Suspense} from 'react';
import {BrandLogo} from './BrandLogo';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {AnnouncementBar} from './AnnouncementBar';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <>
      <AnnouncementBar />

      <header className="header">
        <NavLink prefetch="intent" to="/" className="header-logo" end>
          <BrandLogo />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className="header-menu-item"
          to="/"
        >
          Home
        </NavLink>
      )}

      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        let url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        if (/^bulk orders?$/i.test(item.title.trim())) url = '/pages/bulk-order';

        // show a chevron only for items that actually have a submenu,
        // instead of hardcoding it onto a fake "Shop" entry
        const hasChildren = item.items && item.items.length > 0;

        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
            {hasChildren && <ChevronDownIcon />}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const {open} = useAside();
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />

      <button
        className="header-icon-btn reset"
        aria-label="Search"
        onClick={() => open('search')}
      >
        <SearchIcon />
      </button>

      <NavLink
        prefetch="intent"
        to="/account"
        className="header-icon-btn"
        aria-label="Account"
      >
        <Suspense fallback={<AccountIcon />}>
          <Await resolve={isLoggedIn} errorElement={<AccountIcon />}>
            {() => <AccountIcon />}
          </Await>
        </Suspense>
      </NavLink>

      <NavLink
        prefetch="intent"
        to="/wishlist"
        className="header-icon-btn"
        aria-label="Wishlist"
      >
        <HeartIcon />
      </NavLink>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle header-icon-btn reset"
      onClick={() => open('mobile')}
      aria-label="Menu"
    >
      <MenuIcon />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open, type} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={type === 'cart'}
      className="header-icon-btn header-cart-btn"
      aria-label={`Cart, ${count} items`}
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <CartIcon />
      {count > 0 && <span className="header-cart-count">{count}</span>}
      {count === 0 && <span className="header-cart-count">0</span>}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/* ---------------------------------------------------------------------
 * Icons — plain inline SVGs, no extra dependency needed.
 * ------------------------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c0-3.7 3.6-6.5 8-6.5s8 2.8 8 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20.3s-7.4-4.4-9.9-9C.6 8 1.8 4.4 5.2 3.6c2-.5 4 .3 5.2 2 .3.4.9.4 1.2 0 1.2-1.7 3.2-2.5 5.2-2 3.4.8 4.6 4.4 3.1 7.7-2.5 4.6-9.9 9-9.9 9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 8h12l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 20L6 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="header-chevron"
    >
      <path
        d="M5 8.5L12 15.5L19 8.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500000',
      resourceId: null,
      tags: [],
      title: 'Shop',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500001',
      resourceId: null,
      tags: [],
      title: 'Trail Mixes',
      type: 'HTTP',
      url: '/collections/trail-mixes',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500006',
      resourceId: null,
      tags: [],
      title: 'Dry Fruits',
      type: 'HTTP',
      url: '/collections/dry-fruits',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500003',
      resourceId: null,
      tags: [],
      title: 'Dates',
      type: 'HTTP',
      url: '/collections/dates',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500007',
      resourceId: null,
      tags: [],
      title: 'Roasted Nuts',
      type: 'HTTP',
      url: '/collections/roasted-nuts',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500005',
      resourceId: null,
      tags: [],
      title: 'Spice Blends',
      type: 'HTTP',
      url: '/collections/spice-blends',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500008',
      resourceId: null,
      tags: [],
      title: 'Blogs',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
  ],
};
