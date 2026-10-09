import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();
  const subtotal = Number(cart.cost?.subtotalAmount?.amount ?? 0);

  return (
    <div aria-labelledby={summaryId} className={className}>
      <h2 id={summaryId}>
        {layout === 'page' ? 'Order Summary' : 'Cart total'}
      </h2>
      <dl role="group" className="cart-subtotal">
        <dt>
          Subtotal ({cart.totalQuantity}{' '}
          {cart.totalQuantity === 1 ? 'item' : 'items'})
        </dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {layout === 'page' && (
        <>
          <dl className="cart-shipping-row">
            <dt>Shipping</dt>
            <dd className={subtotal >= 999 ? '' : 'pending'}>
              {subtotal >= 999 ? 'Free' : 'Calculated at checkout'}
            </dd>
          </dl>
          <div className="cart-summary-total">
            <span>Total</span>
            <strong>
              {cart.cost?.totalAmount ? (
                <Money data={cart.cost.totalAmount} />
              ) : (
                '-'
              )}
            </strong>
            <small>Incl. all taxes</small>
          </div>
          <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
          <ShippingProgress subtotal={subtotal} />
        </>
      )}
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
      />
      {layout === 'aside' && (
        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardHeadingId={giftCardHeadingId}
          giftCardInputId={giftCardInputId}
        />
      )}
      {layout === 'aside' && (
        <CartCheckoutActions
          checkoutUrl={cart?.checkoutUrl}
          total={
            cart?.cost?.totalAmount?.amount ? (
              <Money data={cart.cost.totalAmount} />
            ) : undefined
          }
        />
      )}
    </div>
  );
}

export function ShippingProgress({subtotal}: {subtotal: number}) {
  const tiers = [{amount: 999, label: 'Free delivery'}, {amount: 1499, label: '10% off'}, {amount: 1999, label: '15% off'}];
  const threshold = 1999;
  const next = tiers.find((tier) => subtotal < tier.amount);
  const remaining = next ? Math.ceil(next.amount - subtotal) : 0;
  const progress = subtotal < 999 ? Math.max(0, subtotal / 999) * 16.667 : subtotal < 1499 ? 16.667 + (subtotal - 999) / 500 * 33.333 : Math.min(83.333, 50 + (subtotal - 1499) / 500 * 33.333);
  return (
    <div className="cart-shipping-progress">
      <strong>
        {next ? `Add ₹${remaining} for ${next.label}` : 'You’ve reached the top offer tier!'}
      </strong>
      <div className="cart-reward-track">
      <div
        className="cart-reward-rail"
        role="progressbar"
        aria-label="Cart offers progress"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
      >
        <span style={{width: `${progress}%`}} />
      </div>
      <ol className="cart-offer-tiers">
        {tiers.map((tier) => <li key={tier.amount} data-reached={subtotal >= tier.amount}>
          <b>₹{tier.amount.toLocaleString('en-IN')}</b>
          <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7C5 8 5 1 9 3l3 4Zm0 0c7 1 7-6 3-4l-3 4Z" /></svg></i>
          <span>{tier.label}</span>
        </li>)}
      </ol>
      </div>
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  total,
}: {
  checkoutUrl?: string;
  total?: React.ReactNode;
}) {
  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout-actions">
      <a href={checkoutUrl} target="_self">
        {total ? (
          <>
            Checkout — {total}
          </>
        ) : (
          'Proceed to Checkout'
        )}{' '}
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  if (!codes.length) return null;

  return (
    <section aria-label="Discounts" className="cart-coupon">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId}>Discounts</dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}
