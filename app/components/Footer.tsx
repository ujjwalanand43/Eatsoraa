import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer soraa-footer">
            <div className="footer-top">
              <div className="footer-signup">
                <p>GOOD SNACKS. BETTER DAYS.</p>
                <h2>Get 15% off your first order.</h2>
                <p>
                  Join our community for new launches, snack inspiration and
                  members-only offers.
                </p>
                <form
                  action={`https://${publicStoreDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/contact#contact_form`}
                  method="post"
                >
                  <input type="hidden" name="form_type" value="customer" />
                  <input type="hidden" name="utf8" value="✓" />
                  <input
                    type="hidden"
                    name="contact[tags]"
                    value="newsletter"
                  />
                  <label
                    className="hero-accessible-copy"
                    htmlFor="footer-email"
                  >
                    Email address
                  </label>
                  <div>
                    <input
                      id="footer-email"
                      name="contact[email]"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Your email address"
                    />
                    <button type="submit">Subscribe →</button>
                  </div>
                </form>
                <a
                  className="footer-social"
                  href="https://www.instagram.com/eatsoraa/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram ↗
                </a>
              </div>
              <div className="footer-links-grid">
                <div className="footer-shop">
                  <h3>Shop</h3>
                  {footer?.menu && header.shop.primaryDomain?.url && (
                    <FooterMenu
                      menu={footer.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  )}
                </div>
                <nav className="footer-help" aria-label="Customer care">
                  <h3>Help</h3>
                  <NavLink to="/account">My account</NavLink>
                  <NavLink to="/account/orders">Track your orders</NavLink>
                  <NavLink to="/policies/shipping-policy">
                    Shipping &amp; delivery
                  </NavLink>
                  <NavLink to="/policies/refund-policy">
                    Returns &amp; refunds
                  </NavLink>
                </nav>
                <nav className="footer-help" aria-label="Company">
                  <h3>Company</h3>
                  <NavLink to="/pages/about">Our story</NavLink>
                  <NavLink to="/blogs/news">The SORAA journal</NavLink>
                  <NavLink to="/wishlist">Wishlist</NavLink>
                  <NavLink to="/collections/all">All products</NavLink>
                </nav>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} SORAA. All rights reserved.</p>
              <nav aria-label="Legal">
                <NavLink to="/policies/privacy-policy">Privacy policy</NavLink>
                <NavLink to="/policies/terms-of-service">
                  Terms of service
                </NavLink>
              </nav>
              <a href="#top">Back to top ↑</a>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'inherit',
  };
}
