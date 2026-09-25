import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPage} from '~/components/ProductPage';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.product.title ?? 'Shop'} | SORAA`},
  {
    name: 'description',
    content: data?.product.seo.description || data?.product.description,
  },
  {rel: 'canonical', href: `/products/${data?.product.handle}`},
];

export async function loader({context, params, request}: Route.LoaderArgs) {
  if (!params.handle) throw new Response('Product not found', {status: 404});
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: params.handle,
      selectedOptions: getSelectedProductOptions(request),
    },
  });
  if (!product?.id) throw new Response('Product not found', {status: 404});
  redirectIfHandleIsLocalized(request, {handle: params.handle, data: product});
  const recommendations = context.storefront
    .query(PDP_RECOMMENDATIONS_QUERY, {variables: {productId: product.id}})
    .catch(() => null);
  return {product, recommendations};
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions ?? []);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  return (
    <>
      <ProductPage
        key={product.id}
        product={product}
        selectedVariant={selectedVariant}
        productOptions={productOptions}
        recommendations={recommendations}
      />
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    sellingPlanAllocations(first: 10) {
      nodes {
        sellingPlan {
          id
          name
          description
          recurringDeliveries
          options { name value }
        }
        priceAdjustments {
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          perDeliveryPrice { amount currencyCode }
        }
      }
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    images(first: 12) { nodes { id url altText width height } }
    collections(first: 1) { nodes { title handle } }
    ingredients: metafield(namespace: "custom", key: "ingredients") { value type }
    nutrition: metafield(namespace: "custom", key: "nutrition_facts") { value type }
    highlights: metafield(namespace: "custom", key: "highlights") { value type }
    reviews: metafield(namespace: "custom", key: "reviews") { value type }
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PDP_RECOMMENDATIONS_QUERY = `#graphql
  query PdpRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) { ...PdpCard }
    products(first: 6, sortKey: BEST_SELLING) { nodes { ...PdpCard } }
  }
  fragment PdpCard on Product {
    id title handle
    featuredImage { id url altText width height }
    reviews: metafield(namespace: "custom", key: "reviews") { value }
    priceRange { minVariantPrice { amount currencyCode } }
    selectedOrFirstAvailableVariant {
      id availableForSale title
      selectedOptions { name value }
      image { id url altText width height }
      product { id handle title }
      price { amount currencyCode }
    }
  }
` as const;
