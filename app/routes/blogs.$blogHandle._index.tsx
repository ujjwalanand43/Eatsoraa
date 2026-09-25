import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.blog.title ?? 'Stories'} | SORAA`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="blog soraa-journal">
      <header className="journal-header">
        <div>
          <p>THE SORAA JOURNAL</p>
          <h1>
            {blog.title}
            <span>.</span>
          </h1>
          <p>
            Fresh reads on mindful snacking, honest ingredients and everyday
            wellness, selected by SORAA.
          </p>
        </div>
        <Link to="/collections/all">
          Shop healthy snacks <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <PaginatedResourceSection<ArticleItemFragment>
        connection={articles}
        ariaLabel={`${blog.title} articles`}
        resourcesClassName="journal-grid"
      >
        {({node: article, index}) => (
          <ArticleItem
            article={article}
            index={index}
            key={article.id}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function ArticleItem({
  article,
  index,
  loading,
}: {
  article: ArticleItemFragment;
  index: number;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  const excerpt = article.contentHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 118);
  return (
    <article
      className={`journal-card journal-card-${(index % 6) + 1}`}
      key={article.id}
    >
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        <div className="journal-card-media">
          {article.image ? (
            <Image
              alt={article.image.altText || article.title}
              data={article.image}
              loading={loading}
              sizes="(min-width: 1000px) 42vw, (min-width: 680px) 50vw, 100vw"
            />
          ) : (
            <span className="journal-card-placeholder" aria-hidden="true">
              S
            </span>
          )}
        </div>
        <div className="journal-card-overlay" />
        <div className="journal-card-copy">
          <p>{article.author?.name || 'SORAA EDIT'}</p>
          <h2>{article.title}</h2>
          {excerpt && (
            <span>
              {excerpt}
              {excerpt.length === 118 ? '…' : ''}
            </span>
          )}
          <footer>
            <small>{publishedAt}</small>
            <b>
              Read story <span aria-hidden="true">↗</span>
            </b>
          </footer>
        </div>
      </Link>
    </article>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
export const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
