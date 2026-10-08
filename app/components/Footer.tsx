import {Suspense} from 'react';
import {BrandLogo} from './BrandLogo';
import {FooterSocials} from './FooterSocials';
import {NewsletterSignup} from './NewsletterSignup';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => (
          <footer className="footer soraa-footer">
            <div className="footer-top">
              <div className="footer-signup">
                <NavLink to="/" className="footer-logo-link">
                  <BrandLogo />
                </NavLink>
                <p>GOOD SNACKS. BETTER DAYS.</p>
                <h2>Get 15% off your first order.</h2>
                <p>
                  Join our community for new launches, snack inspiration and
                  members-only offers.
                </p>
                <NewsletterSignup />
                <FooterSocials />
              </div>
              <div className="footer-links-grid">
                <nav className="footer-help footer-shop" aria-label="Shop">
                  <h3>Shop</h3>
                  <NavLink to="/collections/flavored-nuts">
                    Flavoured Nuts
                  </NavLink>
                  <NavLink to="/collections/roasted-nuts">Roasted Nuts</NavLink>
                  <NavLink to="/collections/trail-mixes">Trail Mixes</NavLink>
                  <NavLink to="/collections/seed-mixes">Seed Mixes</NavLink>
                  <NavLink to="/collections/dry-fruits">Dry Fruits</NavLink>
                  <NavLink to="/collections/dates-date-bites">
                    Dates &amp; Date Bites
                  </NavLink>
                  <NavLink to="/collections/breakfast-mixes">
                    Breakfast Mixes
                  </NavLink>
                  <NavLink to="/collections/gourmet-spices">
                    Gourmet spices
                  </NavLink>
                </nav>
                <nav className="footer-help" aria-label="Information">
                  <h3>Info</h3>
                  <NavLink to="/pages/about">About</NavLink>
                  <NavLink to="/pages/factory-locator">Factory locator</NavLink>
                  <NavLink to="/blogs/news">Blogs</NavLink>
                  <NavLink to="/pages/lab-reports">Lab Report</NavLink>
                  <NavLink to="/pages/investor-hub">Investor Hub</NavLink>
                </nav>
                <nav className="footer-help" aria-label="Legal">
                  <h3>Legal</h3>
                  <NavLink to="/pages/shipping-policy">Shipping Policy</NavLink>
                  <NavLink to="/pages/privacy-policy">Privacy Policy</NavLink>
                  <NavLink to="/pages/returns-refunds">
                    Returns &amp; Refunds
                  </NavLink>
                  <NavLink to="/pages/terms-conditions">
                    Terms &amp; Conditions
                  </NavLink>
                </nav>
                <nav className="footer-help" aria-label="Help">
                  <h3>Help</h3>
                  <NavLink to="/search">Search</NavLink>
                  <NavLink to="/pages/contact">Contact</NavLink>
                  <NavLink to="/pages/bulk-order">Bulk orders</NavLink>
                </nav>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} SORAA. All rights reserved.</p>
              <nav aria-label="Legal">
                <NavLink to="/pages/privacy-policy">Privacy policy</NavLink>
                <NavLink to="/pages/terms-conditions">Terms of service</NavLink>
              </nav>
              <a href="#top">Back to top ↑</a>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
