/**
 * Single source of truth for storefront categories.
 *
 * Each category = one Shopify SMART collection whose only rule is
 * "Product tag is equal to <tag>". To put a product in a category, add that
 * ONE tag to the product in Shopify admin — nothing in code changes.
 * Never rename a collection handle without updating it here.
 */
export const CATEGORIES = {
  flavoured: {handle: 'flavored-nuts', tag: 'flavourednuts', title: 'Flavoured Nuts & Mixes'},
  seeds: {handle: 'seeds-superfoods', tag: 'seedssuperfoods', title: 'Seeds & Superfoods'},
  nuts: {handle: 'roasted-nuts', tag: 'roastednuts', title: 'Nuts & Raisins'}, // also matches tag datebites (dry fruits),
  spices: {handle: 'gourmet-spices', tag: 'gourmetspices', title: 'Spices & Masalas'},
  gifts: {handle: 'combos-gift-boxes', tag: 'giftboxes', title: 'Bundles & Giftpacks'},
} as const;

export const categoryPath = (key: keyof typeof CATEGORIES) =>
  `/collections/${CATEGORIES[key].handle}`;
