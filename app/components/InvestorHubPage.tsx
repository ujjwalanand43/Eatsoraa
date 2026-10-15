import {Link} from 'react-router';

const markets = [
  ['India snacks market', '$63.01B', '2024 market size', '$94.17B projected by 2034'],
  ['Healthy snacks India', '$3.13B', '2025 market size', '$4.77B projected by 2034'],
  ['Dried fruits & nuts', '$2.24B', '2025 market size', '$3.93B projected by 2034'],
  ['Quick commerce India', '₹64K Cr', 'FY25 market estimate', 'Expected to nearly triple by FY28'],
];
const reasons = [
  ['Premium ingredients', 'Nuts, seeds, berries, dates and thoughtfully curated mixes.'],
  ['Flavour first', 'Exciting flavours made for everyday cravings.'],
  ['Built for Gen Z', 'A bold identity and packaging that stands out.'],
  ['Made for real life', 'Convenient formats for work, travel, gifting and everyday moments.'],
];
const momentum = [
  ['Product & packaging development', 'Premium positioning, convenient formats and recognisable design.'],
  ['Community & brand discovery', 'Creators, sampling, tasting experiences and feedback.'],
  ['Digital commerce', 'D2C, marketplaces and social-led discovery.'],
  ['Distribution expansion', 'Retail, gifting and quick-commerce opportunities.'],
];
const channels = [
  ['D2C & social', 'Direct shopping and digital brand building.'],
  ['Quick commerce', 'Convenient, discovery-friendly product formats.'],
  ['Corporate gifting', 'Curated hampers and office snack occasions.'],
  ['Retail & events', 'Physical discovery, sampling and partnerships.'],
];
const roadmap = [
  ['More flavours', 'Explore new snacks and gifting formats.'],
  ['Customer feedback', 'Tasting sessions and feedback-led product development.'],
  ['More places to snack', 'Grow retail conversations and prepare new channel-ready SKUs.'],
];

function Points({items}: {items: string[][]}) {
  return <div className="ih-points">{items.map(([title, copy], index) => <article key={title}>
    <span className="ih-number">{String(index + 1).padStart(2, '0')}</span>
    <h3>{title}</h3><p>{copy}</p>
  </article>)}</div>;
}

export function InvestorHubPage() {
  return <div className="investor-hub">
    <section className="ih-hero">
      <div className="ih-wrap ih-hero-grid">
        <div className="ih-hero-copy">
          <p className="ih-eyebrow">Investor Hub</p>
          <h1>Good snacks.<br /><span>Bigger possibilities.</span></h1>
          <p>We’re building the next generation of snacking — with bold flavours, premium ingredients and a brand made for the way India lives today.</p>
          <a className="ih-button" href="#investor-opportunity">Explore the opportunity <span aria-hidden="true">↗</span></a>
        </div>
        <img className="ih-hero-image" src="/investor-hub.png" alt="SORAA nuts and snack mixes arranged on stone display blocks" fetchPriority="high" width="2066" height="761" />
      </div>
    </section>

    <section id="investor-opportunity" className="ih-wrap ih-section ih-market">
      <div className="ih-heading-row"><div><p className="ih-eyebrow">01. The opportunity</p><h2>A massive market.<br /><span>A brighter tomorrow.</span></h2></div>
        <p>India’s snacking category is evolving, with consumers seeking healthier, tastier and more convenient options. SORAA sits at the intersection of premium snacking, wellness and lifestyle.</p></div>
      <div className="ih-markets">{markets.map(([name, value, period, outlook]) => <article key={name}><h3>{name}</h3><strong>{value}</strong><p>{period}</p><div className="ih-stat-line" aria-hidden="true" /><p>{outlook}</p></article>)}</div>
      <p className="ih-sources">Market estimates: Expert Market Research, IMARC Group and CareEdge Advisory.</p>
    </section>

    <section className="ih-why ih-section"><div className="ih-wrap">
      <div className="ih-heading-row"><div><p className="ih-eyebrow">02. Why SORAA</p><h2>Not just snacks.<br /><span>A new standard.</span></h2></div><p>We combine premium ingredients with modern packaging, bold flavours and convenient formats to make everyday snacking more exciting.</p></div>
      <Points items={reasons} />
    </div></section>

    <section className="ih-wrap ih-section">
      <div className="ih-momentum"><div><p className="ih-eyebrow">03. Our momentum</p><h2>Real progress.<br /><span>Bigger plans.</span></h2><p>From product development to community building, we’re laying a strong foundation for long-term growth.</p></div><img src="/feel-good/lifestyle-work.jpg" alt="SORAA cashews alongside coffee during a work break" loading="lazy" width="1200" height="1200" /></div>
      <Points items={momentum} />
    </section>

    <section className="ih-distribution ih-section"><div className="ih-wrap ih-distribution-grid"><div><p className="ih-eyebrow">04. Distribution strategy</p><h2>One brand.<br /><span>Everywhere.</span></h2><p>Designed for shelf, screen, office desks, gifting moments and snack bags.</p></div><Points items={channels} /></div></section>

    <section className="ih-wrap ih-section ih-next"><div><p className="ih-eyebrow">05. What’s next</p><h2>The next chapter<br />is <span>just beginning.</span></h2></div><div className="ih-roadmap">{roadmap.map(([title, copy]) => <article key={title}><span aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="ih-note"><img src="/feel-good/social-date-bites.jpg" alt="SORAA date bites shared in everyday moments" loading="lazy" width="1200" height="1500" /><div><p className="ih-eyebrow">06. A note from SORAA</p><h2>Better snacks<br />shouldn’t be <span>boring.</span></h2><p>We are bringing together quality ingredients, exciting flavours, modern design and real-life convenience. We are just getting started.</p><p className="ih-signature">— Team SORAA</p></div></section>

    <section className="ih-connect ih-section"><div className="ih-wrap ih-heading-row"><div><p className="ih-eyebrow">07. Let’s build what’s next</p><h2>Partner with a<br />brighter tomorrow.</h2></div><div><p>Interested in SORAA’s growth journey? We’re open to conversations around strategic opportunities, retail partnerships and the future of snacking.</p><Link className="ih-button" to="/pages/contact">Connect with Team SORAA <span aria-hidden="true">↗</span></Link></div></div></section>
    <p className="ih-wrap ih-disclaimer">For general information only. This page does not constitute an offer to sell or a solicitation to buy securities. Market figures are third-party estimates.</p>
  </div>;
}
