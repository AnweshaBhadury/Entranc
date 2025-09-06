import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'kn8ctvrb',
  dataset: 'production',
  useCdn: false,          // 🔴 set to false for fresh data
  apiVersion: '2025-09-06',
});
