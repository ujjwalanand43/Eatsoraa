import {data} from 'react-router';
import type {Route} from './+types/api.forms';

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') return data({ok: false, message: 'Method not allowed.'}, {status: 405});
  const form = await request.formData();
  const text = (key: string, max = 1000) => String(form.get(key) || '').trim().slice(0, max);
  if (text('website_check')) return data({ok: false, message: 'Please try again.'}, {status: 400});
  const kind = text('kind', 20);
  const email = text('email', 254);
  if (!['contact', 'bulk', 'newsletter'].includes(kind) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return data({ok: false, message: 'Please enter a valid email address.'}, {status: 400});
  }
  const name = text('name', 120) || `${text('firstName', 60)} ${text('lastName', 60)}`.trim();
  if (kind !== 'newsletter' && (!name || !text('message') || !text('topics'))) {
    return data({ok: false, message: 'Please fill in your name, query topic and message.'}, {status: 400});
  }
  const env = context.env as Env & {SORAA_FORM_WEBHOOK_URL?: string; SORAA_FORM_WEBHOOK_TOKEN?: string};
  // A merchant-controlled receiver can forward enquiries and marketing consent
  // to Shopify/Flow. Never expose its credentials to the browser.
  if (!env.SORAA_FORM_WEBHOOK_URL) {
    return data({ok: false, message: 'Online submissions are not available yet. Please contact we@eatsoraa.com.'}, {status: 503});
  }
  try {
    const url = new URL(env.SORAA_FORM_WEBHOOK_URL);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    const response = await fetch(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: {'Content-Type': 'application/json', ...(env.SORAA_FORM_WEBHOOK_TOKEN ? {Authorization: `Bearer ${env.SORAA_FORM_WEBHOOK_TOKEN}`} : {})},
      body: JSON.stringify({kind, email, name, phone: text('phone', 25) ? `${text('dialCode', 8)} ${text('phone', 25)}` : '', company: text('company', 160), topics: text('topics', 500), orderNumber: text('orderNumber', 80), city: text('city', 160), social: text('social', 250), message: text('message'), marketingConsent: kind === 'newsletter', submittedAt: new Date().toISOString()}),
    });
    if (!response.ok) throw new Error('Receiver rejected submission');
    return data({ok: true, message: kind === 'newsletter' ? 'Thanks for subscribing to SORAA!' : 'Query submitted! Thanks for reaching out.'});
  } catch {
    return data({ok: false, message: 'We could not send your request. Please try again or email we@eatsoraa.com.'}, {status: 502});
  }
}
