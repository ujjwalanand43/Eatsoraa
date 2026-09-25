export function CartIcon({kind}: {kind: 'leaf' | 'shield' | 'truck' | 'return' | 'smile' | 'trash'}) {
  const paths = {
    leaf: 'M20 3C9 2 3 7 4 14c1 7 13 9 16-11ZM3 22 16 8',
    shield: 'm12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Zm-4 10 3 3 5-6',
    truck: 'M2 4h12v13H2V4Zm12 5h4l4 5v3h-8M7 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm14 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z',
    return: 'M21 10a9 9 0 1 0-1 8M21 3v7h-7',
    smile: 'M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0ZM8 8v2m8-2v2M7 14c2 6 8 6 10 0',
    trash: 'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]} /></svg>;
}

export function CartNuts() {
  return <svg className="cart-banner-nuts" viewBox="0 0 150 115" aria-hidden="true">
    <defs><radialGradient id="cart-almond"><stop stopColor="#bc7339"/><stop offset="1" stopColor="#6b321b"/></radialGradient><radialGradient id="cart-cashew"><stop stopColor="#fff0c5"/><stop offset="1" stopColor="#cba25e"/></radialGradient></defs>
    <g transform="rotate(-28 40 30)"><ellipse cx="40" cy="30" rx="17" ry="29" fill="url(#cart-almond)"/><path d="M34 7q-10 23 4 47M42 5q-5 29 5 48M48 9q2 25 5 34" fill="none" stroke="#d7965b" strokeWidth="2"/></g>
    <path d="M38 67C8 54 4 91 21 100c18 11 38-7 28-17-5-5-11 7-19 1-8-6 16-10 8-17Z" fill="url(#cart-cashew)"/>
    <path d="M99 38c-29-7-30 27-15 33 20 9 36-13 24-19-6-3-8 8-16 4-8-5 15-11 7-18Z" fill="url(#cart-cashew)"/>
    <g transform="rotate(42 94 96)"><ellipse cx="94" cy="96" rx="15" ry="26" fill="url(#cart-almond)"/><path d="M90 74q-7 24 5 42m1-43q-1 25 6 36" fill="none" stroke="#d7965b" strokeWidth="2"/></g>
  </svg>;
}
