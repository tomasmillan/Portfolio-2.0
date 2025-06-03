import axios from "axios";

const API_URL = "http://localhost:1337/api"; // Cambiar en producción

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts?populate=*`); 
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPodcasts = async () => {
  try {
    const response = await axios.get(`${API_URL}/podcasts?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};

export const getPortfolio = async () => {
  try {
    const response = await axios.get(`${API_URL}/portfolios?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
};

export const getPostBySlug = async (slug) => {
  try {
      const response = await fetch(`http://localhost:1337/api/posts?filters[slug][$eq]=${slug}&populate=*`); // Cambio aquí: /api/posts
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
      const response = await fetch(`http://localhost:1337/api/podcasts?filters[slug][$eq]=${slug}&populate=*`);
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
      const response = await fetch(`http://localhost:1337/api/portfolios?filters[slug][$eq]=${slug}&populate=*`); // Cambio aquí: /api/posts
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

export const getLatestPosts = async (limit = 3) => {
  try {
      const response = await fetch(`http://localhost:1337/api/posts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
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
      const response = await fetch(`http://localhost:1337/api/podcasts?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
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
      const response = await fetch(`http://localhost:1337/api/portfolios?sort=publishedAt:desc&pagination[limit]=${limit}&populate=*`);
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