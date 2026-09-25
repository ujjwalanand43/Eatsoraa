import {
  Await,
  Link,
  useLoaderData,
  data,
  type HeadersFunction,
} from 'react-router';
import {Suspense, useRef} from 'react';
import {CartIcon, CartNuts} from '~/components/CartArtwork';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {HomeProductCard} from '~/components/HomeProductCard';

export const meta: Route.MetaFunction = () => {
  return [{title: `Your Cart | SORAA`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  const currentCart = await cart.get();
  const recommendations = context.storefront
    .query(CART_RECOMMENDATIONS_QUERY)
    .catch(() => null);
  return {cart: currentCart, recommendations};
}

export default function Cart() {
  const {cart, recommendations} = useLoaderData<typeof loader>();
  const track = useRef<HTMLDivElement>(null);

  return (
    <div className="cart-page">
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Cart</span>
      </nav>
      <header className="cart-page-header">
        <div>
          <h1>Your Cart</h1>
          <p>
            Good choice! You’re one step closer to a healthier, happier you. ♡
          </p>
        </div>
        <div className="cart-page-doodle" aria-hidden="true">
          Snacks
          <br />
          That Do
          <br />
          Good <CartIcon kind="smile" />
        </div>
        <Link className="cart-continue" to="/collections/all">
          ← Continue shopping
        </Link>
      </header>
      <CartMain layout="page" cart={cart} />
      <section
        className="cart-recommendations"
        aria-labelledby="cart-recommendations-title"
      >
        <div className="cart-recommendations-head">
          <CartNuts />
          <p className="cart-banner-script" aria-hidden="true">
            Good
            <br />
            Food
            <br />
            Good People ♡
          </p>
          <div>
            <h2 id="cart-recommendations-title">You might also like</h2>
            <span>More goodness for your everyday snacking.</span>
          </div>
          <Link to="/collections/all">Explore all products →</Link>
          <CartNuts />
        </div>
        <Suspense fallback={<p>Finding more good snacks…</p>}>
          <Await resolve={recommendations}>
            {(result) => (
              <div className="cart-recommendations-carousel">
                <button
                  className="cart-carousel-prev"
                  aria-label="Previous products"
                  onClick={() =>
                    track.current?.scrollBy({
                      left: -(track.current.clientWidth * 0.8),
                      behavior: 'smooth',
                    })
                  }
                >
                  ‹
                </button>
                <div className="cart-recommendations-track" ref={track}>
                  {result?.products.nodes.map((product) => (
                    <HomeProductCard key={product.id} product={product} />
                  ))}
                </div>
                <button
                  className="cart-carousel-next"
                  aria-label="Next products"
                  onClick={() =>
                    track.current?.scrollBy({
                      left: track.current.clientWidth * 0.8,
                      behavior: 'smooth',
                    })
                  }
                >
                  ›
                </button>
              </div>
            )}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}

const CART_RECOMMENDATIONS_QUERY = `#graphql
  query CartRecommendations($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: BEST_SELLING) {
      nodes {
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
    }
  }
` as const;
