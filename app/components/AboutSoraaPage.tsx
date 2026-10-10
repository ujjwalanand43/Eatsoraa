import {Link} from 'react-router';
import './AboutSoraaPage.css';

const chapters = [
  {
    label: 'THE IDEA', title: 'Better snacks. No compromise.',
    copy: 'SORAA started with a simple thought: why should better snacking feel like a compromise? We wanted to bring a fresh perspective to nuts, dry fruits and everyday snacks—with flavour at the heart of it all.',
    left: '/feel-good/about-founder-1.jpg', leftAlt: 'SORAA founder seated at an office desk',
    right: '/feel-good/about-founder-2.jpg', rightAlt: 'SORAA founder seated on a sofa',
  },
];

export function AboutSoraaPage() {
  return <div className="soraa-about-story">
    <section className="about-team-banner" aria-labelledby="about-story-title">
      <h1 id="about-story-title" className="sr-only">About SORAA — Good snacks. Better days.</h1>
      <img src="/about-team-banner.jpg" alt="Good snacks. Better days. SORAA brings together great ingredients, bold flavours and convenient packs to make better everyday snacking exciting. Backed by years of food expertise, we’re here for your desk breaks, road trips and everything in between." width="1600" height="711" fetchPriority="high" style={{display: 'block', width: '100%', height: 'auto'}} />
    </section>
    <div className="about-story-chapters">
      {chapters.map((chapter, index) => <section className={`about-story-chapter${index === 1 ? ' about-story-chapter-single' : ''}`} key={chapter.label} aria-labelledby={`about-chapter-${index}`}>
        {index === 0 && <figure className="about-story-photo about-story-photo-left"><img src={chapter.left} alt={chapter.leftAlt} loading="lazy" width="600" height="600" /></figure>}
        <div className="about-story-chapter-copy"><p className="about-story-kicker">0{index + 1} / {chapter.label}</p><h2 id={`about-chapter-${index}`}>{chapter.title}</h2><p>{chapter.copy}</p></div>
        {index === 0 && <figure className="about-story-photo about-story-photo-right"><img src={chapter.right} alt={chapter.rightAlt} loading="lazy" width="600" height="600" /></figure>}
      </section>)}
    </div>
    <section className="about-story-flavour" aria-labelledby="about-flavour-title">
      <div className="about-story-flavour-image"><img src="/feel-good/about-snack-friends.jpg" alt="A woman and man holding SORAA Peri-Peri Cashews and BBQ Almonds beneath a blue sky" loading="lazy" width="1122" height="1402" /></div>
      <div className="about-story-flavour-copy"><p className="about-story-kicker">FEEL-GOOD SNACKS, MADE BETTER.</p><h2 id="about-flavour-title">Big on flavour.<br />Made for<br />real life.</h2><p>From something crunchy to something sweet, there’s a SORAA for your kind of break. Explore nuts, fruits, seeds and flavour-packed mixes—and find the favourites you’ll always want within reach.</p><Link to="/collections/all">Find your favourite <span aria-hidden="true">→</span></Link></div>
    </section>
  </div>;
}
