// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

/**
 * Helper function to safely flatten a single Strapi item.
 * It expects 'item' to have an 'id' and 'attributes' property.
 * Handles nested 'coverImage' and 'mediaFiles' with optional chaining.
 * @param {object} item - The raw Strapi item object ({ id, attributes: {...} }).
 * @returns {object|null} The flattened item or null if the input is invalid.
 */
const flattenStrapiItem = (item) => {
  // Defensive check: Ensure item and item.attributes exist
  if (!item || typeof item.id === 'undefined' || !item.attributes) {
    console.warn("flattenStrapiItem: Invalid Strapi item provided, returning null.", item);
    return null; // Return null for invalid items
  }

  const attributes = item.attributes;

  const flattened = {
    id: item.id, // Always include the ID from the top level
    ...attributes, // Spread all direct attributes
    // Safely flatten coverImage using optional chaining
    coverImage: attributes.coverImage?.data?.attributes || null,
    // Safely flatten mediaFiles array using optional chaining and map/filter
    mediaFiles: Array.isArray(attributes.mediaFiles?.data)
      ? attributes.mediaFiles.data
          .map((fileItem) => {
            // Ensure each fileItem and its attributes exist
            if (fileItem && fileItem.attributes) {
              return { id: fileItem.id, ...fileItem.attributes };
            }
            console.warn("flattenStrapiItem: Invalid mediaFile item found, skipping.", fileItem);
            return null; // Return null for invalid file entries
          })
          .filter(Boolean) // Filter out any nulls resulting from invalid file entries
      : [], // Ensure it's an empty array if no media files data or not an array
  };
  return flattened;
};

/**
 * Generic function to fetch entries from a collection.
 * Includes populate=* by default for common use cases.
 * @param {string} endpoint - The API endpoint (e.g., "posts", "portfolios").
 * @param {string} queryString - Optional query string parameters (e.g., filters, sort, pagination).
 * @returns {Array} An array of flattened items.
 */
const getEntries = async (endpoint, queryString = "") => {
  try {
    const url = `${API_URL}/api/${endpoint}?populate=*${queryString ? `&${queryString}` : ''}`;
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);

    if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.warn(`getEntries: No valid data array found for ${endpoint}.`, response.data);
        return [];
    }
    // Map and flatten each item, then filter out any nulls if flattenStrapiItem returned null
    const flattenedData = response.data.data.map(flattenStrapiItem).filter(Boolean);
    console.log(`getEntries: Fetched and flattened ${flattenedData.length} items for ${endpoint}.`);
    return flattenedData;
  } catch (error) {
    console.error(`getEntries: Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Functions to get all posts, podcasts, portfolios (general list)
export const getPosts = async () => getEntries("posts");
export const getPodcasts = async () => getEntries("podcasts");
export const getPortfolios = async () => getEntries("portfolios");


// Function to get the latest X entries for lists (e.g., homepage)
export const getLatestEntries = async (endpoint, limit = 3) => {
  // Use getEntries with specific sorting and pagination
  return getEntries(endpoint, `sort=createdAt:desc&pagination[limit]=${limit}`);
};

export const getLatestPosts = async () => getLatestEntries("posts");
export const getLatestPodcasts = async () => getLatestEntries("podcasts");
export const getLatestPortfolios = async () => getLatestEntries("portfolios"); // THIS IS THE ONE CAUSING THE ERROR! It will now use the robust getEntries.


/**
 * Function to fetch a single item by slug.
 * @param {string} endpoint - The API endpoint (e.g., "portfolios", "posts").
 * @param {string} slug - The slug of the item to fetch.
 * @returns {object|null} The flattened item or null if not found/error.
 */
const getSingleEntryBySlug = async (endpoint, slug) => {
  try {
    const url = `${API_URL}/api/${endpoint}?filters[slug][$eq]=${slug}&populate=*`;
    console.log(`Fetching single entry from: ${url}`);
    const res = await axios.get(url);

    const data = res.data?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`getSingleEntryBySlug: No ${endpoint} found with slug: ${slug} from API response.`, res.data);
      return null;
    }

    // Flatten the single item
    const item = data[0];
    const flattenedItem = flattenStrapiItem(item);
    
    // Log the final flattened item for debugging
    console.log(`getSingleEntryBySlug: Final Flattened ${endpoint} for slug ${slug}:`, flattenedItem);
    return flattenedItem;

  } catch (error) {
    console.error(`getSingleEntryBySlug: Error fetching ${endpoint} with slug ${slug}:`, error);
    return null;
  }
};

export const getPortfolioBySlug = async (slug) => getSingleEntryBySlug("portfolios", slug);
export const getPostBySlug = async (slug) => getSingleEntryBySlug("posts", slug);
export const getPodcastBySlug = async (slug) => getSingleEntryBySlug("podcasts", slug);