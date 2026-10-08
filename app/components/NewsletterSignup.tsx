import {useState} from 'react';
export function NewsletterSignup({id = 'footer-email'}: {id?: string}) {
  const [sending, setSending] = useState(false);
  return <form action="https://eatsoraa.com/contact#contact_form" method="post" acceptCharset="UTF-8" onSubmit={() => setSending(true)}>
    <input type="hidden" name="form_type" value="customer"/>
    <input type="hidden" name="utf8" value="✓"/>
    <input type="hidden" name="contact[tags]" value="newsletter"/>
    <label className="hero-accessible-copy" htmlFor={id}>Email address</label>
    <div className="newsletter-input-row"><input id={id} name="contact[email]" type="email" required autoComplete="email" placeholder="Your email address"/><button type="submit">{sending ? 'Opening Shopify…' : 'Subscribe →'}</button></div>
    <p className="newsletter-consent">Subscribe to SORAA emails. Unsubscribe anytime. Shopify may ask you to verify before completing signup.</p>
  </form>;
}
