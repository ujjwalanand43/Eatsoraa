# GoKwik integration review for SORAA

Reviewed on 1 October 2026 against the current Hydrogen storefront.

## Decision

GoKwik is a good functional fit for an India-first D2C store such as SORAA, especially for phone-first checkout, returning-customer address prefill, UPI/COD choice, and RTO controls. It is not a drop-in payment gateway replacement in this repository. SORAA is a custom Shopify Hydrogen storefront, so GoKwik must provide its headless/custom-storefront SDK or API flow and merchant credentials. A Shopify theme app embed by itself cannot intercept the checkout buttons rendered by this React application.

Proceed with GoKwik onboarding, but do not replace the live Shopify checkout until the headless contract and the compatibility items below are confirmed in writing and passed in staging.

### Existing Eat Soraa merchant setup

The existing Shopify store has previously used GoKwik. Therefore this should be handled as a storefront migration under the same Shopify shop and GoKwik merchant account, rather than a brand-new payment onboarding. Preserve the installed app and production configuration. Ask the existing GoKwik account manager to enable the same merchant for the Hydrogen/Oxygen storefront and issue separate sandbox credentials. Existing merchant approval does not make theme-injected checkout code run automatically in Hydrogen; the custom storefront handoff is still required.

## What GoKwik would add

- Phone/OTP or supported one-tap authentication.
- Address prefill for shoppers recognised in GoKwik's network. This is not a guaranteed address lookup for every phone number.
- For a new address, PIN code can prefill city/state while the customer supplies the remaining details.
- UPI, cards, wallets, net banking, pay-later and COD presentation, subject to the merchant's enabled payment partners and GoKwik configuration.
- COD risk interventions and RTO controls.
- Checkout-level discounts and prepaid nudges.
- GoKwik dashboard visibility and refund tooling. Payment settlement/refund disbursement still involves the contracted payment aggregator/bank; GoKwik describes itself as the technology facilitator for this part.

Official references:

