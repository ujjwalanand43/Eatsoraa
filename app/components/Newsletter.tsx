import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

export function Newsletter() {
  const data = useRouteLoaderData<RootLoader>('root');
  const domain = data?.publicStoreDomain;
  const action = domain ? `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/contact#contact_form` : undefined;
  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div><h2 id="newsletter-heading">Join the SORAA Community</h2><p>Fresh launches, exclusive offers and a little everyday goodness.</p></div>
      <form className="newsletter-form" action={action} method="post">
        <input type="hidden" name="form_type" value="customer" />
        <input type="hidden" name="utf8" value="✓" />
        <input type="hidden" name="contact[tags]" value="newsletter" />
        <label className="hero-accessible-copy" htmlFor="newsletter-email">Email address</label>
        <div className="newsletter-input-row"><input id="newsletter-email" name="contact[email]" type="email" autoComplete="email" required placeholder="Enter your email" /><button type="submit" disabled={!action}>Subscribe →</button></div>
        <p className="newsletter-consent">By subscribing, you agree to receive SORAA emails. Unsubscribe anytime.</p>
      </form>
      <div className="newsletter-message" aria-hidden="true">Good Food.<br />Good People. ♡</div>
    </section>
  );
}
