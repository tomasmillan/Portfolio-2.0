import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolios } from "../services/api";

function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Considera si realmente necesitas esto para la URL base si todas tus imágenes son de Cloudinary
  // const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL || "https://portfolio-20-production-96a6.up.railway.app";

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const data = await getPortfolios();
        if (Array.isArray(data)) {
          setPortfolios(data);
        } else {
          setPortfolios([]);
          setError("La API no devolvió una lista válida de portfolios.");
        }
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError("Error al cargar los portfolios. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando portfolios...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (portfolios.length === 0) {
    return <div className="text-gray-700 text-center p-4">No hay portfolios disponibles.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Nuestro Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map((item) => (
          <Link
            to={`/portfolio/${item.slug}`}
            key={item.id}
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {/* LOGICA DE IMAGEN */}
            {item.coverImage && item.coverImage.url ? (
              <>
                {/* AÑADE ESTE CONSOLE.LOG ADICIONAL */}
                {console.log("Portfolio.jsx - Rendering Image URL:", item.coverImage.url)}
                <img
                  src={item.coverImage.url} // <-- Aquí se usa la URL
                  alt={item.coverImage.alternativeText || item.Title || "Imagen de Portfolio"}
                  className="w-full h-44 object-cover rounded-t-xl mb-3"
                />
              </>
            ) : (
              <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-xl mb-3">
                No hay imagen disponible
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.Title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {typeof item.description === 'string'
                  ? item.description.substring(0, 100) + '...' // Mostrar solo los primeros 100 caracteres si es string
                  : Array.isArray(item.description)
                    ? item.description.map(block => block.children ? block.children.map(child => child.text).join('') : '').join('\n').substring(0, 100) + '...' // O los primeros 100 de texto plano si es array
                    : 'Sin descripción.'}
              </p>
              {item.creado && (
                <p className="text-gray-500 text-xs">Publicado el: {item.creado}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;