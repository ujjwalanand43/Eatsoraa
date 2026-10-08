const paths = {
  left: 'M20 12H4m7-7-7 7 7 7',
  right: 'M4 12h16m-7-7 7 7-7 7',
  close: 'm6 6 12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  play: 'm8 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
} as const;

/** Shared, font-independent geometry for button controls. */
export function ButtonIcon({name}: {name: keyof typeof paths}) {
  return <svg className="button-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
