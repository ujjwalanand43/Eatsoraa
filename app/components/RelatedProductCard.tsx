import {useEffect, useState} from 'react';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link, useFetcher} from 'react-router';
import type {HomeProductsQuery} from 'storefrontapi.generated';
import type {loader} from '~/routes/products.$handle';
import {productRating} from './HomeProductCard';

type CardProduct = Pick<HomeProductsQuery['products']['nodes'][number], 'id' | 'handle' | 'title' | 'featuredImage' | 'priceRange'>;

export function RelatedProductCard({product}: {product: CardProduct}) {
  const {load, data, state} = useFetcher<typeof loader>();
  const [planId] = useState('');
  useEffect(() => {void load(`/products/${product.handle}`);}, [load, product.handle]);
  const detail = data?.product;
  const variant = detail?.selectedOrFirstAvailableVariant;
  const plans = variant?.sellingPlanAllocations.nodes || [];
  const plan = plans.find(item => item.sellingPlan.id === planId);
  const price = plan?.priceAdjustments[0]?.price || variant?.price || product.priceRange.minVariantPrice;
  const rating = productRating(detail?.reviews?.value);
  const image = variant?.image || product.featuredImage;
  return <article className="soraa-product-card related-shop-card">
    <Link to={`/products/${product.handle}`} className="home-product-link">
      <div className="product-image-wrapper">{image && <Image data={image} sizes="(min-width: 900px) 340px, 80vw" loading="lazy" alt={image.altText || product.title} />}</div>
    </Link>
    <div className="related-card-panel">
    <Link className="related-product-rating" to={`/products/${product.handle}#customer-reviews`} aria-label={rating ? `${rating.average.toFixed(1)} out of 5, ${rating.count} reviews` : 'No reviews yet'}>
      <span aria-hidden="true">{rating ? '★'.repeat(Math.round(rating.average)) + '☆'.repeat(5 - Math.round(rating.average)) : '☆☆☆☆☆'}</span>
      <small>{rating ? `${rating.count} reviews` : 'No reviews yet'}</small>
    </Link>
    <Link to={`/products/${product.handle}`}><h3>{product.title}</h3></Link>
    <div className="related-card-price"><Money data={price} /></div>
    {/* Temporarily hidden: pack and purchase option selectors.
    <div className="related-purchase-options">
      {detail ? detail.options.filter(option => !(option.name === 'Title' && option.optionValues[0]?.name === 'Default Title')).map(option => <label key={option.name}>
        <span className="related-option-label">{option.name}</span>
        <select aria-label={`${product.title} ${option.name}`} disabled={state !== 'idle'} value={variant?.selectedOptions.find(item => item.name === option.name)?.value || ''} onChange={event => {
          const params = new URLSearchParams(variant?.selectedOptions.map(item => [item.name, item.value]));
          params.set(option.name, event.target.value);
          setPlanId('');
          void load(`/products/${product.handle}?${params}`);
        }}>{option.optionValues.map(value => <option key={value.name} value={value.name}>{value.name}</option>)}</select>
      </label>) : <span className="related-option-label">Loading pack options…</span>}
      <label className="related-purchase-plan"><span className="related-option-label">Purchase option</span><select aria-label={`${product.title} purchase option`} value={plan?.sellingPlan.id || ''} onChange={event => setPlanId(event.target.value)} disabled={!plans.length || state !== 'idle'}>
        <option value="">One-time purchase</option>
        {plans.map(item => <option key={item.sellingPlan.id} value={item.sellingPlan.id}>Subscribe · {item.sellingPlan.name}</option>)}
      </select></label>
    </div>
    {plan && <small className="related-subscription-note">{plan.sellingPlan.name}</small>}
    {detail && !plans.length && <small className="related-subscription-note">Subscription unavailable for this pack</small>}
    */}
    <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: variant ? [{merchandiseId: variant.id, quantity: 1, ...(plan ? {sellingPlanId: plan.sellingPlan.id} : {})}] : []}}>
      {fetcher => <>
        <button className="add-cart-button" type="submit" disabled={!variant?.availableForSale || state !== 'idle' || fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle' ? 'Adding…' : !detail ? 'Loading…' : !variant?.availableForSale ? 'Sold out' : <>{plan ? 'Subscribe' : 'Add to cart'} · <Money data={price} /></>}
        </button>
        <p className="product-cart-status" role="status">{fetcher.state === 'idle' && (fetcher.data?.errors?.length ? 'Could not add this pack. Please try again.' : fetcher.data?.cart ? 'Added to cart ✓' : '')}</p>
      </>}
    </CartForm>
    </div>
  </article>;
}
