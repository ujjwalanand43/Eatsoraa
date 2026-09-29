import type {ReactNode} from 'react';

// Add confirmed brand profile URLs here as they become available.
const socials: {name: string; href?: string; icon: ReactNode}[] = [
  {name: 'Instagram', href: 'https://www.instagram.com/eatsoraa/', icon: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>},
  {name: 'LinkedIn', icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m4 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7" cy="7" r=".7" fill="currentColor" stroke="none"/></>},
  {name: 'Snapchat', icon: <path d="M12 3c-3 0-4.5 2.2-4.5 5v2c-.7.1-1.8-.8-2.2 0-.5 1 1.2 1.6 1.8 1.8-.3 2.4-1.7 3.9-4.1 4.8.4 1 1.6 1 2.5 1.2l.6 1.6c2.6-.7 3.2 1.6 5.9 1.6s3.3-2.3 5.9-1.6l.6-1.6c.9-.2 2.1-.2 2.5-1.2-2.4-.9-3.8-2.4-4.1-4.8.6-.2 2.3-.8 1.8-1.8-.4-.8-1.5.1-2.2 0V8C16.5 5.2 15 3 12 3Z"/>},
  {name: 'Facebook', icon: <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-1.5 1.5-1.5H18V2.2L15.3 2C12 2 10 4 10 7v2H7v4h3v8"/>},
  {name: 'Twitter', icon: <path fill="currentColor" stroke="none" d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.2 4.2 0 0 0-7.2 3.8 11.9 11.9 0 0 1-8.6-4.4 4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5c0 2 1.4 3.7 3.3 4.1a4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2.5 19H1a11.9 11.9 0 0 0 18.3-10c0-.2 0-.4-.1-.5A8.5 8.5 0 0 0 22 5.9Z"/>},
  {name: 'YouTube', icon: <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3Z" fill="currentColor" stroke="none"/></>},
];

export function FooterSocials() {
  return <nav className="footer-socials" aria-label="Follow SORAA">
    {socials.map(({name, href, icon}) => {
      const artwork = <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>;
      return href ? <a key={name} data-brand={name.toLowerCase()} href={href} target="_blank" rel="noopener noreferrer" aria-label={`SORAA on ${name}`} title={name}>{artwork}</a> : <span key={name} data-brand={name.toLowerCase()} aria-label={`${name} — coming soon`} title={`${name} — coming soon`} aria-disabled="true">{artwork}</span>;
    })}
  </nav>;
}
