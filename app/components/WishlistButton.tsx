import {useEffect, useState} from 'react';

export type WishlistItem = {
  handle: string;
  image?: string;
  price: string;
  currencyCode: string;
  title: string;
};

export const WISHLIST_KEY = 'soraa:wishlist:v1';
export const WISHLIST_EVENT = 'soraa:wishlist-change';

export function readWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || '[]',
    );
    return Array.isArray(value) ? (value as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function WishlistButton({
  item,
  className = '',
}: {
  item: WishlistItem;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () =>
      setSaved(readWishlist().some((entry) => entry.handle === item.handle));
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, [item.handle]);

  const toggle = () => {
    const current = readWishlist();
    const next = saved
      ? current.filter((entry) => entry.handle !== item.handle)
      : [...current, item];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setSaved(!saved);
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  };

  return (
    <button
      type="button"
      className={`wishlist-button${saved ? ' is-saved' : ''} ${className}`.trim()}
      aria-label={
        saved
          ? `Remove ${item.title} from wishlist`
          : `Add ${item.title} to wishlist`
      }
      aria-pressed={saved}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      <span className="wishlist-button-label">
        {saved ? 'Saved' : 'Add to wishlist'}
      </span>
    </button>
  );
}
