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

  // strapiBaseUrl solo se usa si las URLs de las imágenes/archivos son relativas
  const strapiBaseUrl =
    import.meta.env.VITE_STRAPI_API_URL || // Usar VITE_STRAPI_API_URL consistentemente
    "https://portfolio-20-production-96a6.up.railway.app";

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioData = async () => {
      if (fetchedPortfolioCache.current[slug]) {
        if (isMounted) {
          setPortfolio(fetchedPortfolioCache.current[slug]);
          setLoading(false);
          setError(null);
          console.log("--- PortfolioDetail Cache Debug ---");
          console.log("Using cached portfolio data for slug:", slug, fetchedPortfolioCache.current[slug]);
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
            console.log("Title property (from received object):", portfolioData.Title);
            console.log("EmbedCode property (from received object):", portfolioData.embedCode);
            console.log("CoverImage URL (after setPortfolio):", portfolioData.coverImage?.url);
            console.log("MediaFiles (after setPortfolio):", portfolioData.mediaFiles);
            // *** IMPORTANTE: CONSOLA DEL CAMPO DESCRIPTION ***
            console.log("DESCRIPTION FIELD STRUCTURE (before rendering):", portfolioData.description);
          } else {
            setPortfolio(null);
            setError(`No se encontró ningún proyecto con el slug: ${slug}`);
            console.warn(`No portfolio found with slug: ${slug} in PortfolioDetail component.`);
            delete fetchedPortfolioCache.current[slug];
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching portfolio details in PortfolioDetail:", err);
          setError("Error al cargar el proyecto. Por favor, inténtalo de nuevo.");
          setPortfolio(null);
          delete fetchedPortfolioCache.current[slug];
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

  console.log("--- PortfolioDetail Render Debug ---");
  console.log("Current 'portfolio' state during render:", portfolio);
  console.log("Current 'Title' during render:", portfolio?.Title);

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

  const coverImageUrl = portfolio.coverImage?.url
    ? portfolio.coverImage.url.startsWith("http") ||
      portfolio.coverImage.url.startsWith("https")
      ? portfolio.coverImage.url
      : `${strapiBaseUrl}${portfolio.coverImage.url}`
    : null;

  // --- Nueva lógica para renderizar la descripción ---
  const renderDescriptionContent = () => {
    // 1. Si la descripción es un string, renderizar directamente (asumiendo HTML o texto plano)
    if (typeof portfolio.description === 'string') {
      // Usar dangerouslySetInnerHTML si es HTML, de lo contrario, solo texto
      // Si es HTML, asegúrate de que esté saneado para evitar XSS
      // Para esta versión, lo asumiremos como HTML.
      return <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: portfolio.description }} />;
    }
    // 2. Si es un array (formato Block Content de Strapi Rich Text)
    else if (Array.isArray(portfolio.description)) {
      // Extraer el texto plano de los bloques
      const plainTextDescription = portfolio.description.map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map(child => child.text).join('');
        }
        return '';
      }).filter(Boolean).join('\n\n'); // Unir con dobles saltos de línea para párrafos

      // Si necesitas renderizar el contenido enriquecido de forma segura y estructurada
      // sin ReactMarkdown, la mejor forma sería procesar este array.
      // Pero si tu API no te lo devuelve ya como HTML o Markdown,
      // la forma más sencilla es mostrar el texto plano.
      if (plainTextDescription.trim() !== '') {
        return <p className="text-gray-700 leading-relaxed whitespace-pre-line">{plainTextDescription}</p>;
      }
    }
    // 3. Si no hay descripción o es un formato inesperado
    return <p className="text-gray-600 italic">No hay descripción disponible para este proyecto.</p>;
  };
  // --- Fin de la nueva lógica ---

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
          {/* Aquí se llama a la función que renderiza la descripción */}
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
                const fileUrl =
                  file.url.startsWith("http") || file.url.startsWith("https")
                    ? file.url
                    : `${strapiBaseUrl}${file.url}`;
                const fileTitle = file.alternativeText || file.name || `Archivo ${index + 1}`;

                return (
                  <div key={file.id || index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                    {file.ext === ".pdf" ? (
                      <div>
                        <p className="font-semibold mb-2">{fileTitle}</p>
                        <iframe
                          src={fileUrl}
                          width="100%"
                          height="400px"
                          title={`PDF de ${portfolio.Title}`}
                          className="rounded-lg shadow-md border border-gray-200 w-full h-auto"
                          style={{ minHeight: '300px' }}
                        />
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                        >
                          Abrir PDF en nueva pestaña
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <img
                          src={fileUrl}
                          alt={fileTitle}
                          className="w-full h-48 object-cover rounded-lg mb-3 shadow-sm"
                        />
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm"
                        >
                          Ver Imagen ({fileTitle})
                        </a>
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