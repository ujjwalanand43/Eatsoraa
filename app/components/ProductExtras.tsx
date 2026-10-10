import {useEffect} from 'react';
import {Link, useFetcher} from 'react-router';
import type {ProductFragment} from 'storefrontapi.generated';
import type {loader as blogLoader} from '~/routes/blogs.$blogHandle._index';
import {HomeDiscovery} from './HomeDiscovery';

export function ProductWorld() {
  return <section className="pdp-world-banner" aria-label="SORAA World">
    <img src="/soraa-world-banner.jpg" alt="Great ingredients. Big flavour. SORAA brings quality and food expertise to snacks made for your everyday cravings wherever the day takes you." width="2560" height="1138" loading="lazy" style={{display: 'block', width: '100%', height: 'auto'}} />
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
