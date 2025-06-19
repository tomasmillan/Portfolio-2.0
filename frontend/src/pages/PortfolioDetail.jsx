// src/components/PortfolioDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const strapiBaseUrl =
    import.meta.env.VITE_STRAPI_API_URL ||
    "https://portfolio-20-production-96a6.up.railway.app";

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);

      try {
        // getPortfolioBySlug ya debería devolver el objeto plano con attributes
        const portfolioData = await getPortfolioBySlug(slug);

        if (portfolioData) {
          // Si getPortfolioBySlug devuelve null o undefined, entra al else
          setPortfolio(portfolioData);
          console.log(
            "Portfolio data loaded successfully:",
            portfolioData.Title
          );
          console.log("Embed Code from API:", portfolioData.embedCode);
        } else {
          setPortfolio(null);
          setError(`No se encontró ningún proyecto con el slug: ${slug}`);
          console.warn(`No portfolio found with slug: ${slug}`);
        }
      } catch (err) {
        console.error("Error al obtener detalles del portfolio:", err);
        setError("Error al cargar el proyecto. Por favor, inténtalo de nuevo.");
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">Cargando proyecto...</p>
          {/* Usando un spinner de Tailwind CSS si tienes daisyUI o similar, o un simple texto */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-red-600 font-semibold mb-4">{error}</p>
          <p className="text-gray-600">
            Por favor, verifica la URL o inténtalo más tarde.
          </p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="bg-gray-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-gray-700 font-semibold">
            Proyecto no disponible.
          </p>
          <p className="text-gray-600 mt-2">
            No se pudo cargar la información del proyecto.
          </p>
        </div>
      </div>
    );
  }

  // --- renderStrapiDescription FUNCTION (se mantiene igual, ya está bien) ---
  const renderStrapiDescription = (descriptionContent) => {
    if (!descriptionContent || !Array.isArray(descriptionContent)) {
      return null;
    }

    const renderTextChildren = (children) => {
      return children.map((child, childIndex) => {
        let text = child.text;
        if (child.bold) text = <strong key={childIndex}>{text}</strong>;
        if (child.italic) text = <em key={childIndex}>{text}</em>;
        return text;
      });
    };

    return descriptionContent.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {block.children.map((child, childIndex) => {
                if (child.type === "link") {
                  if (child.url && child.children) {
                    return (
                      <a
                        key={childIndex}
                        href={child.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {renderTextChildren(child.children)}
                      </a>
                    );
                  }
                  return null;
                }
                return renderTextChildren([child]);
              })}
            </p>
          );
        case "heading":
          if (block.level === 1)
            return (
              <h1 key={index} className="text-3xl font-bold mb-4 text-gray-800">
                {renderTextChildren(block.children)}
              </h1>
            );
          if (block.level === 2)
            return (
              <h2 key={index} className="text-2xl font-bold mb-3 text-gray-800">
                {renderTextChildren(block.children)}
              </h2>
            );
          if (block.level === 3)
            return (
              <h3 key={index} className="text-xl font-bold mb-2 text-gray-800">
                {renderTextChildren(block.children)}
              </h3>
            );
          return null;
        case "list": {
          const ListTag = block.format === "ordered" ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={`mb-4 pl-5 ${
                block.format === "ordered" ? "list-decimal" : "list-disc"
              }`}
            >
              {block.children.map((listItem, liIndex) => (
                <li key={liIndex} className="mb-1 text-gray-700">
                  {renderTextChildren(listItem.children)}
                </li>
              ))}
            </ListTag>
          );
        }
        case "image":
          if (block.image?.url) {
            const blockImageUrl =
              block.image.url.startsWith("http") ||
              block.image.url.startsWith("https")
                ? block.image.url
                : `${strapiBaseUrl}${block.image.url}`;

            return (
              <div key={index} className="my-6">
                <img
                  src={blockImageUrl}
                  alt={block.image.alternativeText || "Descripción de imagen"}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {block.image.caption && (
                  <p className="text-center text-gray-500 text-sm mt-2">
                    {block.image.caption}
                  </p>
                )}
              </div>
            );
          }
          return null;
      }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">
          {portfolio.Title}
        </h1>

        {/* Acceso directo a coverImage y su URL */}
        {portfolio.coverImage &&
          portfolio.coverImage[0] &&
          (() => {
            const imageUrl =
              portfolio.coverImage[0].url.startsWith("http") ||
              portfolio.coverImage[0].url.startsWith("https")
                ? portfolio.coverImage[0].url
                : `${strapiBaseUrl}${portfolio.coverImage[0].url}`;

            return (
              <img
                src={imageUrl}
                alt={`Portada de ${portfolio.Title}`}
                className="w-full h-80 md:h-96 object-cover rounded-lg mb-8 shadow-md"
              />
            );
          })()}

        {/* Render the rich text description */}
        {portfolio.description &&
          renderStrapiDescription(portfolio.description)}

        {/* SECTION FOR EMBED CODE */}
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

        {/* Existing media files handling for PDFs etc. */}
        {portfolio.mediaFiles && portfolio.mediaFiles.length > 0 && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Archivos Adicionales
            </h3>
            {portfolio.mediaFiles.map((file, index) => (
              <div key={index} className="mb-4">
                {file.ext === ".pdf" ? (
                  <iframe
                    src={`${strapiBaseUrl}${file.url}`}
                    width="100%"
                    height="600px"
                    title={`PDF de ${portfolio.Title}`}
                    className="rounded-lg shadow-md border border-gray-200"
                  />
                ) : (
                  <a
                    href={`${strapiBaseUrl}${file.url}`}
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
