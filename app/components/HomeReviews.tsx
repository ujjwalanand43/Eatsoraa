import {Link} from 'react-router';

const samples = [
  {name: 'Aarav', title: 'My desk-side favourite.', quote: 'A little crunch for those long afternoons. This is the kind of snack I would keep within reach.', image: '/feel-good/breakfast-mixes.png', alt: 'SORAA breakfast mix campaign', tone: 'peach'},
  {name: 'Sana', title: 'A sweeter snack break.', quote: 'Date bites, a cup of coffee and five minutes to myself. A lovely little everyday ritual.', image: '/feel-good/best-sellers.png', alt: 'SORAA Date Bites campaign', tone: 'pink'},
  {name: 'Rohan', title: 'Bring on the crunch.', quote: 'Bold flavours are my thing. These would be coming along for the next road trip.', image: '/feel-good/flavored-nuts.png', alt: 'SORAA roasted cashews campaign', tone: 'orange'},
  {name: 'Neha', title: 'Simple snacking, sorted.', quote: 'A handful of walnuts makes an easy addition to my breakfast bowl or afternoon snack.', image: '/feel-good/dry-fruits.png', alt: 'SORAA walnut kernels campaign', tone: 'green'},
];

export function HomeReviews() {
  return <section className="home-reviews" aria-labelledby="home-reviews-title">
    <header className="home-reviews-heading">
      <p>THE SNACK BREAK DIARIES</p>
      <h2 id="home-reviews-title">Good snacks.<br /><span>Good things to say.</span></h2>
      <small>Preview content — sample reviews for layout, not customer testimonials.</small>
    </header>
    <div className="home-review-mosaic">
      {samples.map((sample, index) => <div className={`home-review-column review-tone-${sample.tone}`} key={sample.name}>
        <div className="home-review-photo"><img src={sample.image} alt={sample.alt} loading="lazy" width="1122" height="1402" /></div>
        <article className="home-review-quote">
          <div className="home-review-stars" aria-label="Sample rating: 5 out of 5">★★★★★</div>
          <h3>{sample.title}</h3>
          <blockquote>{sample.quote}</blockquote>
          <footer><strong>{sample.name}</strong><span>Sample review {index + 1}</span></footer>
        </article>
      </div>)}
    </div>
    <Link className="home-reviews-cta" to="/products/morning-energy-breakfast-mix#customer-reviews">Read product reviews</Link>
    <div className="home-press">
      <div><h3>As seen on</h3><p>Sample publications · placeholders only</p></div>
      <div className="home-press-names" aria-label="Placeholder publication names">
        <span>THE DAILY BITE</span><span>Good Living</span><span>SNACK JOURNAL</span><span>the pantry.</span>
      </div>
    </div>
  </section>;
}
