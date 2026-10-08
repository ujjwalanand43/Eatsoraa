import {ButtonIcon} from './ButtonIcon';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {DEFAULT_GLOBE_LOCATIONS, type GlobeLocation} from '~/lib/orderGlobe';

export function OrderGlobe({locations = []}: {locations?: GlobeLocation[]}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pauseRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const points = [...DEFAULT_GLOBE_LOCATIONS, ...locations];
  const signature = JSON.stringify(points);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let disposed = false;
    let frame = 0;
    let destroy: (() => void) | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    void import('cobe').then(({default: createGlobe}) => {
      if (disposed) return;
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let phi = 0.3;
        let last = 0;
        const globe = createGlobe(element, {
          devicePixelRatio: dpr, width: element.clientWidth, height: element.clientWidth,
          phi, theta: 0.22, dark: 0, diffuse: 1.2, mapSamples: 22000, mapBrightness: 5, mapBaseBrightness: 0,
          baseColor: [0.95, 0.80, 0.64], markerColor: [1, 0.24, 0], glowColor: [1, 0.94, 0.84],
          markers: (JSON.parse(signature) as GlobeLocation[]).map((point) => ({location: point.location, size: 0.035})),
        });
        const resize = new ResizeObserver(() => globe.update({width: element.clientWidth, height: element.clientWidth}));
        resize.observe(element);
        const tick = (now: number) => {
          if (!pauseRef.current && !motion.matches && !document.hidden) phi += Math.min(now - (last || now), 50) * 0.00012;
          last = now;
          globe.update({phi});
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        destroy = () => {resize.disconnect(); globe.destroy();};
      } catch {setUnavailable(true);}
    }).catch(() => {if (!disposed) setUnavailable(true);});
    return () => {disposed = true; cancelAnimationFrame(frame); destroy?.();};
  }, [signature]);

  return <section className="order-globe" aria-labelledby="order-globe-heading">
    <div className="order-globe-copy">
      <span className="order-globe-eyebrow">LITTLE PACKS. BIG CONNECTIONS.</span>
      <h2 id="order-globe-heading">A world of<br /><span>happy snacking.</span></h2>
      <p>From your everyday break to someone’s new favourite. Good snacks bring us a little closer.</p>
      <Link className="order-globe-cta" to="/collections/all">Find your next favourite</Link>
      <div className="order-globe-locations" aria-label="Locations marked on the globe">
        {points.slice(0, 10).map((point, i) => <span key={`${point.label}-${i}`}><i aria-hidden="true" />{point.label}<small>{point.source === 'sample' ? 'Sample order' : 'Order destination'}</small></span>)}
      </div>
      <small className="order-globe-note">{locations.length ? 'Orange dots include recent Shopify order destinations and five sample locations.' : 'Five illustrative order destinations. Sample orders are for demonstration.'}</small>
    </div>
    <div className="order-globe-visual">
      <div className="order-globe-orbit" aria-hidden="true" />
      <canvas ref={canvas} aria-label="Rotating world globe showing snack destinations" role="img" />
      {unavailable && <div className="order-globe-fallback">Good snacks.<br />Everywhere you go.<span>Destination locations are listed alongside.</span></div>}
      <span className="order-globe-caption"><i />THE SORAA CONNECTION</span>
      <button className="order-globe-pause" onClick={() => {pauseRef.current = !paused; setPaused(!paused);}} aria-label={paused ? 'Play globe animation' : 'Pause globe animation'} aria-pressed={paused}><ButtonIcon name={paused ? 'play' : 'pause'} /></button>
    </div>
  </section>;
}
