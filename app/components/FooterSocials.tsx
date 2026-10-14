// View boxes remove transparent padding without changing the supplied artwork.
const socials = [
  {name: 'Instagram', brand: 'instagram', href: 'https://www.instagram.com/eat_soraa/', file: 'insta.png', viewBox: '339 339 402 402'},
  {name: 'LinkedIn', brand: 'linkedin', href: 'https://www.linkedin.com/company/eatsoraa', file: 'Linkdin.png', viewBox: '330 348 451 384'},
  {name: 'Pinterest', brand: 'pinterest', href: 'https://pin.it/7raYK98ox', file: '', viewBox: '0 0 24 24'},
  {name: 'Facebook', brand: 'facebook', href: 'https://www.facebook.com/profile.php?id=61593883156667', file: 'facebook.png', viewBox: '353 254 289 609'},
  {name: 'X (Twitter)', brand: 'twitter', href: 'https://x.com/eatsoraa', file: 'twitter.png', viewBox: '337 299 533 544'},
  {name: 'YouTube', brand: 'youtube', href: 'https://www.youtube.com/@eatSoraa', file: 'yt.png', viewBox: '244 476 567 126'},
];

export function FooterSocials() {
  return <nav className="footer-socials" aria-label="Follow SORAA">
    {socials.map(({name, brand, href, file, viewBox}) => {
      const artwork = <svg width={brand === 'youtube' ? 68 : 26} height="26" viewBox={viewBox} aria-hidden="true" focusable="false">
        {brand === 'pinterest' ? <path fill="currentColor" d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1.1.5 2 1.6 2 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.2-4.3-4.2-3 0-4.8 2.2-4.8 4.5 0 .9.3 1.9.8 2.4l.2.5-.3 1c0 .2-.2.3-.4.2-1.3-.6-2.1-2.3-2.1-4.1 0-3.4 2.5-6.4 7-6.4 3.7 0 6.5 2.6 6.5 6.1 0 3.7-2.3 6.7-5.5 6.7-1.1 0-2.1-.6-2.5-1.2l-.7 2.6c-.2.9-.9 1.9-1.3 2.6A10 10 0 1 0 12 2Z" /> : <image href={`/social-icons/${file}`} width="1080" height="1080" />}
      </svg>;
      return href ? <a key={brand} data-brand={brand} href={href} target="_blank" rel="noopener noreferrer" aria-label={`SORAA on ${name}`} title={name}>{artwork}</a> : <span key={brand} data-brand={brand} aria-label={`${name} — coming soon`} title={`${name} — coming soon`} aria-disabled="true">{artwork}</span>;
    })}
  </nav>;
}
