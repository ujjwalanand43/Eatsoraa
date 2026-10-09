import {useRef, type ReactNode} from 'react';
import {ButtonIcon} from './ButtonIcon';

export function CategorySlider({children}: {children: ReactNode}) {
  const track = useRef<HTMLDivElement>(null);
  const destination = useRef<number | null>(null);
  function move(direction: number) {
    const rail = track.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    if (!cards.length) return;
    // Layout offsets stay exact even while a hovered card is rotated.
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    const end = rail.scrollWidth - rail.clientWidth;
    const current = destination.current ?? rail.scrollLeft;
    const target = direction > 0 && current >= end - 2 ? 0
      : direction < 0 && current <= 2 ? end
      : Math.max(0, Math.min(end, (Math.round(current / step) + direction) * step));
    destination.current = target;
    rail.scrollTo({left: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  return (
    <div className="category-slider">
      <div ref={track} className="category-feature" aria-label="Shop categories"
        onTouchStart={() => { destination.current = null; }}
        onWheel={() => { destination.current = null; }}
        onScroll={() => {
          if (track.current && destination.current !== null && Math.abs(track.current.scrollLeft - destination.current) < 2) destination.current = null;
        }}
      >{children}</div>
      <button type="button" className="category-slider-arrow category-slider-arrow--prev" onClick={() => move(-1)} aria-label="Previous categories"><ButtonIcon name="left" /></button>
      <button type="button" className="category-slider-arrow category-slider-arrow--next" onClick={() => move(1)} aria-label="Next categories"><ButtonIcon name="right" /></button>
    </div>
  );
}