- [GoKwik for Shopify](https://www.gokwik.co/product/shopify)
- [GoKwik one-click checkout flow](https://www.gokwik.co/blog/what-is-one-click-checkout)
- [GoKwik address prefill](https://www.gokwik.co/blog/address-prefill)
- [GoKwik grievance, refund and reconciliation policy](https://www.gokwik.co/grievance-policy)
- [Shopify Hydrogen cart architecture](https://shopify.dev/docs/storefronts/headless/hydrogen/cart)

## Current SORAA checkout architecture

The repository uses Shopify Hydrogen `2026.4.5` and Storefront Cart API carts.

There are three checkout paths that must be covered:

1. Cart drawer/page: `app/components/CartSummary.tsx` links directly to Shopify's `cart.checkoutUrl`.
2. Product Buy Now: `app/components/ProductPurchase.tsx` adds the chosen variant to the Shopify cart and then redirects to `cart.checkoutUrl`.
3. Cart permalink: `app/routes/cart.$lines.tsx` creates a cart and redirects to its Shopify checkout URL.

The cart also supports:

- Shopify discount codes.
- Shopify gift cards.
- Product variants and quantities.
- Shopify selling plans for the Subscribe & Save UI.
- Shopify customer/cart sessions.

These behaviours cannot be assumed to survive a custom checkout handoff. Each must be explicitly mapped and tested.

## Compatibility status

| Area | Status | Review |
| --- | --- | --- |
| Shopify backend and order creation | Likely compatible | GoKwik publicly supports Shopify, but the final order must appear in the same Shopify store with correct inventory, tax, shipping, customer and attribution data. |
| Hydrogen storefront | Conditional | GoKwik says it supports custom-built sites, but public material does not expose the production SDK/API contract needed for this repository. Merchant onboarding documentation is required. |
| Popup checkout | Likely compatible | This matches GoKwik's documented checkout model. It must be opened from SORAA's custom buttons, not only from a theme app block. |
| Address prefill | Compatible with limits | Returning recognised shoppers can get saved-address prefill. Unknown/new shoppers still need verification and address input; PIN code can prefill city/state. |
| UPI/cards/wallets/net banking/COD | Likely compatible | Actual methods depend on GoKwik configuration, KYC and the contracted payment aggregator. |
| Shopify discount codes | Must test | SORAA applies discounts to the Storefront API cart before checkout. GoKwik must accept those cart discounts without recalculation mismatch. |
| SORAA10 offer | Must test | Confirm eligibility, expiry, usage limits and whether GoKwik reads Shopify discount rules or needs a duplicate GoKwik rule. There must be one source of truth. |
| Shopify gift cards | Unconfirmed | Get written confirmation that Shopify gift cards are supported in Kwik Checkout for headless carts. Keep native checkout fallback if they are not. |
| Selling plans/subscriptions | High-risk, unconfirmed | The current product page sends a Shopify `sellingPlanId`. GoKwik's public checkout material does not confirm Shopify selling-plan compatibility. Do not launch Subscribe & Save through GoKwik until recurring payment, contract creation, cancellation and renewal behaviour passes end-to-end tests. |
| Shipping rates/free-shipping rule | Must test | The UI advertises free shipping above INR 999, while Shopify remains authoritative. GoKwik and Shopify shipping results must match for every serviceable PIN code. |
| Taxes | Must test | Shopify order tax values must match the checkout display and invoices. |
| Refunds/chargebacks | Compatible with process setup | Define whether staff initiate refunds in Shopify, GoKwik, or the payment aggregator, and verify status sync in all systems. |
| Analytics and ads | Requires mapping | Preserve Shopify analytics/session attribution and send checkout started, payment attempted, purchase and failure events once only. |
| Accessibility/mobile | Must test | Popup focus trap, Escape/close, back-button behaviour, keyboard access and low-end mobile performance need verification. |

## One code issue to fix before India checkout testing

`app/lib/context.ts` currently configures the Storefront API context as `country: 'US'`. For an India-first INR storefront this should be `country: 'IN'`, after confirming Shopify Markets, store currency, tax and shipping configuration. Leaving it as US can produce the wrong market context even if the frontend displays rupee symbols.

## Recommended technical design

Keep the current SORAA cart drawer and product UI. Add one checkout adapter rather than scattering GoKwik calls across components.

The adapter should:

1. Receive the current Shopify cart ID/checkout URL and checkout intent.
2. Wait for any add-to-cart mutation to finish.
3. Open GoKwik using the exact headless handoff required by GoKwik's merchant SDK/API.
4. Send only documented fields and never expose a server secret in browser JavaScript.
5. Keep Shopify native `checkoutUrl` as a controlled fallback when GoKwik is unavailable or an unsupported cart is detected.
6. Prevent double clicks and duplicate order creation.
7. Emit consistent analytics events with an idempotency/order reference.

Expected code touchpoints after GoKwik supplies its integration specification:

- `app/lib/gokwik.server.ts`: server-only API client/signing, if required.
- `app/lib/checkout.ts`: checkout eligibility and destination adapter.
- `app/routes/api.gokwik.*.tsx`: verified callbacks/webhooks, only if required by their contract.
- `app/components/CartSummary.tsx`: route Checkout through the adapter.
- `app/components/ProductPurchase.tsx`: route Buy Now through the same adapter after the cart mutation.
- `app/routes/cart.$lines.tsx`: either route supported permalinks through GoKwik or retain the Shopify fallback.
- `app/root.tsx`: load a documented public SDK once, only if GoKwik requires it.
- Oxygen environment variables: public merchant/config identifiers and server-only credentials separated correctly.

Do not install GoKwik Cart merely to obtain checkout behaviour without confirmation. Its public cart product can replace cart UI, while SORAA already has a custom cart drawer. The required product is Kwik Checkout/headless integration.

## Information required from GoKwik before implementation

Send GoKwik this exact technical questionnaire:

1. Do you support Shopify Hydrogen/Oxygen headless storefronts in production? Please share the current SDK/API documentation and a working Hydrogen example.
2. What identifier should a Hydrogen storefront pass: Shopify cart ID, cart checkout URL, cart token, or complete line payload?
3. Does the integration preserve Shopify variant IDs, line attributes, cart attributes, discount codes, gift cards and buyer identity?
4. Do you support Shopify selling plans/subscription contracts? Which subscription apps/payment mandates are supported?
5. Are orders created directly in Shopify, and how are inventory, taxes, shipping rates, discounts and customer records reconciled?
6. Which payment aggregator processes and settles UPI/cards/wallets/net banking? What are MDR, platform fees, GST, settlement cycle and refund timelines?
7. Which COD/RTO rules are included, and can SORAA configure COD fees, partial COD, prepaid discounts, PIN-code blocking and order-value thresholds?
8. How are Shopify Markets, INR, Indian GST, shipping profiles and free-shipping thresholds handled?
9. What sandbox/test credentials, test phone numbers, test UPI/cards and webhook simulator are available?
10. What are the callback/webhook events, signature verification method, retry schedule and idempotency rules?
11. Can native Shopify checkout remain as an automatic fallback, and which failure codes should trigger it?
12. How are refunds, partial refunds, cancellations, payment failures, double debits and chargebacks synchronised back to Shopify?
13. Which domains must be allow-listed for Content Security Policy, frames, scripts and network calls on Shopify Oxygen?
14. What customer data is stored, where is it stored, how long is it retained, and what consent/privacy text must SORAA display?
15. How should Meta/Google/Shopify analytics track checkout and purchase without duplicate conversion events?

## Staging test matrix

No live rollout should happen until all of these pass:

- New phone number, correct OTP, invalid OTP, resend and rate limit.
- Returning GoKwik user with one and multiple saved addresses.
- New address, edited address, invalid PIN code and non-serviceable PIN code.
- UPI intent, UPI QR, card success/failure, COD allowed/blocked and payment retry.
- Single variant, multiple quantities, multiple products and out-of-stock change during checkout.
- SORAA10 valid/invalid/expired, automatic discount and combined-discount rules.
- Gift card flow, or verified native-checkout fallback.
- One-time purchase and every Subscribe & Save selling plan.
- Shipping below/above INR 999 and remote-area charges.
- Successful order, failed payment, abandoned popup, duplicate click and browser refresh.
- Full/partial refund, cancellation, RTO, double debit and chargeback visibility.
- Shopify order, inventory, tax, customer, email/SMS, fulfillment and analytics consistency.
- iOS Safari, Android Chrome, desktop browsers, keyboard navigation and slow networks.

## Rollout plan

1. Complete GoKwik merchant/KYC onboarding and obtain headless documentation plus sandbox access.
2. Correct and verify Shopify India market, INR, taxes, shipping zones and payment settings.
3. Implement the checkout adapter behind an environment feature flag.
4. Test on a non-live Shopify/Oxygen environment with test products and orders.
5. Keep native Shopify checkout as fallback during the pilot.
6. Start with one-time purchases only if selling-plan support is not yet certified.
7. Roll out to a small traffic share, compare conversion, payment success, COD share, RTO, support tickets and order mismatch rate.
8. Expand only after reconciliation is clean and fallback use is acceptably low.

## Final recommendation

GoKwik is worth proceeding with for SORAA, but the go/no-go condition is its Hydrogen handoff plus verified Shopify selling-plan support. Address prefill and COD/RTO features fit the business well. The current custom cart should remain, and GoKwik should replace only the checkout handoff through a single adapter with Shopify checkout retained as fallback.
