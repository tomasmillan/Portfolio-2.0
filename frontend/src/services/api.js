import axios from "axios";

const API_URL = import.meta.env.VITE_STRAPI_BASE_URL || 'https://portfolio-20-production-96a6.up.railway.app'; // Cambiar en producción

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts?populate=*`); 
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPodcasts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/podcasts?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};

export const getPortfolio = async (options = {}) => {
  try {
    let url = `${API_URL}/api/portfolios?populate=*`;

    // Add sorting parameter if provided
    if (options.sort) {
      // Strapi expects sort as ?sort[0]=field:direction or ?sort=field:direction for single sort
      // For simplicity, we'll use the direct sort string if it's simple
      url += `&sort=${options.sort}`;
    }

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
};

export const getPostBySlug = async (slug) => {
  try {
      const response = await fetch(`https://portfolio-20-production-96a6.up.railway.app/api/posts?filters[slug][$eq]=${slug}&populate=*`); // Cambio aquí: /api/posts
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data from API:", data);
      if (data.data && data.data.length > 0) {
          return data.data[0];
      } else {
          return null;
      }
  } catch (error) {
      console.error("Error fetching post:", error);
      return null;
  }
};

export const getPodcastBySlug = async (slug) => {
  try {
      const response = await fetch(`https://portfolio-20-production-96a6.up.railway.app/api/podcasts?filters[slug][$eq]=${slug}&populate=*`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data from API:", data);
      if (data.data && data.data.length > 0) {
          return data.data[0];
      } else {
          return null;
      }
  } catch (error) {
      console.error("Error fetching post:", error);
      return null;
  }
};
export const getPortfolioBySlug = async (slug) => {
  try {
    // This is the correct filter syntax for fetching by slug
    const response = await axios.get(`${API_URL}/api/portfolios?populate=*&sort=createdAt:desc&pagination[limit]=3`);
    
    // IMPORTANT: Return response.data.data which is the array of items
    // If no item is found, response.data.data will be an empty array []
    return response.data.data.map(item => ({
      id: item.id,
      ...item.attributes, // Spread the attributes to get all fields;
    })); 
  } catch (error) {
    console.error(`Error fetching portfolio with slug ${slug}:`, error);
    // It's good practice to re-throw the error so the calling component can catch it
    throw error; 
  }
};

export const getLatestPosts = async (limit = 3) => {
  try {
      const response = await fetch(`https://portfolio-20-production-96a6.up.railway.app/api/posts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
  } catch (error) {
      console.error("Error fetching latest posts:", error);
      return [];
  }
};

export const getLatestPodcasts = async (limit = 3) => {
  try {
      const response = await fetch(`https://portfolio-20-production-96a6.up.railway.app/api/podcasts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
  } catch (error) {
      console.error("Error fetching latest podcasts:", error);
      return [];
  }
};

export const getLatestPortfolios = async (limit = 4) => {
  try {
      const response = await fetch(`https://portfolio-20-production-96a6.up.railway.app/api/portfolios?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      return data.data;
  } catch (error) {
      console.error("Error fetching latest portfolios:", error);
      return [];
  }
};