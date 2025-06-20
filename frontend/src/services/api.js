// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

// Helper function to flatten a single Strapi item
const flattenStrapiItem = (item) => {
  if (!item || !item.attributes) {
    console.warn("Attempted to flatten an invalid Strapi item:", item);
    return null; // Return null for invalid items
  }

  const attributes = item.attributes;

  const flattened = {
    id: item.id,
    ...attributes,
    // Safely flatten coverImage
    coverImage: attributes.coverImage?.data?.attributes || null,
    // Safely flatten mediaFiles (array)
    mediaFiles: Array.isArray(attributes.mediaFiles?.data)
      ? attributes.mediaFiles.data
          .map((fileItem) => (fileItem?.attributes ? { id: fileItem.id, ...fileItem.attributes } : null))
          .filter(Boolean) // Remove any nulls from the map
      : [], // Ensure it's an empty array if no media files data
  };
  return flattened;
};

// Función genérica para obtener entradas de una colección (listas completas)
export const getEntries = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}?populate=*`); // Added populate=* here too
    if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.warn(`No valid data array found for ${endpoint}`);
        return [];
    }
    // Map and flatten each item
    return response.data.data.map(flattenStrapiItem).filter(Boolean); // Filter out any nulls if flattenStrapiItem returned null
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Función para obtener todos los posts, podcasts, portfolios
export const getPosts = async () => getEntries("posts");
export const getPodcasts = async () => getEntries("podcasts");
export const getPortfolios = async () => getEntries("portfolios");


// Función genérica para obtener las últimas X entradas (para Home)
export const getLatestEntries = async (endpoint, limit = 3) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/${endpoint}?sort=createdAt:desc&pagination[limit]=${limit}&populate=*`
    );
    if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.warn(`No valid data array found for latest ${endpoint}`);
        return [];
    }
    // Map and flatten each item
    return response.data.data.map(flattenStrapiItem).filter(Boolean);
  } catch (error) {
    console.error(`Error fetching latest ${endpoint}:`, error);
    return [];
  }
};

export const getLatestPosts = async () => getLatestEntries("posts");
export const getLatestPodcasts = async () => getLatestEntries("podcasts");
export const getLatestPortfolios = async () => getLatestEntries("portfolios");


// Función para obtener un solo elemento por slug (Post, Podcast, Portfolio)
// Esta es la versión que ya habíamos optimizado para PortfolioDetail
const getSingleEntryBySlug = async (endpoint, slug) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/${endpoint}?filters[slug][$eq]=${slug}&populate=*`
    );

    const data = res.data?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No ${endpoint} found with slug: ${slug} from API response.`);
      return null;
    }

    // Flatten the single item
    const item = data[0];
    const flattenedItem = flattenStrapiItem(item);
    
    // Log the final flattened item for debugging
    console.log(`Final Flattened ${endpoint} (from api.js):`, flattenedItem);
    return flattenedItem;

  } catch (error) {
    console.error(`Error fetching ${endpoint} with slug ${slug}:`, error);
    return null;
  }
};

export const getPortfolioBySlug = async (slug) => getSingleEntryBySlug("portfolios", slug);
export const getPostBySlug = async (slug) => getSingleEntryBySlug("posts", slug);
export const getPodcastBySlug = async (slug) => getSingleEntryBySlug("podcasts", slug);