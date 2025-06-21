// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

const flattenStrapiItem = (item) => {
  if (!item || !item.id || !item.attributes) {
    console.warn("Invalid Strapi item received for flattening:", item);
    return null;
  }

  const flatItem = {
    id: item.id,
    ...item.attributes,
  };

  if (flatItem.coverImage && flatItem.coverImage.data) {
    const imageData = Array.isArray(flatItem.coverImage.data)
      ? flatItem.coverImage.data[0]
      : flatItem.coverImage.data;

    if (imageData && imageData.attributes) {
      flatItem.coverImage = {
        id: imageData.id,
        ...imageData.attributes,
      };
    } else if (imageData && imageData.url) {
      flatItem.coverImage = {
        id: imageData.id,
        url: imageData.url,
        alternativeText: imageData.alternativeText || "",
      };
    } else {
      flatItem.coverImage = null;
    }
  } else {
    flatItem.coverImage = null;
  }

  if (flatItem.mediaFiles && flatItem.mediaFiles.data) {
    flatItem.mediaFiles = flatItem.mediaFiles.data
      .map((fileData) => {
        if (fileData && fileData.attributes) {
          return {
            id: fileData.id,
            ...fileData.attributes,
          };
        } else if (fileData && fileData.url) {
          return {
            id: fileData.id,
            url: fileData.url,
            alternativeText: fileData.alternativeText || "",
          };
        }
        return null;
      })
      .filter(Boolean);
  } else {
    flatItem.mediaFiles = [];
  }

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
    flatItem.author = null;
  }
  return flatItem;
};

/**
 * Generic function to fetch entries from a collection.
 * @param {string} endpoint - The API endpoint (e.g., "posts", "portfolios").
 * @param {string} queryString - Optional query string parameters (e.g., filters, sort, pagination, populate).
 * @returns {Array} An array of flattened items.
 */
const getEntries = async (endpoint, queryString = "") => {
  try {
    // Si el queryString ya contiene 'populate', no añadimos el populate=* por defecto.
    // Esto es lo que causaba el 400 Bad Request.
    let fullQueryString = queryString;
    if (!queryString.includes('populate')) {
        fullQueryString = `populate=coverImage,mediaFiles,author${queryString ? `&${queryString}` : ''}`;
        // Si no hay populate en queryString, usamos uno específico que sabemos que necesitamos
    }
    // NOTA: Si necesitas populate=* siempre, puedes simplemente dejar `populate=*` y asegurarte de que ningún otro
    // populate se añada en el `queryString`. La estrategia actual es más específica y robusta.

    const url = `${API_URL}/api/${endpoint}?${fullQueryString}`;
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
    throw error; // Propagar el error para que los componentes puedan manejarlo
  }
};

// Functions to get all posts, podcasts, portfolios (general list)
export const getPosts = async () => getEntries("posts");
export const getPodcasts = async () => getEntries("podcasts");
export const getPortfolios = async () => getEntries("portfolios");

// Function to get the latest X entries for lists (e.g., homepage)
export const getLatestEntries = async (endpoint, limit = 3) => {
  // Aseguramos que la ordenación y el límite se pasen correctamente.
  // getEntries ya añade el populate específico.
  return getEntries(endpoint, `sort[0]=createdAt:desc&pagination[limit]=${limit}`);
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
    // Para un single entry, aseguramos el populate también.
    const url = `${API_URL}/api/${endpoint}?filters[slug][$eq]=${slug}&populate=coverImage,mediaFiles,author`;
    console.log(`Fetching single entry from: ${url}`);
    const res = await axios.get(url);

    const data = res.data?.data;
    if (!data) {
      console.warn(
        `getSingleEntryBySlug: No data found for ${endpoint} with slug: ${slug} from API response.`,
        res.data
      );
      return null;
    }

    let itemToFlatten = null;
    if (Array.isArray(data) && data.length > 0) {
      itemToFlatten = data[0];
    } else if (typeof data === "object" && data !== null) {
      itemToFlatten = data;
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
    throw error; // Propagar el error
  }
};

export const getPortfolioBySlug = async (slug) =>
  getSingleEntryBySlug("portfolios", slug);
export const getPostBySlug = async (slug) =>
  getSingleEntryBySlug("posts", slug);
export const getPodcastBySlug = async (slug) =>
  getSingleEntryBySlug("podcasts", slug);