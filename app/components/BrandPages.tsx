import {Link} from 'react-router';

const products = [
  'Roasted Nuts',
  'Flavoured cashews & almonds',
  'Dry fruits',
  'Date bites',
  'Seed mixes',
  'Trail mixes',
  'Everyday healthy snack packs',
  'Grab-and-go mini packs',
];

const promises = [
  ['Taste first', 'Because better-for-you should still taste amazing.'],
  [
    'Premium Quality',
    'Carefully selected ingredients and consistent standards.',
  ],
  ['Modern Design', 'Packaging that feels fresh, clean, and premium.'],
  ['Convenience', 'Easy formats for everyday snacking.'],
  ['Trust', 'Products made with care, clarity, and attention to detail.'],
];

export function AboutSoraaPage() {
  return (
    <div className="brand-page about-soraa-page">
      <section className="brand-page-hero">
        <div>
          <p className="brand-page-kicker">OUR STORY</p>
          <h1>
            Better snacks for
            <span>real life.</span>
          </h1>
          <p>
            SORAA was created with one simple thought: why should healthy
            snacking feel like a compromise?
          </p>
          <Link to="/collections/all">Meet the snack shelf</Link>
        </div>
        <img
          src="/hero-snack-range.png"
          alt="A colourful range of SORAA snacks"
        />
      </section>

      <section className="brand-page-story brand-page-shell">
        <div>
          <p className="brand-page-kicker">WHY SORAA</p>
          <h2>Made for a new generation of snackers.</h2>
        </div>
        <div className="brand-page-prose">
          <p>
            For years, dry fruits and healthy snacks have either looked too
            traditional, tasted too plain, or felt disconnected from how people
            actually snack today. We wanted to change that.
          </p>
          <p>
            From work breaks and college bags to gym days, road trips, gifting
            moments and late-night cravings, SORAA is designed to fit into real
            life. Our products are easy to pick, easy to carry and easy to love.
          </p>
        </div>
      </section>

      <section className="brand-page-products brand-page-shell">
        <p className="brand-page-kicker">WHAT WE MAKE</p>
        <h2>Feel-good snacks, made better.</h2>
        <div className="brand-page-product-grid">
          {products.map((product, index) => (
            <article key={product}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{product}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-page-belief">
        <div className="brand-page-shell">
          <p className="brand-page-kicker">OUR PHILOSOPHY</p>
          <h2>
            Better ingredients. <span>Better flavours.</span> Better snacking.
          </h2>
          <p>
            No boring flavours. No outdated packaging. No compromise on quality.
            We make better choices easier and more enjoyable.
          </p>
        </div>
      </section>

      <section className="brand-page-shell brand-page-generation">
        <img
          src="/lifestyle-scenes.png"
          alt="SORAA snacks made for everyday life"
        />
        <div>
          <p className="brand-page-kicker">BUILT FOR YOU</p>
          <h2>SORAA is for people who are always moving.</h2>
          <ul>
            <li>For the ones who snack between meetings.</li>
            <li>For the ones who always keep something in their bag.</li>
            <li>For the ones who want flavour without the fuss.</li>
            <li>For the ones who want healthy to look good too.</li>
          </ul>
        </div>
      </section>

      <section className="brand-page-shell brand-page-promise">
        <p className="brand-page-kicker">OUR PRODUCT PROMISE</p>
        <h2>Five things every SORAA pack should deliver.</h2>
        <div>
          {promises.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-page-closing">
        <p>WELCOME TO SORAA</p>
        <h2>The future of snacking is here.</h2>
        <Link to="/collections/all">See you in your bag tomorrow</Link>
      </section>
    </div>
  );
}

const marketStats = [
  ['India Snacks Market', 'USD 63.01B', '2024', 'USD 94.17B projected by 2034'],
  ['Healthy Snacks India', 'USD 3.13B', '2025', 'USD 4.77B projected by 2034'],
  ['Dried Fruits & Nuts', 'USD 2.24B', '2025', 'USD 3.93B projected by 2034'],
  [
    'Quick Commerce India',
    '₹64,000 Cr',
    'FY25',
    'Expected to nearly triple by FY28',
  ],
];

const investorSections = [
  {
    kicker: 'WHY SORAA?',
    title: 'Not another dry fruit brand.',
    copy: 'SORAA is building a snack brand that feels fresh, international, fun, premium and made for today.',
    items: [
      'Premium nuts, dry fruits, seeds, berries and dates',
      'Bold flavours made for repeat snacking',
      'Modern Gen-Z packaging',
      'Grab-and-go mini packs',
      'Gifting-friendly products',
      'Built for D2C, retail, events and quick commerce',
    ],
  },
  {
    kicker: 'OUR MOMENTUM',
    title: 'Small packs. Big plans.',
    copy: 'SORAA is being built with a strong focus on product, packaging, community and distribution.',
    items: [
      'Building a premium product and packaging system',
      'Growing the SORAA community',
      'Planning tasting drops and feedback rounds',
      'Preparing event snack-bar activations',
      'Growing retail, D2C, gifting and quick-commerce channels',
    ],
  },
  {
    kicker: 'BUILT TO SCALE',
    title: 'Designed for shelf, screen and snack bags.',
    copy: 'Our products are being designed for multiple channels from day one—easy to discover, easy to buy and easy to reorder.',
    items: [
      'D2C and social commerce',
      'Quick commerce and modern trade',
      'Corporate gifting and office snacking',
      'Events, exhibitions, cafés and HORECA',
    ],
  },
  {
    kicker: "WHAT'S NEXT",
    title: 'More flavours. More drops. More SORAA.',
    copy: 'The near-term roadmap is focused on growing distribution, feedback-led products and a community around better snacking.',
    items: [
      'Launch new snack drops and gifting formats',
      'Run tasting and feedback rounds',
      'Build retail and distribution conversations',
      'Prepare quick-commerce-ready SKUs',
    ],
  },
];

export function InvestorHubPage() {
  return (
    <div className="brand-page investor-page">
      <section className="investor-hero">
        <div className="brand-page-shell">
          <p className="brand-page-kicker">THE SORAA GROWTH STORY</p>
          <h1>
            India is snacking differently.
            <span>SORAA is built for what&apos;s next.</span>
          </h1>
          <p>
            SORAA is a modern snacking brand for the new generation—premium
            nuts, dry fruits, date bites, seed mixes, trail mixes and
            grab-and-go packs that are bold, clean and never boring.
          </p>
          <Link to="/pages/contact">Connect with us</Link>
        </div>
      </section>

      <section className="brand-page-shell investor-market">
        <p className="brand-page-kicker">MARKET SNAPSHOT</p>
        <h2>The snack shelf is getting a glow-up.</h2>
        <p>
          SORAA sits at the intersection of modern snacks, healthy snacking, dry
          fruits and nuts, gifting and quick commerce.
        </p>
        <div className="investor-stats">
          {marketStats.map(([name, value, period, outlook]) => (
            <article key={name}>
              <p>{name}</p>
              <strong>{value}</strong>
              <small>{period}</small>
              <span>{outlook}</span>
            </article>
          ))}
        </div>
        <small>
          Sources: Expert Market Research, IMARC Group and CareEdge Advisory.
        </small>
      </section>

      <section className="brand-page-shell investor-grid">
        {investorSections.map((section, index) => (
          <article
            key={section.kicker}
            className={`investor-card investor-card-${index + 1}`}
          >
            <p className="brand-page-kicker">{section.kicker}</p>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="brand-page-shell investor-founder">
        <div>
          <p className="brand-page-kicker">FOUNDER NOTE</p>
          <h2>Built from the ground up.</h2>
        </div>
        <blockquote>
          “Better snacks should not be boring. We are bringing together quality
          ingredients, exciting flavours, modern design and real-life
          convenience. We are just getting started.”
          <cite>— Team SORAA</cite>
        </blockquote>
      </section>

      <section className="investor-connect">
        <div>
          <p className="brand-page-kicker">CONNECT WITH US</p>
          <h2>Interested in the SORAA journey?</h2>
          <p>
            We welcome conversations around retail, strategic opportunities,
            collaborations, growth and brand partnerships.
          </p>
        </div>
        <Link to="/pages/contact">Contact SORAA</Link>
      </section>

      <section className="brand-page-shell investor-disclaimer">
        <h2>Disclaimer</h2>
        <p>
          This page is for general informational purposes only and does not
          constitute an offer to sell or a solicitation to buy securities or
          investment products. Market figures are based on third-party reports
          and should be reviewed periodically.
        </p>
      </section>
    </div>
  );
}

const factories = [
  {
    code: 'SG',
    name: 'Shreem Global Spice and Nuts Private Limited',
    address:
      'G-10, Sector-3, Noida, Gautam Buddha Nagar, Uttar Pradesh – 201301, India',
    license: '12724999000802',
  },
  {
    code: 'DE',
    name: 'Devdutt Exports Bharat Pvt. Ltd.',
    address:
      'B-4, Patparganj Industrial Area, FIE Complex, Delhi – 110092, India',
    license: '13323999000464',
  },
  {
    code: 'AA',
    name: 'Ahaar Consumer Products Pvt Ltd',
    address: '528, 529, Rai Industrial Area, HSIIDC, Haryana – 131029, India',
    license: '10820020000161',
  },
  {
    code: 'NM',
    name: 'Numix Industries Pvt. Ltd.',
    address:
      'Plot no. 6, Himalayan Food Park, Mahuakhera Ganj, Kashipur, Udham Singh Nagar, Uttarakhand – 244713',
    license: '10020012000634',
  },
  {
    code: 'FK',
    name: 'Food King Impex Pvt Ltd',
    address: '524, 525, Rai Industrial Area, HSIIDC, Haryana – 131029, India',
    license: '10020012000634',
  },
  {
    code: 'KB',
    name: 'KBB Nuts Pvt Ltd',
    address: 'B-57, Lawrence Road, Industrial Area, New Delhi – 110035, India',
    license: '10013011001246',
  },
];

export function FactoryLocatorPage() {
  return (
    <div className="brand-page utility-brand-page">
      <section className="utility-page-hero">
        <div className="brand-page-shell">
          <p className="brand-page-kicker">WHERE SORAA IS MADE</p>
          <h1>Factory Locator</h1>
          <p>Our manufacturing partners and their food-safety credentials.</p>
        </div>
      </section>
      <section className="brand-page-shell factory-grid">
        {factories.map((factory) => (
          <article key={factory.code}>
            <span>{factory.code}</span>
            <h2>{factory.name}</h2>
            <p>{factory.address}</p>
            <small>FSSAI Licence No.</small>
            <strong>{factory.license}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}

const labProducts = [
  ['5-in-1 Roasted Super Seed Mix', 'Seed Mix'],
  ['7-in-1 Superfood Trail Mix', 'Trail Mix'],
  ['Antioxidant Berry Blast Mix', 'Trail Mix'],
  ['Artisanal Kadak Chai Masala', 'Chai Masala'],
  ['Authentic Chettinad Meat Masala', 'Meat Masala'],
  ['Cheese & Jalapeno Cashews', 'Flavoured Cashews'],
  ['Date Bites', 'Date Snacks'],
  ['Date Bites Jar', 'Date Snacks'],
  ['Espresso Almond & Date Energy Mix', 'Energy Mix'],
  ['Himalayan Pink Salt Roasted Pistachios', 'Flavoured Pistachios'],
  ['Jumbo Medjool Dates', 'Medjool Dates'],
  ['Lakadong Turmeric Powder', 'Turmeric Powder'],
  ['Morning Energy Breakfast Mix', 'Breakfast Mix'],
  ['Peri-Peri Roasted Cashews', 'Flavoured Cashews'],
  ['Premium Afghan Anjeer (Figs)', 'Dried Figs'],
  ['Premium Walnut Kernels (Akhrot)', 'Walnut Kernels'],
  ['Premium Kalmi Fard Dates', 'Dates'],
  ['Roasted & Salted Pumpkin Seeds', 'Roasted Seeds'],
  ['Royal Awadhi Biryani Masala', 'Biryani Masala'],
  ['Seedless Long Green Raisins', 'Raisins'],
  ['Smoked BBQ Almonds', 'Flavoured Almonds'],
  ['Southern Pepper & Sea Salt Cashews', 'Flavoured Cashews'],
  ['Spicy Peri-Peri Party Mix', 'Party Mix'],
];

export function LabReportsPage() {
  return (
    <div className="brand-page utility-brand-page">
      <section className="utility-page-hero utility-page-hero-green">
        <div className="brand-page-shell">
          <p className="brand-page-kicker">TRANSPARENCY YOU CAN TRUST</p>
          <h1>Lab Reports</h1>
          <p>
            Every listed product is independently tested for quality, safety and
            transparency. Reports will appear here as they are published.
          </p>
        </div>
      </section>
      <section className="brand-page-shell lab-report-list">
        <div className="lab-report-row lab-report-head">
          <span>Product name</span>
          <span>Category</span>
          <span>Lab report</span>
        </div>
        {labProducts.map(([name, category]) => (
          <div className="lab-report-row" key={name}>
            <strong>{name}</strong>
            <span>{category}</span>
            <span className="report-pending">Coming soon</span>
          </div>
        ))}
      </section>
    </div>
  );
}

const partnershipTypes = [
  'Retail partnerships',
  'Modern trade',
  'Quick commerce',
  'Corporate gifting',
  'Bulk snack packs',
  'Event stalls and exhibitions',
  'Café and office snack supply',
  'Influencer collaborations',
  'Brand partnerships',
];

export function ContactSoraaPage() {
  return (
    <div className="brand-page contact-page">
      <section className="contact-hero">
        <div className="brand-page-shell">
          <p className="brand-page-kicker">LET&apos;S TALK SNACKS</p>
          <h1>Welcome! How can we help you?</h1>
          <div className="contact-actions">
            <a
              href="https://wa.me/919667761803"
              target="_blank"
              rel="noreferrer"
            >
              Start WhatsApp chat
            </a>
            <a href="mailto:we@eatsoraa.com">Send an email</a>
          </div>
        </div>
      </section>

      <section className="brand-page-shell contact-details">
        <article>
          <p className="brand-page-kicker">WHATSAPP / CALL</p>
          <a href="tel:+919667761803">+91 96677 61803</a>
        </article>
        <article>
          <p className="brand-page-kicker">EMAIL</p>
          <a href="mailto:we@eatsoraa.com">we@eatsoraa.com</a>
        </article>
        <article>
          <p className="brand-page-kicker">INSTAGRAM</p>
          <a
            href="https://www.instagram.com/eat_soraa"
            target="_blank"
            rel="noreferrer"
          >
            @eat_soraa
          </a>
        </article>
      </section>

      <section className="brand-page-shell contact-partners">
        <div>
          <p className="brand-page-kicker">WANT TO WORK WITH SORAA?</p>
          <h2>We are open to conversations.</h2>
          <p>
            For bulk orders, retail enquiries, collaborations and event
            partnerships, mention your city and requirement so our team can
            respond faster.
          </p>
        </div>
        <ul>
          {partnershipTypes.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </section>

      <section className="contact-feedback">
        <p>TRIED SORAA?</p>
        <h2>Tell us what you think.</h2>
        <p>
          Your feedback helps us build better snacks, flavours and experiences.
        </p>
        <a href="mailto:we@eatsoraa.com?subject=SORAA%20Feedback">
          We are listening
        </a>
      </section>
    </div>
  );
}
