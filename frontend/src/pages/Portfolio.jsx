import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import { getPortfolio } from "../services/api";
import { Link } from "react-router-dom";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  // State for current sort order: default to newest first (id:desc)
  const [sortOrder, setSortOrder] = useState("id:desc");
  const strapiBaseUrl =
    import.meta.env.VITE_STRAPI_API_URL || "https://portfolio-20-production-96a6.up.railway.app";
console.log(strapiBaseUrl)
  const fetchData = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors
    try {
      // Pass the current sortOrder to the API function
      const data = await getPortfolio({ sort: sortOrder });
      setPortfolio(data);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Error al cargar los proyectos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false); // End loading
    }
  }, [sortOrder]); // Re-run fetchData only if sortOrder changes

  useEffect(() => {
    fetchData(); // Initial fetch when component mounts or sortOrder changes
  }, [fetchData]); // Dependency on fetchData (which depends on sortOrder)

  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // Update sortOrder state, which triggers fetchData via useEffect
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
            <option value="id:desc">Más Recientes (por ID)</option>
            <option value="id:asc">Más Antiguos (por ID)</option>
            <option value="Title:asc">Título (A-Z)</option>
            <option value="Title:desc">Título (Z-A)</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-8">
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
                    <img
                      src={`${strapiBaseUrl}${item.coverImage[0].url}`}
                      alt={`Portada de ${item.Title}`}
                      className="w-full h-44 object-cover rounded mb-3"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.Title}
                  </h2>
                  {item.description?.[0]?.children?.[0]?.text && (
                    <p className="text-gray-500 text-sm mb-2">
                      {item.description[0].children[0].text.substring(0, 70)}...
                    </p>
                  )}
                  {/* Assuming 'Publicado por' and 'publicado' are always present or handled safely */}
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
