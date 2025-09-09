import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01';
const writeToken = import.meta.env.VITE_SANITY_WRITE_TOKEN;

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken, // ⚠️ frontend exposure, only for dev/testing
  useCdn: false
});

/**
 * Save a contact form submission to Sanity.
 * @param {string} name
 * @param {string} email
 * @param {string} message
 * @returns {Promise<object>} The created Sanity document
 */
export async function submitContact(name, email, message) {
  if (!name || !email || !message) {
    throw new Error("All fields (name, email, message) are required");
  }

  const doc = {
    _type: 'contactSubmit',   // must match schema name
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  try {
    const created = await writeClient.create(doc);
    console.log("Contact form submitted:", created);
    return created;
  } catch (err) {
    console.error("Error submitting contact form:", err);
    throw err;
  }
}
