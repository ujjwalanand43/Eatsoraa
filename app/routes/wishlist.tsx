import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/wishlist';
import {
  readWishlist,
  WISHLIST_EVENT,
  WISHLIST_KEY,
  type WishlistItem,
} from '~/components/WishlistButton';

export const meta: Route.MetaFunction = () => [{title: 'Wishlist | SORAA'}];

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  useEffect(() => {
    const sync = () => setItems(readWishlist());
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, []);
  const remove = (handle: string) => {
    const next = items.filter((item) => item.handle !== handle);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  };

  return (
    <div className="wishlist-page">
      <header className="store-page-header">
        <p>SAVED FOR LATER</p>
        <h1>Your wishlist</h1>
        <p>Keep the snacks you love close by.</p>
      </header>
      {items.length ? (
        <section className="wishlist-grid" aria-label="Saved products">
          {items.map((item) => (
            <article className="wishlist-card" key={item.handle}>
              <button
                type="button"
                className="wishlist-remove"
                aria-label={`Remove ${item.title} from wishlist`}
                onClick={() => remove(item.handle)}
              >
                ×
              </button>
              <Link to={`/products/${item.handle}`}>
                {item.image && <img src={item.image} alt={item.title} />}
                <h2>{item.title}</h2>
                <strong>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: item.currencyCode,
                  }).format(Number(item.price))}
                </strong>
                <span>View product →</span>
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section
          className="wishlist-empty"
          aria-labelledby="wishlist-empty-title"
        >
          <span aria-hidden="true">♡</span>
          <h2 id="wishlist-empty-title">
            Your wishlist is ready for good things.
          </h2>
          <p>Browse our collections and save your everyday favourites.</p>
          <Link to="/collections/all">
            Explore all products <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}
    </div>
  );
}
