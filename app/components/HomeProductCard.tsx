import {Suspense} from 'react';
import {CartForm, Image, Money, useOptimisticCart} from '@shopify/hydrogen';
import {Await, Link, useAsyncValue, useFetcher, useRouteLoaderData, type FetcherWithComponents} from 'react-router';
import type {CartApiQueryFragment, HomeProductsQuery} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

type CardProduct = HomeProductsQuery['products']['nodes'][number] & {
  reviews?: {value: string} | null;
};

function productRating(value?: string) {
  if (!value) return null;
  try {
    const reviews = JSON.parse(value) as {rating?: unknown}[];
    const ratings = Array.isArray(reviews)
      ? reviews.map((review) => review?.rating).filter((rating): rating is number => typeof rating === 'number' && rating >= 1 && rating <= 5)
      : [];
    if (!ratings.length) return null;
    return {average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length, count: ratings.length};
  } catch {
    return null;
  }
}

type CompactLine = {id: string; quantity: number};
type CompactCartData = {
  cart?: {lines?: {nodes?: Array<CompactLine & {merchandise?: {id?: string}}>}};
  errors?: Array<{message: string}>;
};

function QuantityIcon({kind}: {kind: 'plus' | 'minus'}) {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d={kind === 'plus' ? 'M3 8h10M8 3v10' : 'M3 8h10'} /></svg>;
}

type CompactCartProps = {
  variant: CardProduct['selectedOrFirstAvailableVariant'];
  productTitle: string;
};

function CompactCartControl(props: CompactCartProps) {
  const root = useRouteLoaderData<RootLoader>('root');
  return <Suspense fallback={<div className="related-cart-control"><button className="add-cart-button" disabled aria-label="Loading cart"><QuantityIcon kind="plus" /></button></div>}>
    <Await resolve={root?.cart}><CompactCartButtons {...props} /></Await>
  </Suspense>;
}

function CompactCartButtons({variant, productTitle}: CompactCartProps) {
  const fetcher = useFetcher<CompactCartData>();
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const line = cart?.lines.nodes.find(item => item.merchandise.id === variant?.id);
  const quantity = line?.quantity ?? 0;

  if (!variant?.availableForSale) return <div className="related-cart-control"><button className="add-cart-button" type="button" disabled aria-label={`${productTitle} is sold out`}>×</button></div>;

  const submit = (action: string, inputs: object) => fetcher.submit(
    {[CartForm.INPUT_NAME]: JSON.stringify({action, inputs})},
    {method: 'post', action: '/cart'},
  );
  const busy = fetcher.state !== 'idle' || Boolean(line?.isOptimistic);

  if (quantity === 0) return <div className="related-cart-control">
    <button className="add-cart-button" type="button" disabled={fetcher.state !== 'idle'} aria-label={`Add ${productTitle} to cart`} onClick={() => {
      submit(CartForm.ACTIONS.LinesAdd, {lines: [{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}]});
    }}><QuantityIcon kind="plus" /></button>
    <p className="product-cart-status" role="status">{fetcher.state === 'idle' && fetcher.data?.errors?.map(error => error.message).join(' ')}</p>
  </div>;

  const decrease = Math.max(0, quantity - 1);
  return <div className="related-cart-control related-cart-control--quantity" aria-label={`${productTitle} quantity`}>
    <button type="button" disabled={busy} aria-label={decrease === 0 ? `Remove ${productTitle} from cart` : `Decrease ${productTitle} quantity`} onClick={() => {
      if (!line) return;
      if (decrease === 0) {
        submit(CartForm.ACTIONS.LinesRemove, {lineIds: [line.id]});
      } else submit(CartForm.ACTIONS.LinesUpdate, {lines: [{id: line.id, quantity: decrease}]});
    }}><QuantityIcon kind="minus" /></button>
    <output aria-live="polite">{quantity}</output>
    <button type="button" disabled={busy} aria-label={`Increase ${productTitle} quantity`} onClick={() => {
      if (!line) return;
      const next = quantity + 1;
      submit(CartForm.ACTIONS.LinesUpdate, {lines: [{id: line.id, quantity: next}]});
    }}><QuantityIcon kind="plus" /></button>
    <p className="product-cart-status" role="status">{fetcher.state === 'idle' && fetcher.data?.errors?.map(error => error.message).join(' ')}</p>
  </div>;
}

export function HomeProductCard({product, compact = false}: {product: CardProduct; compact?: boolean}) {
  const variant = product.selectedOrFirstAvailableVariant;
  const rating = productRating(product.reviews?.value);
  return (
    <article className={`soraa-product-card${compact ? ' soraa-product-card--compact' : ''}`}>
      <Link to={`/products/${product.handle}`} prefetch="intent" className="home-product-link">
        <div className="product-image-wrapper">
          {product.featuredImage && <Image data={product.featuredImage} sizes="(min-width: 1000px) 18vw, 45vw" loading="lazy" alt={product.featuredImage.altText || product.title} />}
        </div>
        <h3>{product.title}</h3>
        {compact && <div className="related-product-rating" aria-label={rating ? `${rating.average.toFixed(1)} out of 5 from ${rating.count} reviews` : 'No reviews yet'}>
          <span aria-hidden="true">★★★★★</span>
          <small>{rating ? `${rating.average.toFixed(1)} (${rating.count.toLocaleString('en-IN')})` : 'New'}</small>
        </div>}
      </Link>
      <div className="product-price"><Money data={variant?.price ?? product.priceRange.minVariantPrice} /></div>
      {compact ? <CompactCartControl variant={variant} productTitle={product.title} /> : <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: variant ? [{merchandiseId: variant.id, quantity: 1}] : []}}>
        {(fetcher: FetcherWithComponents<{cart?: {id: string}; errors?: {message: string}[]}>) => <>
          <button className="add-cart-button" type="submit" disabled={!variant?.availableForSale || fetcher.state !== 'idle'} aria-label={!variant?.availableForSale ? `${product.title} is sold out` : `Add ${product.title} to cart`}>
            {!variant?.availableForSale ? 'Sold out' : fetcher.state !== 'idle' ? 'Adding…' : 'Add to Cart +'}
          </button>
          <p className="product-cart-status" role="status">{fetcher.state === 'idle' && (fetcher.data?.errors?.length ? fetcher.data.errors.map(e => e.message).join(' ') : fetcher.data?.cart ? 'Added to cart ✓' : '')}</p>
        </>}
      </CartForm>}
    </article>
  );
}
