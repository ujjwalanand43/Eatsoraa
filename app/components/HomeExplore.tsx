import {Link} from 'react-router';

export function HomeExplore() {
  return (
    <section className="home-explore-grid" aria-label="Explore SORAA">
      <Link className="home-explore-card home-explore-shop" to="/collections/all">
        <img src="/feel-good/breakfast-mixes.png" alt="SORAA Morning Energy Breakfast Mix, ready for your next snack break" loading="lazy" width="1122" height="1402" />
        <div className="home-explore-caption"><h2>Shop all SORAA</h2></div>
      </Link>
      <Link className="home-explore-card home-explore-story" to="/pages/about">
        <div className="home-explore-photo"><img src="/hero-snack-range.jpg" alt="Explore the SORAA snack range" loading="lazy" width="2066" height="761" /></div>
        <div className="home-explore-caption"><h2>Our story</h2></div>
      </Link>
      <Link className="home-explore-card home-explore-subscribe" to="/products/morning-energy-breakfast-mix#subscription-heading">
        <div className="home-explore-photo"><img src="/feel-good/best-sellers.png" alt="A SORAA Date Bites snack moment" loading="lazy" width="1122" height="1402" /></div>
        <div className="home-explore-caption"><h2>Subscribe &amp; save</h2></div>
      </Link>
    </section>
  );
}
