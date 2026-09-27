import {useEffect, useState} from 'react';

export function CommerceMotion() {
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let noticeTimer = 0;

    const handleClick = (event: MouseEvent) => {
      const source = (
        event.target as Element | null
      )?.closest<HTMLButtonElement>('button');
      if (!source || source.disabled) return;

      const label = `${source.getAttribute('aria-label') ?? ''} ${source.textContent ?? ''}`;
      const form = source.closest('form');
      const isCartAction =
        /\b(add|increase)\b/i.test(label) &&
        (source.classList.contains('add-cart-button') ||
          form?.getAttribute('action')?.includes('/cart') ||
          Boolean(source.closest('.product-purchase')));

      if (!isCartAction) return;

      source.classList.remove('is-cart-clicked');
      void source.offsetWidth;
      source.classList.add('is-cart-clicked');
      window.setTimeout(() => source.classList.remove('is-cart-clicked'), 520);

      const cart = document.querySelector<HTMLElement>('.header-cart-btn');
      if (cart) {
        const start = source.getBoundingClientRect();
        const end = cart.getBoundingClientRect();
        const particle = document.createElement('span');
        particle.className = 'cart-fly-particle';
        particle.setAttribute('aria-hidden', 'true');
        particle.style.left = `${start.left + start.width / 2}px`;
        particle.style.top = `${start.top + start.height / 2}px`;
        document.body.appendChild(particle);
        const dx = end.left + end.width / 2 - (start.left + start.width / 2);
        const dy = end.top + end.height / 2 - (start.top + start.height / 2);

        void particle
          .animate(
            [
              {transform: 'translate(-50%, -50%) scale(1)', opacity: 1},
              {
                transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.22 - 50}px)) scale(.75)`,
                opacity: 0.95,
                offset: 0.55,
              },
              {
                transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.2)`,
                opacity: 0,
              },
            ],
            {duration: 620, easing: 'cubic-bezier(.2,.8,.25,1)'},
          )
          .finished.finally(() => particle.remove());

        window.setTimeout(() => {
          cart.classList.remove('is-cart-bumped');
          void cart.offsetWidth;
          cart.classList.add('is-cart-bumped');
          window.setTimeout(() => cart.classList.remove('is-cart-bumped'), 520);
        }, 500);
      }

      setNotice('Added to cart ✓');
      window.clearTimeout(noticeTimer);
      noticeTimer = window.setTimeout(() => setNotice(''), 1800);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.clearTimeout(noticeTimer);
    };
  }, []);

  return (
    <div
      className={`cart-motion-notice${notice ? ' is-visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {notice}
    </div>
  );
}
