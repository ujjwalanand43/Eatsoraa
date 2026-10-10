import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

const FASTRR_HOSTS = [
  'https://*.pickrr.com',
  'https://*.shiprocket.in',
  'https://*.shiprocket.co',
];

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    // COBE embeds its world land mask as a PNG data URL.
    imgSrc: ["'self'", "data:", "https://cdn.shopify.com", "https://shopify.com", ...FASTRR_HOSTS],
    // Shiprocket Checkout (Fastrr) script, styles, API calls and checkout frame.
    scriptSrc: ["'self'", "https://cdn.shopify.com", ...FASTRR_HOSTS],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.shopify.com", ...FASTRR_HOSTS],
    connectSrc: ["'self'", ...FASTRR_HOSTS],
    frameSrc: ["'self'", ...FASTRR_HOSTS],
    fontSrc: ["'self'", "data:", ...FASTRR_HOSTS],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
