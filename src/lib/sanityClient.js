// src/lib/sanityClient.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const useCdn = import.meta.env.VITE_SANITY_USE_CDN === 'true';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01';

if (!projectId) {
  // optional warning during dev
  console.warn('VITE_SANITY_PROJECT_ID is not set. Set it in your .env file.');
}

export const client = createClient({
  projectId,
  dataset,
  useCdn,
  apiVersion,
});

const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source);
}

export default client;
