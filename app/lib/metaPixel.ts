export const COOKIE_CHOICE_KEY = 'soraa-cookie-choice';
export const COOKIE_CHOICE_EVENT = 'soraa:cookie-choice';
export const META_PIXEL_ID = '1870465787275573';

type PixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: PixelFunction;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: PixelFunction;
    _fbq?: PixelFunction;
  }
}

export function hasMarketingConsent() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(COOKIE_CHOICE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

let initialized = false;

export function initializeMetaPixel(nonce?: string) {
  if (!hasMarketingConsent()) return;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as PixelFunction;
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    window._fbq = window._fbq || fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    if (nonce) script.nonce = nonce;
    document.head.appendChild(script);
  }
  window.fbq('consent', 'grant');
  if (!initialized) {
    window.fbq('init', META_PIXEL_ID);
    initialized = true;
  }
}

export function trackMetaEvent(
  event: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout',
  parameters?: Record<string, unknown>,
) {
  if (!hasMarketingConsent() || !initialized) return;
  window.fbq?.('trackSingle', META_PIXEL_ID, event, parameters || {});
}
