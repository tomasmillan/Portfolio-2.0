// src/components/PortfolioDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchedPortfolioCache = useRef({});

  // La URL base para concatenar si las imágenes son relativas
  const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL || "https://portfolio-20-production-96a6.up.railway.app";

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioData = async () => {
      if (fetchedPortfolioCache.current[slug]) {
        if (isMounted) {
          setPortfolio(fetchedPortfolioCache.current[slug]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setPortfolio(null);

      try {
        const portfolioData = await getPortfolioBySlug(slug);

        if (isMounted) {
          if (portfolioData) {
            setPortfolio(portfolioData);
            fetchedPortfolioCache.current[slug] = portfolioData;
            console.log("--- PortfolioDetail Component Debug ---");
            console.log("Portfolio object RECEIVED by setPortfolio (complete):", portfolioData);
            // Esto debería mostrarte el objeto aplanado, pero la lógica de renderizado en el JSX causará el problema
            console.log("CoverImage object (from received object):", portfolioData.coverImage);
            console.log("DESCRIPTION FIELD STRUCTURE (before rendering):", portfolioData.description);
          } else {
            setPortfolio(null);
            setError(`No se encontró ningún proyecto con el slug: ${slug}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching portfolio details in PortfolioDetail:", err);
          setError("Error al cargar el proyecto. Por favor, inténtalo de nuevo.");
          setPortfolio(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolioData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-gray-500"></span>
        <p className="text-gray-600 ml-3">Cargando proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-8 text-lg font-semibold">
        <p>{error}</p>
        <Link to="/portfolio" className="mt-4 inline-block text-blue-600 hover:underline">
          Volver al Portfolio
        </Link>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-gray-700 text-center p-8 text-lg">
        <p>Proyecto no disponible.</p>
        <Link to="/portfolio" className="mt-4 inline-block text-blue-600 hover:underline">
          Volver al Portfolio
        </Link>
      </div>
    );
  }

  // --- Lógica de URL de imagen anterior (antes de la corrección) ---
  // Esto buscará item.coverImage[0].url, que es lo que no se encontraba antes
  const coverImageUrl = portfolio.coverImage && portfolio.coverImage[0]?.url // <-- ¡Volvemos a usar [0] aquí!
    ? (portfolio.coverImage[0].url.startsWith("http") || portfolio.coverImage[0].url.startsWith("https")
        ? portfolio.coverImage[0].url
        : `${strapiBaseUrl}${portfolio.coverImage[0].url}`)
    : null;

  console.log("PortfolioDetail.jsx - Final Cover Image URL (Old Logic):", coverImageUrl); // Para depuración

  // Función para renderizar la descripción como JSON si es array
  const renderDescriptionContent = () => {
    if (typeof portfolio.description === 'string') {
      return <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: portfolio.description }} />;
    }
    // ¡Aquí se renderiza como JSON para replicar el estado anterior!
    else if (Array.isArray(portfolio.description)) {
      return <pre className="text-gray-700 leading-relaxed overflow-auto">{JSON.stringify(portfolio.description, null, 2)}</pre>;
    }
    return <p className="text-gray-600 italic">No hay descripción disponible para este proyecto.</p>;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg relative">
        <Link
          to="/portfolio"
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out text-sm"
          aria-label="Volver al Portfolio"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          Volver
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center mt-12 md:mt-0">
          {portfolio.Title || "Título no disponible"}
        </h1>

        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={`Portada de ${portfolio.Title}`}
            className="w-full h-80 md:h-96 object-cover rounded-lg mb-8 shadow-md"
          />
        )}

        {/* Sección de Descripción del Proyecto */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Descripción del Proyecto
          </h3>
          {renderDescriptionContent()}
        </div>

        {/* Section for embedded code */}
        {portfolio.embedCode && portfolio.embedCode.trim() !== "" && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Contenido Multimedia Incrustado
            </h3>
            <div
              className="relative w-full overflow-hidden rounded-lg shadow-md"
              style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: portfolio.embedCode }}
              />
            </div>
          </div>
        )}

        {/* Section for media files (PDFs, etc.) */}
        {portfolio.mediaFiles && portfolio.mediaFiles.length > 0 && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Archivos Adicionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.mediaFiles.map((file, index) => {
                // Asumiendo que mediaFiles[index] es también un ARRAY con el objeto de archivo dentro
                const fileUrl =
                  file && file[0]?.url // <-- ¡Volvemos a usar [0] aquí!
                    ? (file[0].url.startsWith("http") || file[0].url.startsWith("https")
                        ? file[0].url
                        : `${strapiBaseUrl}${file[0].url}`)
                    : null;
                
                console.log("PortfolioDetail.jsx - Rendering Media File URL (Old Logic):", fileUrl);

                const fileTitle = file && file[0]?.alternativeText || file && file[0]?.name || `Archivo ${index + 1}`; // <-- Asegurarse de acceder a las propiedades correctas

                return (
                  <div key={file.id || index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                    {/* Necesitaríamos el 'ext' y otras propiedades de file[0] */}
                    {file && file[0]?.ext === ".pdf" ? ( // <-- Acceder a file[0].ext
                      <div>
                        <p className="font-semibold mb-2">{fileTitle}</p>
                        {fileUrl && (
                          <iframe
                            src={fileUrl}
                            width="100%"
                            height="400px"
                            title={`PDF de ${portfolio.Title}`}
                            className="rounded-lg shadow-md border border-gray-200 w-full h-auto"
                            style={{ minHeight: '300px' }}
                          />
                        )}
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                          >
                            Abrir PDF en nueva pestaña
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        {fileUrl ? (
                          <img
                            src={fileUrl}
                            alt={fileTitle}
                            className="w-full h-48 object-cover rounded-lg mb-3 shadow-sm"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-lg mb-3">
                            No hay imagen de archivo disponible
                          </div>
                        )}
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                          >
                            Ver Imagen ({fileTitle})
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-right mt-10 pt-6 border-t border-gray-200 text-gray-500 text-sm">
          <p>Publicado por: {portfolio.author?.name || "Tomas Millan Lanhozo"}</p>
          {portfolio.createdAt && (
            <p>Fecha de Publicación: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
          )}
          {portfolio.updatedAt && portfolio.createdAt !== portfolio.updatedAt && (
            <p>Última Actualización: {new Date(portfolio.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;