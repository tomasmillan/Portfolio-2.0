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
  if (!item || !item.id || !item.attributes) {
    console.warn("Invalid Strapi item received for flattening:", item);
    return null;
  }

  const flatItem = {
    id: item.id,
    ...item.attributes,
  };

  // --- Manejo de coverImage ---
  if (flatItem.coverImage && flatItem.coverImage.data) {
    // Si coverImage.data es un array, toma el primer elemento.
    // Si es un objeto, úsalo directamente.
    const imageData = Array.isArray(flatItem.coverImage.data)
      ? flatItem.coverImage.data[0]
      : flatItem.coverImage.data;

    if (imageData && imageData.attributes) {
      // Si el objeto de la imagen tiene 'attributes' (formato típico de Strapi 4 relations)
      flatItem.coverImage = {
        id: imageData.id,
        ...imageData.attributes,
      };
    } else if (imageData && imageData.url) {
      // Si ya es un objeto plano con 'url' (menos común para relaciones, pero para seguridad)
      flatItem.coverImage = {
        id: imageData.id,
        url: imageData.url,
        alternativeText: imageData.alternativeText || "",
      };
    } else {
      flatItem.coverImage = null; // No hay datos de imagen válidos
    }
  } else {
    flatItem.coverImage = null; // No hay coverImage o no tiene 'data'
  }

  // --- Manejo de mediaFiles (Campo con múltiples archivos) ---
  if (flatItem.mediaFiles && flatItem.mediaFiles.data) {
    flatItem.mediaFiles = flatItem.mediaFiles.data
      .map((fileData) => {
        if (fileData && fileData.attributes) {
          // Cada archivo en mediaFiles tendrá 'attributes'
          return {
            id: fileData.id,
            ...fileData.attributes,
          };
        } else if (fileData && fileData.url) {
          // Como fallback, si ya es un objeto plano con 'url'
          return {
            id: fileData.id,
            url: fileData.url,
            alternativeText: fileData.alternativeText || "",
          };
        }
        return null;
      })
      .filter(Boolean); // Filtrar cualquier entrada nula
  } else {
    flatItem.mediaFiles = []; // No hay mediaFiles o no tiene 'data'
  }

  // --- Manejo del campo 'author' si lo tienes ---
  // Asegúrate de que tu modelo de Strapi tenga una relación 'author'
  // y que esté populada en tus queries (ver fetchData)
  if (
    flatItem.author &&
    flatItem.author.data &&
    flatItem.author.data.attributes
  ) {
    flatItem.author = {
      id: flatItem.author.data.id,
      ...flatItem.author.data.attributes,
    };
  } else {
    flatItem.author = null; // O un valor predeterminado si no hay autor
  }
    return flatItem;
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
    const url = `${API_URL}/api/${endpoint}?populate=*${
      queryString ? `&${queryString}` : ""
    }`;
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);

    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.warn(
        `getEntries: No valid data array found for ${endpoint}.`,
        response.data
      );
      return [];
    }
    const flattenedData = response.data.data
      .map(flattenStrapiItem)
      .filter(Boolean);
    console.log(
      `getEntries: Fetched and flattened ${flattenedData.length} items for ${endpoint}.`
    );
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
    if (!data) {
      // Could be single object or array
      console.warn(
        `getSingleEntryBySlug: No data found for ${endpoint} with slug: ${slug} from API response.`,
        res.data
      );
      return null;
    }

    let itemToFlatten = null;
    if (Array.isArray(data) && data.length > 0) {
      itemToFlatten = data[0]; // If it's an array, take the first item
    } else if (typeof data === "object" && data !== null) {
      itemToFlatten = data; // If it's a single object
    }

    if (!itemToFlatten) {
      console.warn(
        `getSingleEntryBySlug: Could not determine item to flatten for slug: ${slug}.`,
        data
      );
      return null;
    }

    const flattenedItem = flattenStrapiItem(itemToFlatten);

    console.log(
      `getSingleEntryBySlug: Final Flattened ${endpoint} for slug ${slug}:`,
      flattenedItem
    );
    return flattenedItem;
  } catch (error) {
    console.error(
      `getSingleEntryBySlug: Error fetching ${endpoint} with slug ${slug}:`,
      error
    );
    return null;
  }
};

export const getPortfolioBySlug = async (slug) =>
  getSingleEntryBySlug("portfolios", slug);
export const getPostBySlug = async (slug) =>
  getSingleEntryBySlug("posts", slug);
export const getPodcastBySlug = async (slug) =>
  getSingleEntryBySlug("podcasts", slug);
