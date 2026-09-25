import {useEffect} from 'react';

export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let dispose = () => {};

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        const root = document.querySelector<HTMLElement>('.soraa-home');
        if (!root) return;

        gsap.registerPlugin(ScrollTrigger);
        const animated = new WeakSet<Element>();
        const contexts: Array<ReturnType<typeof gsap.context>> = [];

        const setup = () => {
          const context = gsap.context(() => {
            root
              .querySelectorAll<HTMLElement>(
                '.category-heading-row, .social-header, .collection-showcase > h2, .collection-tabs, .lifestyle-copy, .why-sky-copy, .newsletter-section > *',
              )
              .forEach((element) => {
                if (animated.has(element)) return;
                animated.add(element);
                gsap.fromTo(
                  element,
                  {autoAlpha: 0, y: 34},
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.75,
                    ease: 'power3.out',
                    scrollTrigger: {
                      trigger: element,
                      start: 'top 88%',
                      once: true,
                    },
                  },
                );
              });

            root
              .querySelectorAll<HTMLElement>(
                '.category-grid, .collection-track, .lifestyle-cards',
              )
              .forEach((container) => {
                if (animated.has(container)) return;
                const cards = Array.from(container.children) as HTMLElement[];
                if (!cards.length) return;
                animated.add(container);
                gsap.fromTo(
                  cards,
                  {autoAlpha: 0, y: 30, scale: 0.97},
                  {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.62,
                    stagger: 0.075,
                    ease: 'power3.out',
                    scrollTrigger: {
                      trigger: container,
                      start: 'top 86%',
                      once: true,
                    },
                  },
                );
              });

            const whyArt = root.querySelector<HTMLElement>('.why-sky-art');
            if (whyArt && !animated.has(whyArt)) {
              animated.add(whyArt);
              gsap.fromTo(
                whyArt,
                {yPercent: 5, scale: 1.035},
                {
                  yPercent: -2,
                  scale: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: whyArt,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.7,
                  },
                },
              );
            }
          }, root);
          contexts.push(context);
          ScrollTrigger.refresh();
        };

        const heroTimeline = gsap.timeline({defaults: {ease: 'power3.out'}});
        heroTimeline
          .fromTo(
            root.querySelector('.hero-reference'),
            {autoAlpha: 0, scale: 1.025},
            {autoAlpha: 1, scale: 1, duration: 1},
          )
          .fromTo(
            root.querySelector('.hero-artwork-cta'),
            {autoAlpha: 0, y: 18},
            {autoAlpha: 1, y: 0, duration: 0.55},
            '-=0.4',
          )
          .fromTo(
            root.querySelector('.hero-copy'),
            {autoAlpha: 0, x: -24},
            {autoAlpha: 1, x: 0, duration: 0.7},
            0.15,
          )
          .fromTo(
            root.querySelector('.hero-products'),
            {autoAlpha: 0, x: 28, scale: 0.98},
            {autoAlpha: 1, x: 0, scale: 1, duration: 0.8},
            0.2,
          );

        setup();
        const observer = new MutationObserver(() => setup());
        observer.observe(root, {childList: true, subtree: true});

        dispose = () => {
          observer.disconnect();
          heroTimeline.kill();
          contexts.forEach((context) => context.revert());
        };
      },
    );

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return null;
}
