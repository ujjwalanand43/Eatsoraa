# Product page content handoff

The product route uses live Shopify titles, descriptions, images, variants, prices, compare-at prices and availability. It does not copy sample prices, reviews or claims from the design reference.

## Product photography

Upload the gallery in Shopify product media. Recommended delivery: 1600 x 1728 px main product composition, with the pack fully inside a 10% safe margin; additional front/back/detail and lifestyle photographs at 1600 px or larger. The gallery displays the whole asset (contain), rather than cropping product labels. On phones the main frame is square, and thumbnails scroll horizontally. The description and closing banner prefer an image whose descriptive alt text includes lifestyle, serving, or bowl, falling back to the first product image. Upload a suitable food/lifestyle photograph with accurate alt text when final artwork is available. Gallery supports up to 12 images. Provide descriptive alt text in Shopify.

## Optional product metafields

Create these product metafield definitions with Storefront read access. No admin settings are changed by this implementation.

| Namespace/key | Type | Content |
| --- | --- | --- |
| custom.ingredients | multi_line_text_field or list.single_line_text_field | Verified ingredient and allergen information. |
| custom.nutrition_facts | json | Array of objects with string `label` and `value`. All values MUST be per 100 g because that basis is displayed. Include units. |
| custom.highlights | list.single_line_text_field | Up to four short, approved product benefits. |
| custom.reviews | json | Published customer reviews as objects with `name` (string), `rating` (number, 1–5), and `text` (string). Only reviews approved for publication; no private customer details. |

Nutrition structure: `[{"label":"Energy","value":"verified kcal value"}]`. Replace the placeholder with label-approved data before publishing.

Ratings and review counts are calculated from the published review array. Missing reviews show an empty state. Missing ingredients/nutrition direct shoppers to the package. Highlights are hidden when absent. The page does not include a review submission service.

## Purchase behaviour

Pack labels and prices are Shopify variant options. Quantity range is 1–99. Add to cart opens the existing drawer after a successful cart response. Buy now adds the chosen variant and quantity to the current cart, then opens its Shopify checkout (including existing cart items). No payment is submitted by this page. API errors and warnings are displayed inline. Multi-pack savings compare the selected pack price with the equivalent number of single packs at their current selling price, matching product, currency and other options. The comparison basis is labelled, and percentages are rounded to whole numbers. The main price uses this comparison when available, otherwise a valid Shopify compare-at price. Selling prices remain unchanged; no artificial reference prices are added.

## Validation

TypeScript and targeted ESLint pass. Storefront queries validated with Shopify AI Toolkit. Browser checks covered 320, 390, 768, 1440 and 1920 px widths, variant selection, quantity, add-to-cart, gallery zoom/Escape, and keyboard tabs. Checkout payment was not executed.

Shopify reference: https://shopify.dev/docs/api/storefront/2026-07/queries/product
