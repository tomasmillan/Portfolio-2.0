// src/services/api.js
import { flattenStrapiItem } from "./utils"; // Asegúrate de importar esto

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || "https://portfolio-20-production-96a6.up.railway.app";

const fetchData = async (endpoint, options = {}) => {
  const defaultPopulate = 'populate=coverImage,mediaFiles,author'; // Asegúrate de incluir author si lo usas
  const query = options.query ? `${defaultPopulate}&${options.query}` : defaultPopulate;

  const url = `${STRAPI_API_URL}/api/${endpoint}?${query}`;
  console.log("Fetching from URL:", url); // Depuración de la URL de la API

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Intenta leer el cuerpo del error si la respuesta no es OK
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.error(`HTTP error! status: ${response.status}`, errorBody);
      throw new Error(`HTTP error! status: ${response.status} - ${errorBody.message || 'Server error'}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// ...

export const getPortfolios = async (options = {}) => {
  try {
    const { sort } = options;
    const queryParts = [];
    if (sort) {
      queryParts.push(`sort[0]=${sort}`);
    }
    const query = queryParts.length > 0 ? queryParts.join('&') : '';

    const response = await fetchData("portfolios", { query: query });
    // Asegúrate de que response.data exista y sea un array
    if (response && Array.isArray(response.data)) {
      return response.data.map(item => flattenStrapiItem(item)).filter(Boolean); // Filtrar nulls
    } else {
      console.warn("getPortfolios received unexpected data structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error in getPortfolios:", error);
    return [];
  }
};

export const getLatestPortfolios = async (limit = 4) => {
  try {
    // Ordenar por fecha de creación descendente y limitar el número de resultados
    const response = await fetchData("portfolios", { query: `sort[0]=createdAt:desc&pagination[limit]=${limit}` });
    if (response && Array.isArray(response.data)) {
      return response.data.map(item => flattenStrapiItem(item)).filter(Boolean);
    } else {
      console.warn("getLatestPortfolios received unexpected data structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error in getLatestPortfolios:", error);
    return [];
  }
};

export const getPortfolioBySlug = async (slug) => {
  try {
    // Usar filters para buscar por slug
    const response = await fetchData("portfolios", { query: `filters[slug][$eq]=${slug}` });
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return flattenStrapiItem(response.data[0]);
    } else {
      console.warn(`No portfolio found for slug: ${slug} or unexpected data structure.`, response);
      return null;
    }
  } catch (error) {
    console.error(`Error in getPortfolioBySlug for slug ${slug}:`, error);
    return null;
  }
};