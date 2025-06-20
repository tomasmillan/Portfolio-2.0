// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

// Generic function to fetch entries from a collection
const getEntries = async (endpoint, populate = "") => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}?${populate}`);
    // Flatten attributes for general entries too, assuming similar structure
    return response.data.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Functions to get all posts, podcasts, portfolios (general list)
export const getPosts = async () => getEntries("posts");
export const getPodcasts = async () => getEntries("podcasts");
export const getPortfolios = async () => getEntries("portfolios");


// Functions to get latest entries with populate
const getLatestEntries = async (endpoint) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/${endpoint}?sort=createdAt:desc&pagination[limit]=3&populate=*`
    );
    return response.data.data.map((item) => {
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null, // Flatten coverImage
      };
    });
  } catch (error) {
    console.error(`Error fetching latest ${endpoint}:`, error);
    return [];
  }
};

export const getLatestPosts = async () => getLatestEntries("posts");
export const getLatestPodcasts = async () => getLatestEntries("podcasts");
export const getLatestPortfolios = async () => getLatestEntries("portfolios");


// ***** KEY FUNCTION FOR PortfolioDetail (Your optimized version) *****
export const getPortfolioBySlug = async (slug) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/portfolios?filters[slug][$eq]=${slug}&populate=*`
    );

    const data = res.data?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No portfolio found with slug: ${slug} from API response.`);
      return null;
    }

    const item = data[0];
    // This fallback is generally for cases where attributes might be missing,
    // but with Strapi's default structure, item.attributes should always exist if data exists.
    const attributes = item.attributes || item;

    const flattenedPortfolio = {
      id: item.id,
      ...attributes, // Spread direct attributes (Title, slug, embedCode, etc.)
      coverImage: attributes.coverImage?.data?.attributes || null, // Safely flatten coverImage
      mediaFiles: Array.isArray(attributes.mediaFiles?.data) // Safely flatten mediaFiles array
        ? attributes.mediaFiles.data
            .map((f) => (f.attributes ? { id: f.id, ...f.attributes } : null))
            .filter(Boolean) // Filter out any null entries if an item had no attributes
        : [], // Ensure it's an empty array if no mediaFiles data
    };

    console.log("Final Flattened Portfolio (from api.js):", flattenedPortfolio);
    return flattenedPortfolio;
  } catch (error) {
    console.error(`Error fetching portfolio with slug ${slug}:`, error);
    return null;
  }
};

// Functions to get single post/podcast by slug (similar flattening logic)
export const getPostBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`
    );
    if (response.data.data && response.data.data.length > 0) {
      const item = response.data.data[0];
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
};

export const getPodcastBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/podcasts?filters[slug][$eq]=${slug}&populate=*`
    );
    if (response.data.data && response.data.data.length > 0) {
      const item = response.data.data[0];
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching podcast with slug ${slug}:`, error);
    return null;
  }
};