import {ButtonIcon} from './ButtonIcon';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import type {HomeCollectionsQuery} from 'storefrontapi.generated';
import {RelatedProductCard} from './RelatedProductCard';

type Collection = HomeCollectionsQuery['collections']['nodes'][number];

export function CollectionShowcase({collections}: {collections: Collection[]}) {
  const available = collections.filter((collection) => collection.products.nodes.length > 0);
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({start: true, end: false});
  const active = available[0];
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const update = () => setPosition({start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2});
    const observer = new ResizeObserver(update);
    observer.observe(node);
    update();
    return () => observer.disconnect();
  }, [active?.id]);
  if (!active) return null;

  function move(direction: number) {
    const node = track.current;
    if (node) node.scrollBy({left: direction * node.clientWidth * 0.8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }

  return (
    <section className="collection-showcase" aria-labelledby="collections-heading">
      <div className="pdp-related">
        <div className="pdp-related-heading">
          <h2 id="collections-heading">Shop our<br /><span>collections.</span></h2>
          <Link className="collection-explore-button" to={`/collections/${active.handle}`}>Explore {active.title.toLowerCase()}</Link>
          <div className="collection-arrow-controls">
            <button type="button" aria-label="Previous collection products" disabled={position.start} onClick={() => move(-1)}><ButtonIcon name="left" /></button>
            <button type="button" aria-label="Next collection products" disabled={position.end || active.products.nodes.length < 2} onClick={() => move(1)}><ButtonIcon name="right" /></button>
          </div>
        </div>
        <div key={active.id} ref={track} className="pdp-related-track" role="group" aria-label={`${active.title} products`} onScroll={(event) => {
          const node = event.currentTarget;
          setPosition({start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2});
        }}>
          {active.products.nodes.map((product) => <RelatedProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
