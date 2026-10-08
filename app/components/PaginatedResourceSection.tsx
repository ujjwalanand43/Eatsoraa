import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
  autoLoad = false,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
  autoLoad?: boolean;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  <span aria-hidden="true">↑</span> Load previous
                </span>
              )}
            </PreviousLink>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <AutoLoadNext enabled={autoLoad} isLoading={isLoading} count={nodes.length}>
            <NextLink>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  Load more <span aria-hidden="true">↓</span>
                </span>
              )}
            </NextLink>
            </AutoLoadNext>
          </div>
        );
      }}
    </Pagination>
  );
}

function AutoLoadNext({enabled, isLoading, count, children}: {
  enabled: boolean;
  isLoading: boolean;
  count: number;
  children: React.ReactNode;
}) {
  const target = React.useRef<HTMLDivElement>(null);
  const requested = React.useRef<string | null>(null);
  React.useEffect(() => {
    const node = target.current;
    if (!enabled || !node || isLoading) return;
    const observer = new IntersectionObserver(([entry]) => {
      const link = node.querySelector<HTMLAnchorElement>('a[href]');
      if (!entry.isIntersecting || !link || requested.current === link.href) return;
      requested.current = link.href;
      link.click();
    }, {rootMargin: '0px 0px 450px 0px'});
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, isLoading, count]);
  return <div ref={target} className={enabled ? 'shop-load-more' : undefined} aria-busy={isLoading}>
    {children}
    {enabled && isLoading && <span role="status">Loading more snacks…</span>}
  </div>;
}
