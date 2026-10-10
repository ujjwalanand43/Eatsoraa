/**
 * Shiprocket Checkout (Fastrr) — "Custom frontend + Shopify backend" integration.
 *
 * The script + stylesheet are injected in root.tsx. This helper calls
 * `shiprocketCheckoutEvents.buyDirect(...)` when the script has loaded.
 * If it has not (blocked, offline, not configured for the domain) it returns
 * false so callers fall back to the normal Shopify `cart.checkoutUrl`.
 */

// Domain Fastrr has this store's configuration saved against.
// Must match what Shiprocket has on file for the live domain.
export const FASTRR_SELLER_DOMAIN = 'eatsoraa.com';
export const FASTRR_SCRIPT_SRC =
  'https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js';
export const FASTRR_STYLE_HREF =
  'https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css';

type FastrrProduct = {variantId: string; quantity: number};

type FastrrOptions = {
  type: 'cart' | 'product';
  products: FastrrProduct[];
  couponCode?: string;
  utmParams?: string;
  cartAttributes?: Record<string, string>;
};

declare global {
  interface Window {
    shiprocketCheckoutEvents?: {buyDirect?: (options: FastrrOptions) => void};
  }
}

/** gid://shopify/ProductVariant/123 -> "123" */
export function toNumericId(gid: string) {
  return gid.split('/').pop() ?? gid;
}

/** Returns true if Fastrr took over checkout, false to use the Shopify checkout URL. */
export function startFastrrCheckout(options: FastrrOptions): boolean {
  if (typeof window === 'undefined') return false;
  const events = window.shiprocketCheckoutEvents;
  if (typeof events?.buyDirect !== 'function' || !options.products.length) {
    return false;
  }
  const utm = window.location.search.replace(/^\?/, '');
  try {
    events.buyDirect({
      ...options,
      ...(utm.includes('utm_') && !options.utmParams ? {utmParams: utm} : {}),
    });
    return true;
  } catch (error) {
    console.error('Fastrr checkout failed, using Shopify checkout', error);
    return false;
  }
}
