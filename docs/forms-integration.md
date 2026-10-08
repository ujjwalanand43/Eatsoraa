# Contact, bulk orders and newsletter

## Current hosted integration

Contact uses native Shopify POST `https://eatsoraa.com/contact`, `form_type=contact`.
Newsletter uses the same endpoint with `form_type=customer` and the `newsletter`
tag, which is Shopify's native customer email-signup flow. Shopify owns verification
and confirmation. No local success is displayed before Shopify accepts a signup.

Bulk form 1168614 is available at `https://eatsoraa.com/pages/send-your-query`.
The local bulk page links to this form in a new tab. The published page sends
`X-Frame-Options: DENY` and `frame-ancestors 'none'`, so it cannot be embedded.
Custom bulk fields are not wired to the Shopify Forms app's private endpoints.
When deploying Hydrogen on eatsoraa.com, provision a separate theme/Online Store
hostname and update these hosted URLs to prevent sending requests to Hydrogen.
Delivery/marketing saving must be confirmed with a real merchant-approved test;
no real production enquiry/signup was submitted during development.

## Optional future custom receiver

Routes: `/pages/contact`, `/pages/bulk-order`, POST `/api/forms`.

Required server environment: `SORAA_FORM_WEBHOOK_URL` (HTTPS receiver).
Optional: `SORAA_FORM_WEBHOOK_TOKEN` (sent as a Bearer token).
The receiver must save enquiries, forward email, and persist newsletter consent
in Shopify. Return 2xx only after accepting the submission. Do not use a public
client-side Admin API token. All three forms share this endpoint.

Shopify Forms landing pages are theme-backed. A form ID alone does not supply a
documented Hydrogen submission API. Obtain the merchant's published form links
and supported integration/receiver before connecting these custom forms.

Without a receiver, submissions return an explicit 503 and display an email
fallback. No fake success message or silently discarded submissions.
