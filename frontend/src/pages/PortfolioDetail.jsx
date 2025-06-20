// src/components/PortfolioDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useRef to cache fetched data to prevent redundant API calls on re-renders
  const fetchedPortfolioCache = useRef({});

  const strapiBaseUrl =
    import.meta.env.VITE_STRAPI_BASE_URL ||
    "https://portfolio-20-production-96a6.up.railway.app";

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchPortfolioData = async () => {
      // 1. Check if data for this slug is already in cache
      if (fetchedPortfolioCache.current[slug]) {
        if (isMounted) {
          setPortfolio(fetchedPortfolioCache.current[slug]);
          setLoading(false);
          setError(null); // Clear any previous errors
          console.log("--- PortfolioDetail Cache Debug ---");
          console.log("Using cached portfolio data for slug:", slug, fetchedPortfolioCache.current[slug]);
        }
        return; // Exit as data is loaded from cache
      }

      // 2. Data not in cache, proceed with fetching
      setLoading(true);
      setError(null);
      setPortfolio(null); // Clear previous state to show loading properly

      try {
        const portfolioData = await getPortfolioBySlug(slug); // Call the API function

        if (isMounted) {
          if (portfolioData) {
            setPortfolio(portfolioData);
            fetchedPortfolioCache.current[slug] = portfolioData; // Cache the fetched data
            console.log("--- PortfolioDetail Component Debug ---");
            console.log("Portfolio object RECEIVED by setPortfolio (complete):", portfolioData);
            console.log("Title property (from received object):", portfolioData.Title);
            console.log("EmbedCode property (from received object):", portfolioData.embedCode);
            console.log("CoverImage URL (after setPortfolio):", portfolioData.coverImage?.url);
            console.log("MediaFiles (after setPortfolio):", portfolioData.mediaFiles);
          } else {
            // If API returns null (no portfolio found for slug)
            setPortfolio(null);
            setError(`No se encontró ningún proyecto con el slug: ${slug}`);
            console.warn(`No portfolio found with slug: ${slug} in PortfolioDetail component.`);
            // Optionally clear this slug from cache if API explicitly says "not found"
            delete fetchedPortfolioCache.current[slug]; 
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching portfolio details in PortfolioDetail:", err);
          setError("Error al cargar el proyecto. Por favor, inténtalo de nuevo.");
          setPortfolio(null);
          // Clear cache on fetch error to retry next time
          delete fetchedPortfolioCache.current[slug];
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolioData();

    // Cleanup function: runs when component unmounts or before effect re-runs
    return () => {
      isMounted = false; // Mark component as unmounted
    };
  }, [slug]); // Effect re-runs only when 'slug' changes

  // Log that runs on every render of the component
  console.log("--- PortfolioDetail Render Debug ---");
  console.log("Current 'portfolio' state during render:", portfolio);
  console.log("Current 'Title' during render:", portfolio?.Title);

  // Conditional rendering based on loading, error, and portfolio state
  if (loading) {
    return <div className="text-center p-4">Cargando proyecto...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!portfolio) {
    return <div className="text-gray-700 text-center p-4">Proyecto no disponible.</div>;
  }

  // Determine cover image URL
  const coverImageUrl = portfolio.coverImage
    ? (portfolio.coverImage.url.startsWith("http") || portfolio.coverImage.url.startsWith("https")
      ? portfolio.coverImage.url
      : `${strapiBaseUrl}${portfolio.coverImage.url}`)
    : null;

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">
          {portfolio.Title || "Título no disponible"}
        </h1>

        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={`Portada de ${portfolio.Title}`}
            className="w-full h-80 md:h-96 object-cover rounded-lg mb-8 shadow-md"
          />
        )}

        {/* Debug: Display raw portfolio object in DOM */}
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm my-4">
          <h3>DEBUG: Objeto Portfolio actualmente en el estado del componente:</h3>
          {JSON.stringify(portfolio, null, 2)}
        </pre>

        {/* Section for embedded code */}
        {portfolio.embedCode && portfolio.embedCode.trim() !== "" && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Contenido Multimedia Incrustado
            </h3>
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
              dangerouslySetInnerHTML={{ __html: portfolio.embedCode }}
            />
          </div>
        )}

        {/* Section for media files (PDFs, etc.) */}
        {portfolio.mediaFiles && portfolio.mediaFiles.length > 0 && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Archivos Adicionales
            </h3>
            {portfolio.mediaFiles.map((file, index) => (
              <div key={file.id || index} className="mb-4">
                {file.ext === ".pdf" ? (
                  <iframe
                    src={
                        file.url.startsWith("http") || file.url.startsWith("https")
                        ? file.url
                        : `${strapiBaseUrl}${file.url}`
                    }
                    width="100%"
                    height="600px"
                    title={`PDF de ${portfolio.Title}`}
                    className="rounded-lg shadow-md border border-gray-200"
                  />
                ) : (
                  <a
                    href={
                        file.url.startsWith("http") || file.url.startsWith("https")
                        ? file.url
                        : `${strapiBaseUrl}${file.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                  >
                    Ver Archivo ({file.name})
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-right mt-10 pt-6 border-t border-gray-200 text-gray-500 text-sm">
          <p>Publicado por: Tomas Millan Lanhozo</p>
          {portfolio.publicado && <p>Fecha: {portfolio.publicado}</p>}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;