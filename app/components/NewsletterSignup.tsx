import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

export function NewsletterSignup({id = 'footer-email'}: {id?: string}) {
  const fetcher = useFetcher<{ok: boolean; message: string}>({key: `newsletter-${id}`});
  const formRef = useRef<HTMLFormElement>(null);
  const sending = fetcher.state !== 'idle';
  useEffect(() => {
    if (fetcher.data?.ok) formRef.current?.reset();
  }, [fetcher.data]);
  return <fetcher.Form ref={formRef} method="post" action="/api/forms">
    <input type="hidden" name="kind" value="newsletter"/>
    <div className="inquiry-honey" aria-hidden="true"><input name="website_check" tabIndex={-1} autoComplete="off"/></div>
    <label className="hero-accessible-copy" htmlFor={id}>Email address</label>
    <div className="newsletter-input-row"><input id={id} name="contact[email]" type="email" required autoComplete="email" placeholder="Your email address"/><button type="submit" disabled={sending}>{sending ? 'Subscribing…' : 'Subscribe'}</button></div>
    <p className="newsletter-consent" role="status">{fetcher.data ? fetcher.data.message : 'Subscribe to SORAA emails. Unsubscribe anytime.'}</p>
  </fetcher.Form>;
}
