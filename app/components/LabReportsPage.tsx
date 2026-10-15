import {BtnArrow} from '~/components/BtnArrow';
import {useState} from 'react';

const FSSAI_LICENCE = '12724999000802';
const FOSCOS_URL = 'https://foscos.fssai.gov.in/';

const approach = [
  {title: 'Ingredient Lists', text: 'See what goes into each product.', icon: 'list'},
  {title: 'Nutrition Facts', text: 'Understand what’s in each serving.', icon: 'chart'},
  {title: 'Pack Information', text: 'Storage, weight and label details.', icon: 'box'},
  {title: 'FSSAI Licensed', text: 'Our food business licensing information.', icon: 'shield'},
] as const;

const faqs = [
  {q: 'Is SORAA FSSAI licensed?', a: `Yes. SORAA products are made by an FSSAI-licensed food business. Licence number ${FSSAI_LICENCE} can be verified on the official FoSCoS portal.`},
  {q: 'Where can I find nutrition information?', a: 'On the back of every pack and on each product page under the nutrition details.'},
  {q: 'Are third-party lab reports available?', a: 'Not yet. We don’t currently publish product-specific third-party lab reports on this website. Verified reports may be added here when they are available.'},
  {q: 'How can I ask about a specific product?', a: 'Write to us through the Contact page or at we@eatsoraa.com and our team will help.'},
];

function LrIcon({name}: {name: string}) {
  const paths: Record<string, React.ReactNode> = {
    list: <><path d="M8 4h11v16H5V7z" /><path d="M9 9h7M9 13h7M9 17h4" /></>,
    chart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
    box: <><path d="m12 3 8 4v10l-8 4-8-4V7z" /><path d="m4 7 8 4 8-4M12 11v10" /></>,
    shield: <><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
    leaf: <><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" /><path d="M5 19 14 10" /></>,
    flask: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M7.5 15h9" /></>,
  };
  return <svg className="lr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function LabReportsPage() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(FSSAI_LICENCE).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <div className="lr-page">
      <section className="lr-hero lr-wrap">
        <div className="lr-hero-copy">
          <p className="lr-kicker">QUALITY &amp; TRANSPARENCY</p>
          <h1>The good stuff.<br />No guesswork.</h1>
          <p>Big flavour deserves clear facts. Get to know what goes into every SORAA bite.</p>
          <div className="lr-actions">
            <a className="lr-btn" href="#lr-approach">Explore Ingredients <BtnArrow direction="down" /></a>
          </div>
        </div>
        <div className="lr-hero-art">
          <img className="lr-hero-image" src="/labs/breakfast-mix-hero.jpg" alt="SORAA Morning Energy Breakfast Mix held against a bright orange background" width="1122" height="1402" fetchPriority="high" />
        </div>
      </section>

      <section className="lr-approach lr-wrap" id="lr-approach">
        <div>
          <p className="lr-kicker">01 / OUR APPROACH</p>
          <h2>Snack smart.<br />Know more.</h2>
          <p>We believe good snacking should come with clear information. Here’s what you can explore to know more about our products.</p>
        </div>
        <div className="lr-approach-grid">
          {approach.map((item) => (
            <article key={item.title}>
              <span className="lr-icon-wrap"><LrIcon name={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lr-licence lr-wrap">
        <div>
          <p className="lr-kicker">02 / LICENCE DETAILS</p>
          <h2>Officially<br />licensed.</h2>
          <p>SORAA products are manufactured under India’s Food Safety and Standards Authority (FSSAI) food business licensing framework.</p>
          <div className="lr-licence-card">
            <small>FSSAI LICENCE NUMBER</small>
            <div className="lr-licence-number">
              <strong>{FSSAI_LICENCE}</strong>
              <button type="button" onClick={copy} aria-label="Copy licence number">{copied ? '✓' : '⧉'}</button>
            </div>
            <a className="lr-btn lr-btn--wide" href={FOSCOS_URL} target="_blank" rel="noreferrer">Verify on FSSAI Portal <BtnArrow /></a>
            <p>You can verify the above licence number on the official FoSCoS portal of FSSAI.</p>
          </div>
        </div>
        <div className="lr-licence-art">
          <div className="lr-licence-badge">
            <LrIcon name="shield" />
            <strong>FSSAI Licensed</strong>
            <span>Food Safety and Standards Authority of India</span>
          </div>
          <img src="/labs/our-story.png" alt="A lineup of SORAA snack packs" width="2066" height="761" loading="lazy" />
        </div>
      </section>

      <section className="lr-reports lr-wrap">
        <div className="lr-reports-inner">
          <div>
            <p className="lr-kicker">03 / TRANSPARENCY UPDATE</p>
            <h2>What about lab reports?</h2>
            <p>We don’t currently publish product-specific third-party lab reports on this website. In the meantime, you can refer to the ingredient lists, nutrition declarations and other product information provided on our packaging.</p>
          </div>
          <aside className="lr-note">
            <span className="lr-icon-wrap"><LrIcon name="flask" /></span>
            <strong>Quality documentation updates</strong>
            <p>Verified reports may be added here when available for publication.</p>
          </aside>
        </div>
      </section>

      <section className="lr-faq lr-wrap">
        <p className="lr-kicker">04 / GOOD QUESTIONS</p>
        <h2>Curious? We get it.</h2>
        <div className="lr-faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span aria-hidden="true">+</span></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
