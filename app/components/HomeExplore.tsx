import {Link} from 'react-router';

export function HomeExplore() {
  return (
    <section className="home-explore-grid" aria-label="Explore SORAA">
      <Link className="home-explore-card home-explore-shop" to="/collections/all">
        <img src="/feel-good/explore-shop.jpg" alt="SORAA Cranberries, Breakfast Mix and Pistachios on a golden background" loading="lazy" width="1122" height="1402" />
        <div className="home-explore-caption"><h2>Shop all SORAA</h2></div>
      </Link>
      <Link className="home-explore-card home-explore-story" to="/pages/about">
        <div className="home-explore-photo"><img src="/feel-good/explore-story.jpg" alt="Six colourful SORAA snack packs against a blue sky" loading="lazy" width="1600" height="589" /></div>
        <div className="home-explore-caption"><h2>Our story</h2></div>
      </Link>
      <Link className="home-explore-card home-explore-subscribe" to="/products/morning-energy-breakfast-mix#subscription-heading">
        <div className="home-explore-photo"><img src="/feel-good/explore-subscribe.jpg" alt="SORAA Dried Whole Cranberries with a bowl of cranberries on a golden background" loading="lazy" width="1600" height="589" /></div>
        <div className="home-explore-caption"><h2>Subscribe &amp; save</h2></div>
      </Link>
    </section>
  );
}
