import imageUrlBuilder from '@sanity/image-url';
import client from './sanityClient';

const builder = imageUrlBuilder(client);

export default function urlFor(source) {
  return builder.image(source);
}
