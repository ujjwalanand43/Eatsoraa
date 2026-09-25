import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, type FetcherWithComponents} from 'react-router';
import {
  CartForm,
  Image,
  Money,
  type MappedProductOptions,
} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {useAside} from './Aside';
import {packSavings} from '~/lib/packSavings';

type Result = {
  cart?: {id: string; checkoutUrl: string};
  errors?: {message: string}[];
  warnings?: {message: string}[];
};

function SubscriptionIcon({
  kind,
}: {
  kind: 'repeat' | 'truck' | 'tag' | 'calendar' | 'arrow';
}) {
  const paths = {
    repeat: (
      <>
        <path d="m17 2 4 4-4 4" />
        <path d="M3 11V9a3 3 0 0 1 3-3h18" />
        <path d="m7 22-4-4 4-4" />
        <path d="M21 13v2a3 3 0 0 1-3 3H3" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    tag: (
      <>
        <path d="M20 13 13 20 4 11V4h7z" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}
function PurchaseStatus({
  fetcher,
  checkout,
  openCart,
}: {
  fetcher: FetcherWithComponents<Result>;
  checkout: boolean;
  openCart: () => void;
}) {
  const [handled, setHandled] = useState<Result>();
  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data || fetcher.data === handled)
      return;
    setHandled(fetcher.data);
    if (
      fetcher.data.errors?.length ||
      fetcher.data.warnings?.length ||
      !fetcher.data.cart
    )
      return;
    if (checkout && fetcher.data.cart.checkoutUrl.startsWith('https://'))
      window.location.assign(fetcher.data.cart.checkoutUrl);
    else if (!checkout) openCart();
  }, [fetcher.state, fetcher.data, handled, checkout, openCart]);
  return (
    <p className="pdp-purchase-status" role="status">
      {fetcher.data?.errors?.map((e) => e.message).join(' ') ||
        fetcher.data?.warnings?.map((e) => e.message).join(' ') ||
        (fetcher.state === 'idle' && fetcher.data?.cart
          ? checkout
            ? 'Opening secure checkout…'
            : 'Added to your cart.'
          : '')}
    </p>
  );
}
export function ProductPurchase({
  options,
  variant,
  productTitle,
}: {
  options: MappedProductOptions[];
  variant: ProductVariantFragment | null;
  productTitle: string;
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const allocations = variant?.sellingPlanAllocations.nodes ?? [];
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  useEffect(() => {
    setSelectedPlanId(allocations[0]?.sellingPlan.id);
  }, [variant?.id]);
  const selectedAllocation = allocations.find(
    (allocation) => allocation.sellingPlan.id === selectedPlanId,
  );
  const subscriptionPrice = selectedAllocation?.priceAdjustments[0]?.price;
  const subscriptionDiscount =
    subscriptionPrice && variant?.price
      ? Math.max(
          0,
          Math.round(
            (1 -
              Number(subscriptionPrice.amount) / Number(variant.price.amount)) *
              100,
          ),
        )
      : 0;
  const mainBuyRow = useRef<HTMLDivElement>(null);
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  useEffect(() => {
    const node = mainBuyRow.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBuy(
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0,
        );
      },
      {threshold: 0},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="pdp-purchase">
        {options
          .filter(
            (option) =>
              !(
                option.name === 'Title' &&
                option.optionValues[0]?.name === 'Default Title'
              ),
          )
          .map((option) => (
            <fieldset className="pdp-options" key={option.name}>
              <legend>{option.name}</legend>
              <div className="pdp-option-grid">
                {option.optionValues.map((value) => {
                  const savings = packSavings(
                    options,
                    value.firstSelectableVariant,
                  );
                  const optionImage = value.firstSelectableVariant?.image;
                  const body = (
                    <>
                      {optionImage && (
                        <span className="pdp-option-image">
                          <Image
                            data={optionImage}
                            alt={`${productTitle} — ${value.name}`}
                            sizes="72px"
                          />
                        </span>
                      )}
                      <span>{value.name}</span>
                      {value.firstSelectableVariant?.price && (
                        <Money data={value.firstSelectableVariant.price} />
                      )}
                      {savings && (
                        <span className="pdp-pack-saving">
                          <s>
                            <Money data={savings.price} />
                          </s>
                          <span className="pdp-pack-badge">
                            {savings.percent}% OFF
                          </span>
                        </span>
                      )}
                      {!value.available && <small>Sold out</small>}
                    </>
                  );
                  return value.isDifferentProduct ? (
                    <Link
                      key={value.name}
                      className={`pdp-option${value.selected ? ' selected' : ''}`}
                      to={`/products/${value.handle}?${value.variantUriQuery}`}
                      preventScrollReset
                      aria-current={value.selected ? 'true' : undefined}
                    >
                      {body}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      key={value.name}
                      className={`pdp-option${value.selected ? ' selected' : ''}`}
                      aria-pressed={value.selected}
                      disabled={!value.exists}
                      onClick={() => {
                        if (!value.selected)
                          void navigate(`?${value.variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                      }}
                    >
                      {body}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        {options.some((option) =>
          option.optionValues.some((value) =>
            packSavings(options, value.firstSelectableVariant),
          ),
        ) && (
          <p className="pdp-pack-note">
            Pack savings compared with buying single packs separately.
          </p>
        )}
        <div className="pdp-buy-row" ref={mainBuyRow}>
          <div className="pdp-quantity" role="group" aria-label="Quantity">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              −
            </button>
            <output aria-live="polite" aria-label="Selected quantity">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity === 99}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{
              lines: variant
                ? [
                    {
                      merchandiseId: variant.id,
                      quantity,
                      selectedVariant: variant,
                    },
                  ]
                : [],
            }}
          >
            {(fetcher: FetcherWithComponents<Result>) => (
              <>
                <button
                  className="pdp-add"
                  type="submit"
                  disabled={
                    !variant?.availableForSale || fetcher.state !== 'idle'
                  }
                >
                  {fetcher.state !== 'idle'
                    ? 'Adding…'
                    : variant?.availableForSale
                      ? 'Add to cart'
                      : 'Sold out'}
                </button>
                <PurchaseStatus
                  fetcher={fetcher}
                  checkout={false}
                  openCart={() => open('cart')}
                />
              </>
            )}
          </CartForm>
        </div>
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: variant
              ? [
                  {
                    merchandiseId: variant.id,
                    quantity,
                    selectedVariant: variant,
                  },
                ]
              : [],
          }}
        >
          {(fetcher: FetcherWithComponents<Result>) => (
            <>
              <button
                className="pdp-buy-now"
                type="submit"
                disabled={
                  !variant?.availableForSale || fetcher.state !== 'idle'
                }
              >
                {fetcher.state !== 'idle' ? 'Preparing checkout…' : 'Buy now'}
              </button>
              <PurchaseStatus
                fetcher={fetcher}
                checkout
                openCart={() => open('cart')}
              />
            </>
          )}
        </CartForm>
        <section
          className="pdp-subscription"
          aria-labelledby="subscription-heading"
        >
          <div className="pdp-subscription-heading">
            <div className="pdp-subscription-title">
              <span className="pdp-subscription-icon">
                <SubscriptionIcon kind="repeat" />
              </span>
              <div>
                <h3 id="subscription-heading">Subscribe &amp; Save</h3>
                <p>Easy recurring delivery. Manage or cancel anytime.</p>
              </div>
            </div>
            {subscriptionPrice && (
              <div className="pdp-subscription-price">
                <strong>
                  <Money data={subscriptionPrice} />
                </strong>
                <small>per delivery</small>
              </div>
            )}
          </div>
          {allocations.length > 0 ? (
            <>
              <div className="pdp-subscription-benefits">
                <div>
                  <span>
                    <SubscriptionIcon kind="truck" />
                  </span>
                  <p>
                    <strong>Regular deliveries</strong>
                    <small>Never run out</small>
                  </p>
                </div>
                <div>
                  <span>
                    <SubscriptionIcon kind="tag" />
                  </span>
                  <p>
                    <strong>Save {subscriptionDiscount || 10}%</strong>
                    <small>On every delivery</small>
                  </p>
                </div>
                <div>
                  <span>
                    <SubscriptionIcon kind="calendar" />
                  </span>
                  <p>
                    <strong>Flexible</strong>
                    <small>Pause or cancel anytime</small>
                  </p>
                </div>
              </div>
              <div
                className="pdp-selling-plans"
                role="radiogroup"
                aria-label="Delivery frequency"
              >
                {allocations.map((allocation) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={allocation.sellingPlan.id === selectedPlanId}
                    className={
                      allocation.sellingPlan.id === selectedPlanId
                        ? 'selected'
                        : ''
                    }
                    key={allocation.sellingPlan.id}
                    onClick={() => setSelectedPlanId(allocation.sellingPlan.id)}
                  >
                    <span className="pdp-plan-radio" aria-hidden="true" />
                    <span className="pdp-plan-copy">
                      <strong>{allocation.sellingPlan.name}</strong>
                      <small>
                        Get regular deliveries and save on every order.
                      </small>
                    </span>
                    <span className="pdp-plan-frequency">
                      <SubscriptionIcon kind="truck" />
                      {allocation.sellingPlan.options[0]?.value ||
                        'Recurring delivery'}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="pdp-subscription-unavailable">
              Subscription is not available for this product yet.
            </p>
          )}
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{
              lines:
                variant && selectedPlanId
                  ? [
                      {
                        merchandiseId: variant.id,
                        quantity,
                        sellingPlanId: selectedPlanId,
                        selectedVariant: variant,
                      },
                    ]
                  : [],
            }}
          >
            {(fetcher: FetcherWithComponents<Result>) => (
              <>
                <button
                  className="pdp-subscribe-button"
                  type="submit"
                  disabled={
                    !variant?.availableForSale ||
                    !selectedPlanId ||
                    fetcher.state !== 'idle'
                  }
                >
                  <SubscriptionIcon kind="repeat" />
                  <span>
                    {fetcher.state !== 'idle'
                      ? 'Adding subscription…'
                      : 'Subscribe now'}
                  </span>
                  <SubscriptionIcon kind="arrow" />
                </button>
                <PurchaseStatus
                  fetcher={fetcher}
                  checkout={false}
                  openCart={() => open('cart')}
                />
              </>
            )}
          </CartForm>
        </section>
      </div>
      {showStickyBuy && (
        <div
          className="pdp-sticky-buy"
          role="region"
          aria-label="Quick product purchase"
        >
          <div className="pdp-sticky-product">
            <strong>{productTitle}</strong>
            {variant?.title && variant.title !== 'Default Title' && (
              <small>{variant.title}</small>
            )}
          </div>
          <div className="pdp-sticky-price">
            {variant?.price && <Money data={variant.price} />}
          </div>
          <div
            className="pdp-sticky-quantity"
            role="group"
            aria-label="Sticky purchase quantity"
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity((current) => current - 1)}
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity === 99}
              onClick={() => setQuantity((current) => current + 1)}
            >
              +
            </button>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{
              lines: variant
                ? [
                    {
                      merchandiseId: variant.id,
                      quantity,
                      selectedVariant: variant,
                    },
                  ]
                : [],
            }}
          >
            {(fetcher: FetcherWithComponents<Result>) => (
              <>
                <button
                  type="submit"
                  disabled={
                    !variant?.availableForSale || fetcher.state !== 'idle'
                  }
                >
                  {fetcher.state !== 'idle'
                    ? 'Adding…'
                    : variant?.availableForSale
                      ? 'Add to cart'
                      : 'Sold out'}
                </button>
                <PurchaseStatus
                  fetcher={fetcher}
                  checkout={false}
                  openCart={() => open('cart')}
                />
              </>
            )}
          </CartForm>
        </div>
      )}
    </>
  );
}
