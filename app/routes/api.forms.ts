import {data} from 'react-router';
import type {Route} from './+types/api.forms';

/**
 * Receives the Contact, Bulk Order and Newsletter forms and emails them to the
 * SORAA team through Zoho ZeptoMail.
 *
 * Oxygen environment variables (Shopify admin → Hydrogen → Environments):
 *   ZEPTOMAIL_TOKEN     Send Mail token from ZeptoMail (without "Zoho-enczapikey")
 *   ZEPTOMAIL_FROM      Verified sender address, e.g. noreply@eatsoraa.com
 *   FORMS_NOTIFY_EMAIL  Where contact + newsletter submissions go, e.g. we@eatsoraa.com
 *   BULK_NOTIFY_EMAIL   Optional. Where bulk order enquiries go (default below)
 *   ZEPTOMAIL_API_URL   Optional. Defaults to the endpoint shown in our ZeptoMail account;
 *                       use https://api.zeptomail.com/v1.1/email for the US DC.
 */
const DEFAULT_BULK_EMAIL = 'we@eatsoraa.com';
const DEFAULT_API_URL = 'https://cpaas.zoho.in/v1.1/email';
const KINDS = {
  contact: 'Contact form',
  bulk: 'Bulk order enquiry',
  newsletter: 'Newsletter signup',
} as const;
type Kind = keyof typeof KINDS;

type FormsEnv = Env & {
  ZEPTOMAIL_TOKEN?: string;
  ZEPTOMAIL_FROM?: string;
  FORMS_NOTIFY_EMAIL?: string;
  BULK_NOTIFY_EMAIL?: string;
  ZEPTOMAIL_API_URL?: string;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]!);

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data({ok: false, message: 'Method not allowed.'}, {status: 405});
  }
  const form = await request.formData();
  const text = (key: string, max = 1000) => String(form.get(key) ?? '').trim().slice(0, max);

  // Honeypot: real people never fill this hidden field.
  if (text('website_check')) return data({ok: true, message: 'Thanks!'});

  const kind = text('kind', 20) as Kind;
  const email = text('contact[email]', 254);
  const name = text('contact[name]', 120);
  if (!(kind in KINDS) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return data({ok: false, message: 'Please enter a valid email address.'}, {status: 400});
  }
  if (kind !== 'newsletter' && !name) {
    return data({ok: false, message: 'Please enter your name.'}, {status: 400});
  }

  // Every "contact[Field label]" input becomes a row in the email.
  const rows: [string, string][] = [];
  for (const [key, value] of form.entries()) {
    const match = /^contact\[(.+)\]$/.exec(key);
    if (!match || typeof value !== 'string' || !value.trim()) continue;
    const label = match[1] === 'body' ? 'Message' : match[1].charAt(0).toUpperCase() + match[1].slice(1);
    rows.push([label.slice(0, 60), value.trim().slice(0, 2000)]);
  }

  const env = context.env as FormsEnv;
  if (!env.ZEPTOMAIL_TOKEN || !env.ZEPTOMAIL_FROM || !env.FORMS_NOTIFY_EMAIL) {
    console.error('Forms: ZeptoMail environment variables are missing');
    return data({ok: false, message: 'We could not send your message right now. Please email we@eatsoraa.com.'}, {status: 503});
  }

  const notifyEmail = kind === 'bulk' ? env.BULK_NOTIFY_EMAIL || DEFAULT_BULK_EMAIL : env.FORMS_NOTIFY_EMAIL;
  const subject = `${KINDS[kind]}${name ? ` — ${name}` : ''}`;
  const htmlbody = `<h2 style="font-family:sans-serif">${escapeHtml(KINDS[kind])}</h2>
<table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${rows.map(([label, value]) => `<tr><td style="border:1px solid #eee;font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td style="border:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('\n')}
</table>
<p style="font-family:sans-serif;color:#888;font-size:12px">Sent from ${escapeHtml(new URL(request.url).host)} on ${new Date().toISOString()}</p>`;

  try {
    const response = await fetch(env.ZEPTOMAIL_API_URL || DEFAULT_API_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Zoho-enczapikey ${env.ZEPTOMAIL_TOKEN.replace(/^Zoho-enczapikey\s+/i, '')}`,
      },
      body: JSON.stringify({
        from: {address: env.ZEPTOMAIL_FROM, name: 'SORAA Website'},
        to: [{email_address: {address: notifyEmail, name: 'SORAA Team'}}],
        reply_to: [{address: email, ...(name ? {name} : {})}],
        subject,
        htmlbody,
      }),
    });
    if (!response.ok) {
      console.error('Forms: ZeptoMail rejected the email', response.status, await response.text());
      throw new Error('ZeptoMail error');
    }
    return data({
      ok: true,
      message:
        kind === 'newsletter'
          ? 'Thanks for subscribing to SORAA!'
          : kind === 'bulk'
            ? 'Thanks! Our team will get back to you with a custom quote soon.'
            : 'Thanks for reaching out! We’ll get back to you soon.',
    });
  } catch {
    return data({ok: false, message: 'We could not send your message. Please try again or email we@eatsoraa.com.'}, {status: 502});
  }
}
