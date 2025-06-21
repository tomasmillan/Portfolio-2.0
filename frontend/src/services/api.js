// src/services/api.js
// No necesitas importar flattenStrapiItem si está definido en el mismo archivo

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || "https://portfolio-20-production-96a6.up.railway.app";

// --- START: flattenStrapiItem function (MOVED/UPDATED HERE) ---
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
        alternativeText: imageData.alternativeText || ''
      };
    } else {
      flatItem.coverImage = null; // No hay datos de imagen válidos
    }
  } else {
    flatItem.coverImage = null; // No hay coverImage o no tiene 'data'
  }


  // --- Manejo de mediaFiles (Campo con múltiples archivos) ---
  if (flatItem.mediaFiles && flatItem.mediaFiles.data) {
    flatItem.mediaFiles = flatItem.mediaFiles.data.map(fileData => {
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
          alternativeText: fileData.alternativeText || ''
        };
      }
      return null;
    }).filter(Boolean); // Filtrar cualquier entrada nula
  } else {
    flatItem.mediaFiles = []; // No hay mediaFiles o no tiene 'data'
  }

  // --- Manejo del campo 'author' si lo tienes ---
  // Asegúrate de que tu modelo de Strapi tenga una relación 'author'
  // y que esté populada en tus queries (ver fetchData)
  if (flatItem.author && flatItem.author.data && flatItem.author.data.attributes) {
    flatItem.author = {
      id: flatItem.author.data.id,
      ...flatItem.author.data.attributes,
    };
  } else {
    flatItem.author = null; // O un valor predeterminado si no hay autor
  }

  // --- Manejo de la descripción (rich text) ---
  // Si tu campo de descripción es un 'Rich Text' en Strapi,
  // por defecto, la API lo devuelve como un array de objetos (Block Content).
  // Si no usas @strapi/blocks-react-renderer en el frontend,
  // el componente de detalle lo manejará como texto plano si es array.
  // Si en Strapi lo configuras para que devuelva Markdown o HTML, entonces sería un string aquí.
  // Por ahora, se pasa tal cual viene de la API.

  return flatItem;
};
// --- END: flattenStrapiItem function ---


const fetchData = async (endpoint, options = {}) => {
  // Asegúrate de que 'coverImage', 'mediaFiles', y 'author' estén populados
  const defaultPopulate = 'populate=coverImage,mediaFiles,author';
  const query = options.query ? `${defaultPopulate}&${options.query}` : defaultPopulate;

  const url = `${STRAPI_API_URL}/api/${endpoint}?${query}`;
  console.log("Fetching from URL:", url); // Depuración de la URL de la API

  try {
    const response = await fetch(url);
    if (!response.ok) {
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

export const getPortfolios = async (options = {}) => {
  try {
    const { sort } = options;
    const queryParts = [];
    if (sort) {
      queryParts.push(`sort[0]=${sort}`);
    }
    const query = queryParts.length > 0 ? queryParts.join('&') : '';

    const response = await fetchData("portfolios", { query: query });
    if (response && Array.isArray(response.data)) {
      return response.data.map(item => flattenStrapiItem(item)).filter(Boolean);
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