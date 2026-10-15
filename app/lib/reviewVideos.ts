// Map a Shopify product handle to its actual customer review video.
// Local videos belong in public/videos/ and use a /videos/... URL here.
export const reviewVideos: Record<string, {src: string; poster?: string; captions?: string}> = {
  'peri-peri-roasted-cashews': {
    src: '/videos/peri-peri-review.mp4',
    poster: '/videos/peri-peri-review.jpg',
  },
  'date-bites-jar': {
    src: '/videos/date-bites-review.mp4',
    poster: '/videos/date-bites-review.jpg',
  },
  'antioxidant-berry-blast-mix': {
    src: '/videos/berry-blast-review.mp4',
    poster: '/videos/berry-blast-review.jpg',
  },
};
