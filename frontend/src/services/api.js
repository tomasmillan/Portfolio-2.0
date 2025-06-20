// src/services/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";

// Función genérica para obtener entradas de una colección
const getEntries = async (endpoint, populate = "") => {
  try {
    const response = await axios.get(`${API_URL}/api/${endpoint}?${populate}`);
    return response.data.data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Función para obtener todos los posts
export const getPosts = async () => getEntries("posts");

// Función para obtener todos los podcasts
export const getPodcasts = async () => getEntries("podcasts");

// Función para obtener todos los portfolios
export const getPortfolios = async () => getEntries("portfolios");

// Función para obtener los últimos 3 posts (ejemplo)
export const getLatestPosts = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/posts?sort=createdAt:desc&pagination[limit]=3&populate=*`
    );
    return response.data.data.map((item) => {
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null,
      };
    });
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
};

// Función para obtener los últimos 3 podcasts
export const getLatestPodcasts = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/podcasts?sort=createdAt:desc&pagination[limit]=3&populate=*`
    );
    return response.data.data.map((item) => {
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null,
      };
    });
  } catch (error) {
    console.error("Error fetching latest podcasts:", error);
    return [];
  }
};

// Función para obtener los últimos 3 portfolios
export const getLatestPortfolios = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/portfolios?sort=createdAt:desc&pagination[limit]=3&populate=*`
    );
    return response.data.data.map((item) => {
      const attributes = item.attributes;
      return {
        id: item.id,
        ...attributes,
        coverImage: attributes.coverImage?.data?.attributes || null,
      };
    });
  } catch (error) {
    console.error("Error fetching latest portfolios:", error);
    return [];
  }
};

// ***** FUNCIÓN CLAVE PARA PortfolioDetail *****
export const getPortfolioBySlug = async (slug) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/portfolios?filters[slug][$eq]=${slug}&populate=*`
    );

    const data = res.data?.data;
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`No portfolio found with slug: ${slug} from API.`);
      return null;
    }

    const item = data[0];
    const attributes = item.attributes || item; // Fallback por si 'attributes' no existe

    const flattenedPortfolio = {
      id: item.id,
      ...attributes,
      coverImage: attributes.coverImage?.data?.attributes || null,
      mediaFiles: Array.isArray(attributes.mediaFiles?.data)
        ? attributes.mediaFiles.data
            .map((f) => (f.attributes ? { id: f.id, ...f.attributes } : null))
            .filter(Boolean) // Elimina cualquier 'null' resultante
        : [],
    };

    console.log("Final Flattened Portfolio (from api.js):", flattenedPortfolio);
    return flattenedPortfolio;
  } catch (error) {
    console.error(`Error fetching portfolio with slug ${slug}:`, error);
    return null;
  }
};

// Función para obtener un post por slug
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

// Función para obtener un podcast por slug
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