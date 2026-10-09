// View boxes remove transparent padding without changing the supplied artwork.
const socials = [
  {name: 'Instagram', brand: 'instagram', href: 'https://www.instagram.com/eatsoraa/', file: 'insta.png', viewBox: '339 339 402 402'},
  {name: 'LinkedIn', brand: 'linkedin', href: undefined, file: 'Linkdin.png', viewBox: '330 348 451 384'},
  {name: 'Snapchat', brand: 'snapchat', href: undefined, file: 'SnapChat.png', viewBox: '96 96 377 362'},
  {name: 'Facebook', brand: 'facebook', href: undefined, file: 'facebook.png', viewBox: '353 254 289 609'},
  {name: 'X (Twitter)', brand: 'twitter', href: undefined, file: 'twitter.png', viewBox: '337 299 533 544'},
  {name: 'YouTube', brand: 'youtube', href: undefined, file: 'yt.png', viewBox: '244 476 567 126'},
];

export function FooterSocials() {
  return <nav className="footer-socials" aria-label="Follow SORAA">
    {socials.map(({name, brand, href, file, viewBox}) => {
      const artwork = <svg width={brand === 'youtube' ? 68 : 26} height="26" viewBox={viewBox} aria-hidden="true" focusable="false">
        <image href={`/social-icons/${file}`} width={brand === 'snapchat' ? 569 : 1080} height={brand === 'snapchat' ? 555 : 1080} />
      </svg>;
      return href ? <a key={brand} data-brand={brand} href={href} target="_blank" rel="noopener noreferrer" aria-label={`SORAA on ${name}`} title={name}>{artwork}</a> : <span key={brand} data-brand={brand} aria-label={`${name} — coming soon`} title={`${name} — coming soon`} aria-disabled="true">{artwork}</span>;
    })}
  </nav>;
}
