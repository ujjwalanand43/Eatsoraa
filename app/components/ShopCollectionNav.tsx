import {NavLink} from 'react-router';

const categories = [
  ['flavored-nuts', 'Flavoured Nuts & Mixes', 'flavoured-nuts-packs.jpg'],
  ['seed-mixes', 'Seeds & Superfoods', 'seeds-pack.jpg'],
  ['dry-fruits', 'Nuts & Raisins', 'nuts-pack.jpg'],
  ['spice-blends', 'Spices & Masalas', 'spices-pack.jpg'],
  ['combos-gift-boxes', 'Bundles & Giftpacks', 'gifts-pack.jpg'],
  ['dry-fruits', 'Dry Fruits', 'dry-fruits-pack.jpg'],
] as const;

export function ShopCollectionNav() {
  return <nav className="shop-category-nav" aria-label="Shop categories">
    {categories.map(([handle, title, image]) => <NavLink key={title} to={`/collections/${handle}`}>
      <img src={`/categories/hover/${image}`} alt="" width="40" height="40" />{title}
    </NavLink>)}
  </nav>;
}

export function ShopEditorialCard({variant = 'photo'}: {variant?: 'photo' | 'message'}) {
  if (variant === 'message') return <section className="shop-grid-feature shop-grid-message">
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 33c-4-15 8-26 15-22 8-4 20 7 15 22-3 12-10 20-15 20S20 45 17 33Z"/><path d="M32 17v30M24 24l8 7 8-7M25 36l7 6 7-6M7 14l5 4M52 18l5-4"/></svg>
    <p className="shop-feature-eyebrow">A LITTLE CRUNCH. A LOT TO LOVE.</p>
    <h2>Good snacks.<br />Great company.</h2>
    <p>For the desk drawer, the road trip and every little break in between. Find your next SORAA favourite.</p>
    <NavLink to="/collections/flavored-nuts">Explore flavoured nuts</NavLink>
  </section>;
  return <section className="shop-grid-feature shop-grid-photo">
    <img src="/feel-good/breakfast-mixes.png" alt="A woman pouring SORAA Morning Energy Breakfast Mix into a bowl" loading="lazy" width="1122" height="1402" />
    <div><p className="shop-feature-eyebrow">MAKE ROOM FOR THE GOOD STUFF</p><h2>Stock up. Snack happy.</h2><p>Your favourite bites, ready for every little break.</p><NavLink to="/collections/best-sellers">Explore best sellers</NavLink></div>
  </section>;
}
