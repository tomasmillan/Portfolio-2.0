import axios from "axios";

const API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ||
  "https://portfolio-20-production-96a6.up.railway.app"; // Cambiar en producción

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts?populate=*`);
    // Considera aplanar aquí también si tus componentes lo necesitan
    return response.data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPodcasts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/podcasts?populate=*`);
    // Considera aplanar aquí también si tus componentes lo necesitan
    return response.data.data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};

export const getPortfolio = async (options = {}) => {
  try {
    let url = `${API_URL}/api/portfolios?populate=*`; // Add sorting parameter if provided

    if (options.sort) {
      url += `&sort=${options.sort}`;
    }

    const response = await axios.get(url);
    // Considera aplanar aquí también si tus componentes lo necesitan
    return response.data.data;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};

// ** CAMBIOS AQUÍ: USAR API_URL **
export const getPostBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${API_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*` // Usar API_URL
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data from API (Post):", data); // Cambiado para diferenciar
    if (data.data && data.data.length > 0) {
      // Aplanar aquí también para consistencia
      const item = data.data[0];
      return {
        id: item.id,
        ...item.attributes,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

// ** CAMBIOS AQUÍ: USAR API_URL **
export const getPodcastBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${API_URL}/api/podcasts?filters[slug][$eq]=${slug}&populate=*` // Usar API_URL
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data from API (Podcast):", data); // Cambiado para diferenciar
    if (data.data && data.data.length > 0) {
      // Aplanar aquí también para consistencia
      const item = data.data[0];
      return {
        id: item.id,
        ...item.attributes,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

// Esta función ya estaba correcta, solo la mantengo por contexto
export const getPortfolioBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/portfolios?filters[slug][$eq]=${slug}&populate=*`
    );
    if (response.data.data && response.data.data.length > 0) {
      const item = response.data.data[0];
      console.log("Data from API (Portfolio):", item); // Cambiado para diferenciar
      return {
        id: item.id,
        ...item.attributes,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching portfolio with slug ${slug}:`, error);
    return null;
  }
};

// ** CAMBIOS AQUÍ: USAR API_URL **
export const getLatestPosts = async (limit = 3) => {
  try {
    const response = await fetch(
      `${API_URL}/api/posts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*` // Usar API_URL
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // Aquí los componentes suelen esperar el array completo sin aplanar
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
};

// ** CAMBIOS AQUÍ: USAR API_URL **
export const getLatestPodcasts = async (limit = 3) => {
  try {
    const response = await fetch(
      `${API_URL}/api/podcasts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*` // Usar API_URL
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // Aquí los componentes suelen esperar el array completo sin aplanar
  } catch (error) {
    console.error("Error fetching latest podcasts:", error);
    return [];
  }
};

// ** CAMBIOS AQUÍ: USAR API_URL **
export const getLatestPortfolios = async (limit = 4) => {
  try {
    const response = await fetch(
      `${API_URL}/api/portfolios?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*` // Usar API_URL
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Latest Portfolios data:", data); // Cambiado para diferenciar
    return data.data; // Aquí los componentes suelen esperar el array completo sin aplanar
  } catch (error) {
    console.error("Error fetching latest portfolios:", error);
    return [];
  }
};
