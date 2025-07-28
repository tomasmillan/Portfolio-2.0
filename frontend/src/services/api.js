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

export const getStrapiMedia = (url) => {
  if (!url) return null;
  // Si la URL ya es absoluta, la devuelve tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Si es relativa, la concatena con la API_URL
  return `${API_URL}${url}`;
};
const flattenStrapiItem = (item) => {

  if (!item || typeof item.id === "undefined") {
    return null;
  }

  let finalAttributes = {};

  if (item.attributes && typeof item.attributes === "object") {
    finalAttributes = item.attributes;
  } else {
    finalAttributes = item;
  }

  if (typeof finalAttributes !== "object" || finalAttributes === null) {
    finalAttributes = {};
  }

  let coverImage = null;
  if (Array.isArray(finalAttributes.coverImage) && finalAttributes.coverImage.length > 0) {
    coverImage = finalAttributes.coverImage[0]; // ya viene como array directo
  } else if (finalAttributes.coverImage?.data?.attributes) {
    coverImage = finalAttributes.coverImage.data.attributes; // formato normal de Strapi
  }

  const mediaFiles = Array.isArray(finalAttributes.mediaFiles?.data)
    ? finalAttributes.mediaFiles.data
        .map((fileItem) => {
          if (fileItem && fileItem.attributes) {
            return { id: fileItem.id, ...fileItem.attributes };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  const flattened = {
    id: item.id,
    ...finalAttributes,
    coverImage,
    mediaFiles,
  };

  // Limpieza adicional, si 'attributes' todavía existe como propiedad superior, elimínala.
  // Esto es para casos donde 'finalAttributes' ya era el objeto raíz de los atributos.
  if (flattened.attributes) {
    delete flattened.attributes;
  }

  if (Object.prototype.hasOwnProperty.call(finalAttributes, 'id') && finalAttributes.id === flattened.id && finalAttributes !== item) {
    delete finalAttributes.id;
  }


  return flattened;
};

/**
 * Generic function to fetch entries from a collection.
 * Includes populate=* by default for common use cases.
 * @param {string} endpoint - The API endpoint (e.g., "posts", "portfolios").
 * @param {object} options - Optional object with query parameters (e.g., { sort: 'field:order', filters: '...' }).
 * @returns {Array} An array of flattened items.
 */
const getEntries = async (endpoint, options = {}) => {
  try {
    let queryString = `populate=*`; // Siempre populate por defecto

    // Si hay una opción de sort, la añadimos
    if (options.sort) {
      queryString += `&sort=${options.sort}`;
    }
    // Si hay filtros, los añadimos. Asumimos que options.filters ya viene formateado para URL.
    // Esto es un simplificación sin 'qs'. Si necesitas filtros complejos, tendrías que construirlos aquí.
    if (options.filters) {
        queryString += `&${options.filters}`; // Asegúrate que esto sea algo como 'filters[slug][$eq]=some-slug'
    }
    // Si hay paginación, la añadimos
    if (options.pagination) {
        // Asumimos options.pagination puede ser un objeto { page: 1, pageSize: 10 }
        // O directamente una string si lo construyes antes.
        // Para este ejemplo, lo simplificamos esperando que sea ya una string si es compleja.
        if (typeof options.pagination === 'string') {
            queryString += `&${options.pagination}`;
        } else if (typeof options.pagination === 'object' && options.pagination !== null) {
            if (options.pagination.limit) {
                queryString += `&pagination[limit]=${options.pagination.limit}`;
            }
            if (options.pagination.page) {
                queryString += `&pagination[page]=${options.pagination.page}`;
            }
            if (options.pagination.start) {
                queryString += `&pagination[start]=${options.pagination.start}`;
            }
            if (options.pagination.offset) {
                queryString += `&pagination[offset]=${options.pagination.offset}`;
            }
        }
    }
if (options.populate && typeof options.populate === 'object') {
        const populateParams = new URLSearchParams();
        for (const key in options.populate) {
            if (options.populate.hasOwnProperty(key)) {
                // Simple case: populate: { gallery: true } -> populate[gallery]=true
                // Nested case: populate: { gallery: { fields: ['url'] }} -> populate[gallery][fields][0]=url
                // Esto requiere una función auxiliar para construir queries complejos,
                // pero para lo básico, si es un objeto simple, funciona.
                populateParams.append(`populate[${key}]`, JSON.stringify(options.populate[key]));
            }
        }
        // Esto sobrescribiría el populate=* si ya existe.
        // Para combinar, tendrías que ser más cuidadoso o solo usar populate específico.
        queryString = `${populateParams.toString()}`; // Reemplaza si es más específico
    }
    const url = `${API_URL}/api/${endpoint}?${queryString}`;
    const response = await axios.get(url);

    if (!response.data?.data || !Array.isArray(response.data.data)) {
    
      return [];
    }
    const flattenedData = response.data.data.map(flattenStrapiItem).filter(Boolean);
    
    return flattenedData;
  } catch (error) {
    console.error(`getEntries: Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Functions to get all posts, podcasts, portfolios (general list)
// Estas funciones ahora pueden aceptar opciones
export const getPosts = async (options = {}) => getEntries("posts", options);
export const getPodcasts = async (options = {}) => getEntries("podcasts", options);
// *** CAMBIO CLAVE AQUÍ: getPortfolios ahora acepta opciones ***
export const getPortfolios = async (options = {}) => getEntries("portfolios", options);


// Function to get the latest X entries for lists (e.g., homepage)
export const getLatestEntries = async (endpoint, limit = 4) => {
  // Ahora pasamos las opciones como un objeto a getEntries
  return getEntries(endpoint, {
    sort: "createdAt:desc",
    pagination: { limit: limit }, // Pasamos la paginación como objeto
  });
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
    // getEntries puede manejar esto ahora, aunque se podría optimizar para un solo resultado.
    // Para simplificar y usar la misma base:
    const data = await getEntries(endpoint, {
      filters: `filters[slug][$eq]=${slug}`, // Construimos el filtro como string para 'getEntries'
      // No necesitamos populate aquí si getEntries ya tiene populate=* por defecto,
      // pero si necesitas populate específico para el detalle, lo añadirías aquí.
      // Por ejemplo, para galería que NO es cubierta por populate=*
       populate: { // Esto es un placeholder si necesitas poblar algo específico que no sea coverImage o mediaFiles
         gallery: { // Suponiendo que 'gallery' es un campo de Strapi que contiene multiples imágenes
           fields: ["url", "alternativeText"],
         },
       },
    });


    if (data && data.length > 0) {
      return data[0]; // getEntries ya devuelve un array de aplanados, tomamos el primero
    }
    // console.warn(`getSingleEntryBySlug: No data found for ${endpoint} with slug: ${slug}`); // Desactivar
    return null;
  } catch (error) {
    console.error(`getSingleEntryBySlug: Error fetching ${endpoint} with slug ${slug}:`, error);
    return null;
  }
};

export const getPortfolioBySlug = async (slug) => getSingleEntryBySlug("portfolios", slug);
export const getPostBySlug = async (slug) => getSingleEntryBySlug("posts", slug);
export const getPodcastBySlug = async (slug) => getSingleEntryBySlug("podcasts", slug);