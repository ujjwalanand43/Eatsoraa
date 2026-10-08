import {useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {useAnalytics} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {HomeProductsQuery} from 'storefrontapi.generated';

type Product = HomeProductsQuery['products']['nodes'][number];

const COOKIE_KEY = 'soraa-cookie-choice';
const fallbackProducts = [
  {handle: 'morning-energy-breakfast-mix', title: 'Morning Energy Breakfast Mix', featuredImage: {url: '/feel-good/breakfast-mixes.png', altText: 'Morning Energy Breakfast Mix'}},
  {handle: 'date-bites', title: 'Date Bites', featuredImage: {url: '/feel-good/dates-date-bites.png', altText: 'SORAA Date Bites'}},
];

const firstNames = [
  'Aarav', 'Aditi', 'Ananya', 'Arjun', 'Avni', 'Diya', 'Ishaan', 'Kabir',
  'Kavya', 'Meera', 'Mira', 'Neha', 'Prisha', 'Rhea', 'Rohan', 'Sai',
  'Sana', 'Tara', 'Vihaan', 'Zoya',
];

// India currently has 28 states and 8 union territories. Including every one
// keeps the rotating discovery card geographically varied and accurate.
const indianRegions = [
  ['Visakhapatnam', 'Andhra Pradesh'], ['Itanagar', 'Arunachal Pradesh'],
  ['Guwahati', 'Assam'], ['Patna', 'Bihar'], ['Raipur', 'Chhattisgarh'],
  ['Panaji', 'Goa'], ['Ahmedabad', 'Gujarat'], ['Gurugram', 'Haryana'],
  ['Shimla', 'Himachal Pradesh'], ['Ranchi', 'Jharkhand'],
  ['Bengaluru', 'Karnataka'], ['Kochi', 'Kerala'], ['Bhopal', 'Madhya Pradesh'],
  ['Mumbai', 'Maharashtra'], ['Imphal', 'Manipur'], ['Shillong', 'Meghalaya'],
  ['Aizawl', 'Mizoram'], ['Kohima', 'Nagaland'], ['Bhubaneswar', 'Odisha'],
  ['Ludhiana', 'Punjab'], ['Jaipur', 'Rajasthan'], ['Gangtok', 'Sikkim'],
  ['Chennai', 'Tamil Nadu'], ['Hyderabad', 'Telangana'], ['Agartala', 'Tripura'],
  ['Lucknow', 'Uttar Pradesh'], ['Dehradun', 'Uttarakhand'],
  ['Kolkata', 'West Bengal'], ['Port Blair', 'Andaman and Nicobar Islands'],
  ['Chandigarh', 'Chandigarh'], ['Daman', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['New Delhi', 'Delhi'], ['Srinagar', 'Jammu and Kashmir'], ['Leh', 'Ladakh'],
  ['Kavaratti', 'Lakshadweep'], ['Puducherry', 'Puducherry'],
] as const;

function nextRandom(max: number, previous: number) {
  if (max <= 1) return 0;
  let next = Math.floor(Math.random() * max);
  if (next === previous) next = (next + 1) % max;
  return next;
}

function CookieConsent() {
  const {customerPrivacy} = useAnalytics();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(COOKIE_KEY));
  }, []);

  const saveChoice = (accepted: boolean) => {
    const consent = {
      analytics: accepted,
      marketing: accepted,
      preferences: accepted,
      sale_of_data: false,
    };
    customerPrivacy?.setTrackingConsent(consent, (result) => {
      if (result?.error) console.error('Unable to save cookie consent', result.error);
    });
    window.localStorage.setItem(COOKIE_KEY, accepted ? 'accepted' : 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div role="region" className="cookie-consent" aria-label="Cookie preferences">
      <button
        className="cookie-consent-close"
        type="button"
        aria-label="Use necessary cookies only"
        onClick={() => saveChoice(false)}
      >
        ×
      </button>
      <span className="cookie-consent-icon" aria-hidden="true">🍪</span>
      <div>
        <strong>A better browsing bite.</strong>
        <p>
          We use cookies to understand visits and improve your SORAA experience.{' '}
          <Link to="/pages/privacy-policy">Privacy policy</Link>
        </p>
        <div className="cookie-consent-actions">
          <button type="button" onClick={() => saveChoice(false)}>
            Necessary only
          </button>
          <button type="button" onClick={() => saveChoice(true)}>
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductPulse({products}: {products: Product[]}) {
  const usableProducts = useMemo(
    () => {
      const liveProducts = products.filter((product) => Boolean(product.featuredImage?.url));
      return liveProducts.length ? liveProducts : fallbackProducts;
    },
    [products],
  );
  const [productIndex, setProductIndex] = useState(0);
  const [personIndex, setPersonIndex] = useState(0);
  const [regionIndex, setRegionIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: number;
    let nextShowAt = Date.now() + 1500;
    let wasBlocked = false;
    const rotate = () => {
      if (document.hidden || document.querySelector('dialog[open]')) {
        wasBlocked = true;
        setVisible(false);
        return;
      }
      if (wasBlocked) {
        wasBlocked = false;
        nextShowAt = Date.now();
      }
      if (Date.now() < nextShowAt) return;
      nextShowAt = Date.now() + 15000;
      setProductIndex((current) => nextRandom(usableProducts.length, current));
      setPersonIndex((current) => nextRandom(firstNames.length, current));
      setRegionIndex((current) => nextRandom(indianRegions.length, current));
      setVisible(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setVisible(false), 8500);
    };

    const interval = window.setInterval(rotate, 500);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, [usableProducts.length]);

  const product = usableProducts[productIndex % usableProducts.length];
  const [city, region] = indianRegions[regionIndex % indianRegions.length];

  return (
    <div role="region"
      className={`product-pulse${visible ? ' is-visible' : ''}`}
      aria-live="polite"
      aria-label="Sample snack activity"
    >
      <button
        type="button"
        aria-label="Hide snack updates"
        onClick={() => {
          setVisible(false);
        }}
      >
        ×
      </button>
      <Link to={`/products/${product.handle}`} prefetch="intent">
        <img
          src={product.featuredImage!.url}
          alt={product.featuredImage?.altText || product.title}
          width="72"
          height="84"
        />
        <span>
          <small>{firstNames[personIndex]}'s snack pick</small>
          <strong>{product.title}</strong>
          <em>{city}, {region}, India</em>
          <span className="product-pulse-meta">
            <span>Sample activity</span><span>View product →</span>
          </span>
        </span>
      </Link>
      <span className="product-pulse-progress" aria-hidden="true" />
    </div>
  );
}

export function LandingOverlays({products}: {products: Product[]}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Fixed overlays must escape section stacking contexts and animated ancestors.
  if (!mounted) return null;
  return createPortal(
    <>
      <CookieConsent />
      <ProductPulse products={products} />
    </>,
    document.body,
  );
}
