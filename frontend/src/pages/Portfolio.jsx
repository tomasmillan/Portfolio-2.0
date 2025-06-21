// src/pages/Portfolio.jsx
import React, { useEffect, useState } from "react"; // Eliminamos useCallback si no es estrictamente necesario
import { Link } from "react-router-dom";
import { getPortfolios } from "../services/api"; // Asegúrate que la ruta es correcta

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("createdAt:desc"); // Default: más recientes primero

  // Un solo useEffect para manejar la obtención de datos y sus dependencias
  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones de estado en componentes desmontados

    const fetchData = async () => {
      setLoading(true); // Iniciar carga
      setError(null); // Limpiar errores anteriores
      try {
        // Pasamos el objeto de opciones para el ordenamiento a la función de la API
        const data = await getPortfolios({ sort: sortOrder });
        if (isMounted) {
          setPortfolio(data);
          console.log("Datos de portfolios recibidos y procesados para Portfolio Page:", data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching portfolio:", err);
          setError("Error al cargar los proyectos. Por favor, inténtalo de nuevo.");
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Finalizar carga
        }
      }
    };

    fetchData(); // Llamar a la función de obtención de datos

    // Función de limpieza para desmontaje del componente
    return () => {
      isMounted = false;
    };
  }, [sortOrder]); // <-- Dependencia clave: re-ejecutar cuando sortOrder cambia

  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // Actualiza el estado de sortOrder, lo que dispara el useEffect
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
            <option value="createdAt:desc">Más Recientes</option>
            <option value="createdAt:asc">Más Antiguos</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {portfolio.map((item) => (
              <Link
                to={`/portfolio/${item.slug}`}
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 duration-200 ease-in-out w-full max-w-xs flex flex-col overflow-hidden"
              >
                {item.coverImage && item.coverImage.url ? (
                  <img
                    src={item.coverImage.url}
                    alt={item.coverImage.alternativeText || item.Title || "Imagen de Portfolio"}
                    className="w-full h-44 object-cover rounded-t-xl mb-3"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-xl mb-3">
                    No hay imagen disponible
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {item.Title || "Título Desconocido"}
                  </h2>
                  {item.description && Array.isArray(item.description) && item.description[0]?.children?.[0]?.text && (
                    <p className="text-gray-500 text-sm mb-2 flex-grow line-clamp-3">
                      {item.description[0].children[0].text}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-auto">
                    Publicado por: {item.publishedBy || "Tomas Millan Lanhozo"}
                  </p>
                  {item.createdAt && (
                    <p className="text-gray-400 text-xs">
                      Fecha: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;