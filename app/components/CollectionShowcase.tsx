import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import type {HomeCollectionsQuery} from 'storefrontapi.generated';
import {HomeProductCard} from './HomeProductCard';

type Collection = HomeCollectionsQuery['collections']['nodes'][number];

export function CollectionShowcase({collections}: {collections: Collection[]}) {
  const available = collections.filter((collection) => collection.products.nodes.length > 0);
  const [selected, setSelected] = useState<string>();
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({start: true, end: false});
  const active = available.find((collection) => collection.id === selected) ?? available[0];
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
      <h2 id="collections-heading">Shop our <span>collections</span></h2>
      <div className="collection-tabs" aria-label="Choose a collection">
        {available.map((collection) => (
          <button key={collection.id} type="button" aria-pressed={active.id === collection.id} onClick={() => {
            setSelected(collection.id);
            setPosition({start: true, end: false});
            track.current?.scrollTo({left: 0, behavior: 'instant'});
          }}>{collection.title}</button>
        ))}
      </div>
      <Link className="collection-view" to={`/collections/${active.handle}`}>Explore {active.title} <span aria-hidden="true">↗</span></Link>
      <div className="collection-slider">
        <button className="collection-nav collection-prev" type="button" aria-label="Previous collection products" disabled={position.start} onClick={() => move(-1)}>←</button>
        <div key={active.id} ref={track} className="collection-track" role="group" aria-label={`${active.title} products`} onScroll={(event) => {
          const node = event.currentTarget;
          setPosition({start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2});
        }}>
          {active.products.nodes.map((product) => <HomeProductCard key={product.id} product={product} />)}
        </div>
        <button className="collection-nav collection-next" type="button" aria-label="Next collection products" disabled={position.end || active.products.nodes.length < 2} onClick={() => move(1)}>→</button>
      </div>
    </section>
  );
}
