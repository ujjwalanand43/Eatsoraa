import {useEffect, useRef, useState} from 'react';
import {useLocation, useRouteLoaderData} from 'react-router';
import {useAnalytics, useNonce} from '@shopify/hydrogen';
import type {loader as productLoader} from '~/routes/products.$handle';
import {
  COOKIE_CHOICE_EVENT,
  COOKIE_CHOICE_KEY,
  hasMarketingConsent,
  initializeMetaPixel,
  trackMetaEvent,
} from '~/lib/metaPixel';

export function MetaPixel() {
  const nonce = useNonce();
  const {pathname, search} = useLocation();
  const productData = useRouteLoaderData<typeof productLoader>(
    'routes/products.$handle',
  );
  const {subscribe} = useAnalytics();
  const [allowed, setAllowed] = useState(false);
  const lastPage = useRef('');
  const lastProduct = useRef('');

  useEffect(() => {
    const syncConsent = () => {
      const accepted = hasMarketingConsent();
      if (accepted) initializeMetaPixel(nonce);
      else window.fbq?.('consent', 'revoke');
      setAllowed(accepted);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CHOICE_KEY || event.key === null) syncConsent();
    };
    syncConsent();
    window.addEventListener(COOKIE_CHOICE_EVENT, syncConsent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(COOKIE_CHOICE_EVENT, syncConsent);
      window.removeEventListener('storage', onStorage);
    };
  }, [nonce]);

  useEffect(() => {
    if (!allowed) {
      lastPage.current = '';
      lastProduct.current = '';
      return;
    }
    const page = pathname + search;
    if (lastPage.current !== page) {
      trackMetaEvent('PageView');
      lastPage.current = page;
    }
    const product = productData?.product;
    const variant = product?.selectedOrFirstAvailableVariant;
    const productKey = variant ? `${page}:${variant.id}` : '';
    if (!productKey) lastProduct.current = '';
    if (product && variant && lastProduct.current !== productKey) {
      trackMetaEvent('ViewContent', {
        content_ids: [variant.id.split('/').pop()],
        content_type: 'product',
        content_name: product.title,
        value: Number(variant.price.amount),
        currency: variant.price.currencyCode,
      });
      lastProduct.current = productKey;
    }
  }, [allowed, pathname, search, productData]);

  useEffect(() => {
    let active = true;
    // Hydrogen publishes this after a successful cart update, not a button click.
    subscribe('product_added_to_cart', ({currentLine, prevLine}) => {
      if (!active || !currentLine) return;
      const quantity = currentLine.quantity - (prevLine?.quantity || 0);
      if (quantity <= 0) return;
      const variant = currentLine.merchandise;
      trackMetaEvent('AddToCart', {
        content_ids: [variant.id.split('/').pop()],
        content_type: 'product',
        contents: [{id: variant.id.split('/').pop(), quantity}],
        value: Number(variant.price.amount) * quantity,
        currency: variant.price.currencyCode,
      });
    });
    return () => {
      active = false;
    };
  }, [subscribe]);

  return null;
}
