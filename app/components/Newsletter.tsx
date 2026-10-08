import {NewsletterSignup} from './NewsletterSignup';

export function Newsletter() {
  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div><h2 id="newsletter-heading">Join the SORAA Community</h2><p>Fresh launches, exclusive offers and a little everyday goodness.</p></div>
      <div className="newsletter-form">
        <NewsletterSignup id="newsletter-email" />
        <p className="newsletter-consent">By subscribing, you agree to receive SORAA emails. Unsubscribe anytime.</p>
      </div>
      <div className="newsletter-message" aria-hidden="true">Good Food.<br />Good People. ♡</div>
    </section>
  );
}
