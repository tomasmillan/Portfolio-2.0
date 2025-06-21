// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

/**
 * Helper function to safely flatten a single Strapi item,
 * handling both wrapped ({id, attributes: {...}}) and already-flattened ({id, ...attributes}) formats.
 * @param {object} item - The raw or partially flattened Strapi item object.
 * @returns {object|null} The fully flattened item or null if invalid.
 */
const flattenStrapiItem = (item) => {
  // Debugging logs to understand the input 'item' structure
  console.log("flattenStrapiItem: Debugging input item:", item);
  console.log("flattenStrapiItem: Debugging item.id:", item?.id);
  console.log("flattenStrapiItem: Debugging item.attributes:", item?.attributes);

  // Validate basic structure: must have an 'id'
  if (!item || typeof item.id === 'undefined') {
    console.warn("flattenStrapiItem: Invalid Strapi item provided (missing item or ID), returning null.", item);
    return null;
  }

  let finalAttributes = {};

  // Check if it's the standard Strapi wrapped format {id, attributes: {...}}
  if (item.attributes && typeof item.attributes === 'object') {
    finalAttributes = item.attributes;
  } else {
    // Assume it's already flattened and the top-level properties ARE the attributes
    console.warn("flattenStrapiItem: Item appears to be already flattened. Using top-level properties as attributes.", item);
    finalAttributes = item; // Use the item itself as the attributes
  }

  // Ensure attributes is at least an empty object for safe property access
  if (typeof finalAttributes !== 'object' || finalAttributes === null) {
      finalAttributes = {};
  }


  const flattened = {
    id: item.id, // Always take ID from the top level
    ...finalAttributes, // Spread the determined attributes
    // Safely flatten coverImage from finalAttributes
    coverImage: finalAttributes.coverImage?.data?.attributes || null,
    // Safely flatten mediaFiles array from finalAttributes
    mediaFiles: Array.isArray(finalAttributes.mediaFiles?.data)
      ? finalAttributes.mediaFiles.data
          .map((fileItem) => {
            if (fileItem && fileItem.attributes) {
              return { id: fileItem.id, ...fileItem.attributes };
            }
            console.warn("flattenStrapiItem: Invalid mediaFile item found, skipping.", fileItem);
            return null;
          })
          .filter(Boolean)
      : [],
  };
  
  // Clean up potential duplicate ID if finalAttributes was 'item' itself
  if (flattened.attributes) { // If original item had .attributes, remove it from flattened
    delete flattened.attributes;
  }
  if (flattened.id && finalAttributes.id === flattened.id && Object.keys(finalAttributes).includes('id')) {
    delete finalAttributes.id; // Prevent spreading duplicate 'id' if 'item' was used directly
  }


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
  return getEntries(endpoint, `sort=createdAt:desc&pagination[limit]=${limit}`);
};

export const getLatestPosts = async () => getLatestEntries("posts");
export const getLatestPodcasts = async () => getLatestEntries("podcasts");
export const getLatestPortfolios = async () => getLatestEntries("portfolios");


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
    if (!data) { // Could be single object or array
        console.warn(`getSingleEntryBySlug: No data found for ${endpoint} with slug: ${slug} from API response.`, res.data);
        return null;
    }

    let itemToFlatten = null;
    if (Array.isArray(data) && data.length > 0) {
        itemToFlatten = data[0]; // If it's an array, take the first item
    } else if (typeof data === 'object' && data !== null) {
        itemToFlatten = data; // If it's a single object
    }

    if (!itemToFlatten) {
        console.warn(`getSingleEntryBySlug: Could not determine item to flatten for slug: ${slug}.`, data);
        return null;
    }

    const flattenedItem = flattenStrapiItem(itemToFlatten);
    
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