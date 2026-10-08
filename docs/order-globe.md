# Homepage order globe

The homepage shows five labelled sample locations, plus sanitized destinations from the Shopify shop JSON metafield `soraa.order_locations`. Samples are never presented as actual purchases. No customer names, order IDs, street addresses or timestamps are rendered.

## Connect real orders

The Storefront API cannot list all shop orders. A server-side Shopify app/Flow integration must maintain this public JSON metafield from actual orders; this repository does not currently contain that order-processing app. Live syncing is **not active** until that integration is configured.

1. In the store's integration app, enable `read_orders` and the required protected customer data access for city/region information. Keep the Admin API token server-side.
2. Create a SHOP metafield definition: namespace `soraa`, key `order_locations`, type `json`, Storefront access `PUBLIC_READ`.
3. On paid orders, map the shipping city to a city-centre coordinate (never the customer's precise coordinate), deduplicate by city, and retain at most 50 destinations. Do not publish names, emails, phone numbers, street addresses or order identifiers.
4. Write an array like the following to the shop metafield. Populate it from genuine orders only:

```json
[{"city":"Mumbai","country":"India","latitude":19.08,"longitude":72.88}]
```

5. Reload the homepage after the Storefront cache expires. These entries appear alongside the five labelled samples as “Order destination”. Missing/invalid data and API failures leave the samples working. This is a page-load feed, not a realtime order subscription.

Docs: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/metafields
Orders access: https://shopify.dev/docs/api/admin-graphql/latest/objects/Order

## Motion

COBE is lazy-loaded in the browser. Rotation respects reduced-motion preferences and pauses in hidden tabs. A pause button is available. The canvas resizes with its container. If WebGL is unavailable, a static branded fallback and the location list remain visible.
