import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPortfolios } from "../services/api";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for current sort order: default to newest first (createdAt:desc is usually better than id:desc for dates)
  const [sortOrder, setSortOrder] = useState("createdAt:desc"); // Cambiado a 'createdAt:desc' para un ordenamiento más lógico
  const strapiBaseUrl =
    import.meta.env.VITE_STRAPI_API_URL ||
    "https://portfolio-20-production-96a6.up.railway.app";

  console.log("Strapi Base URL:", strapiBaseUrl); // Console log para verificar la URL base

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pasamos el objeto de opciones para el ordenamiento a la función de la API
      const data = await getPortfolios({ sort: sortOrder });
      setPortfolio(data);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Error al cargar los proyectos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [sortOrder]); // Re-ejecuta fetchData solo si sortOrder cambia

  useEffect(() => {
    fetchData(); // Obtención inicial de datos cuando el componente se monta o si fetchData cambia
  }, [fetchData]); // Dependencia en fetchData (que a su vez depende de sortOrder)

  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // Actualiza el estado de sortOrder, lo que dispara fetchData a través de useEffect
  };

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Portfolio</h1>
        <p className="text-lg text-gray-600 mb-8">
          Acá están algunos de mis trabajos recientes en diseño, desarrollo y
          branding digital.
        </p>

        {/* Sorting Dropdown */}
        <div className="mb-12 flex justify-center">
          <label htmlFor="sort-select" className="sr-only">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            className="block w-full max-w-xs p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
            value={sortOrder}
            onChange={handleSortChange}
          >
            {/* Opciones de ordenamiento: 'createdAt' es más preciso para "más recientes" */}
            <option value="createdAt:desc">Más Recientes</option>
            <option value="createdAt:asc">Más Antiguos</option>
            <option value="Title:asc">Título (A-Z)</option>
            <option value="Title:desc">Título (Z-A)</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-8">
            {/* Puedes usar un spinner de DaisyUI o Tailwind CSS */}
            <span className="loading loading-spinner loading-lg text-gray-500"></span>
            <p className="text-gray-600 mt-2">Cargando proyectos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600 font-semibold">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && portfolio.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>No hay proyectos para mostrar.</p>
          </div>
        )}

        {!loading && !error && portfolio.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 w-80 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 duration-200 ease-in-out"
              >
                <Link to={`/portfolio/${item.slug}`} className="block">
                  {item.coverImage && item.coverImage[0] && (
                    // Lógica para construir la URL de la imagen
                    <img
                      src={
                        item.coverImage[0].url.startsWith("http") ||
                        item.coverImage[0].url.startsWith("https")
                          ? item.coverImage[0].url // Si ya es una URL completa (de Cloudinary)
                          : `${strapiBaseUrl}${item.coverImage[0].url}` // Si es una URL relativa (de Strapi local)
                      }
                      alt={`Portada de ${item.Title}`}
                      className="w-full h-44 object-cover rounded mb-3"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.Title}
                  </h2>
                  {item.description?.[0]?.children?.[0]?.text && (
                    <p className="text-gray-500 text-sm mb-2">
                      {/* Mostrar una descripción corta, asegúrate de manejar rich text si es necesario */}
                      {item.description[0].children[0].text.substring(0, 70)}...
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-3">
                    Publicado por: Tomas Millan Lanhozo
                  </p>
                  {item.publicado && (
                    <p className="text-gray-400 text-xs">
                      Fecha: {item.publicado}
                    </p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
