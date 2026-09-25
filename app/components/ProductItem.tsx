import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from './WishlistButton';

export function ProductItem({
  product,
  loading,
}: {
  product: CollectionItemFragment | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <article className="product-item" key={product.id}>
      <WishlistButton
        item={{
          handle: product.handle,
          title: product.title,
          image: image?.url,
          price: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        }}
        className="product-item-wishlist"
      />
      <Link className="product-item-link" prefetch="intent" to={variantUrl}>
        {image && (
          <span className="product-item-image">
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 64em) 25vw, (min-width: 45em) 33vw, 50vw"
            />
          </span>
        )}
        <span className="product-item-copy">
          <h4>{product.title}</h4>
          <span className="product-item-price">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          <span className="product-item-action">
            View product <span aria-hidden="true">→</span>
          </span>
        </span>
      </Link>
    </article>
  );
}
