import {useEffect} from 'react';
import {Link, useFetcher} from 'react-router';
import type {ProductFragment} from 'storefrontapi.generated';
import type {loader as blogLoader} from '~/routes/blogs.$blogHandle._index';
import {HomeDiscovery} from './HomeDiscovery';

export function ProductWorld({product}: {product: ProductFragment}) {
  const lifestyle = product.images.nodes[2] || product.images.nodes[0];
  return <section className="pdp-world" aria-labelledby="pdp-world-title">
    <h2 id="pdp-world-title"><span>SORAA</span> WORLD</h2>
    <div className="pdp-world-grid">
      <div className="pdp-world-tall">{lifestyle && <img src={lifestyle.url} alt={lifestyle.altText || product.title} loading="lazy" />}</div>
      <div className="pdp-world-message"><small>GOOD SNACKS. BETTER DAYS.</small><h3>Big flavour.<br />Little everyday joys.</h3><Link to="/collections/all">Find your favourite ↗</Link></div>
      <img className="pdp-world-photo" src="/hero-snack-better.jpg" alt="SORAA Date Bites for a snack break" loading="lazy" />
      <div className="pdp-world-wide"><small>MAKE TIME FOR THE GOOD STUFF</small><h3>Work breaks.<br />Road trips. Your everyday.</h3><p>A little SORAA goes a long way.</p></div>
      <div className="pdp-world-end"><img src="/hero-grab-snack.jpg" alt="SORAA snack packs" loading="lazy" /><h3>Keep a little<br />crunch close.</h3><Link to="/collections/all">Explore the snack shelf →</Link></div>
    </div>
  </section>;
}

export function ProductFaq({product}: {product: ProductFragment}) {
  const questions = [
    [`What is ${product.title}?`, product.description || `Explore ${product.title} from the SORAA range. Find product details and available packs above.`],
    ['Where can I find ingredients and nutrition information?', 'Open the Ingredients and Nutrition facts tabs above. Please check the pack label for the complete ingredient list, allergens and serving information.'],
    ['Which pack sizes can I choose?', 'The available pack options and their current prices are shown beside the product image. Select a pack before adding it to your cart.'],
    ['How should I store this product?', 'Follow the storage instructions printed on your pack, including any guidance after opening and the best-before date.'],
    ['Can I subscribe for regular deliveries?', 'If a subscription is available for your selected pack, the Subscribe & Save panel above shows the delivery frequency and price before you add it.'],
    ['Where can I check delivery and returns?', <span key="policies">Read our <Link to="/policies/shipping-policy">shipping policy</Link> and <Link to="/policies/refund-policy">returns policy</Link> for delivery and refund details.</span>],
  ];
  return <section className="pdp-faq" aria-labelledby="pdp-faq-title">
    <h2 id="pdp-faq-title">Frequently asked questions</h2>
    <div>{questions.map(([question, answer]) => <details key={String(question)}><summary>{question}<span aria-hidden="true">⌄</span></summary><div>{answer}</div></details>)}</div>
  </section>;
}

export function ProductJournal() {
  const {load, data, state} = useFetcher<typeof blogLoader>();
  useEffect(() => { if (!data && state === 'idle') void load('/blogs/news'); }, [data, state, load]);
  return <div className="pdp-journal"><HomeDiscovery journalOnly articles={data?.blog.articles.nodes.slice(0, 6) || []} /></div>;
}
