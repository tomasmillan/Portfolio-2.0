// src/components/PortfolioDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortfolioBySlug, getStrapiMedia } from '../services/api';

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);

      try {
        const responseData = await getPortfolioBySlug(slug);

        // Si getPortfolioBySlug devuelve un array 'data' y luego el objeto del portfolio directo
        // (es decir, el contenido de .attributes), entonces responseData.data[0] es el objeto.
        if (responseData && responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
          // Asigna el objeto completo directamente a portfolio (asumiendo que api.js lo desempaqueta)
          setPortfolio(responseData.data[0]);
          console.log("Portfolio data loaded successfully:", responseData.data[0].Title);
          console.log("Embed Code from API:", responseData.data[0].embedCode);
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
          <span className="loading loading-ring loading-lg text-gray-500"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-red-600 font-semibold mb-4">{error}</p>
          <p className="text-gray-600">Por favor, verifica la URL o inténtalo más tarde.</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="bg-gray-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-gray-700 font-semibold">Proyecto no disponible.</p>
          <p className="text-gray-600 mt-2">No se pudo cargar la información del proyecto.</p>
        </div>
      </div>
    );
  }

  // Helper function to render text children with formatting for rich text
  const renderTextChildren = (children) => {
    if (!children || !Array.isArray(children) || children.length === 0) {
      return null;
    }
    return children.map((child, childIndex) => {
      if (child.text !== undefined) {
        let textElement = child.text;
        if (child.bold) textElement = <strong key={childIndex}>{textElement}</strong>;
        if (child.italic) textElement = <em key={childIndex}>{textElement}</em>;
        return textElement;
      }
      return null;
    });
  };

  // Function to render Strapi Rich Text content
  const renderStrapiDescription = (descriptionContent) => {
    if (!descriptionContent || !Array.isArray(descriptionContent)) {
      return null;
    }

    return descriptionContent.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {block.children.map((child, childIndex) => {
                if (child.type === 'link') {
                  if (child.url && child.children && child.children.length > 0) {
                    return (
                      <a
                        key={childIndex}
                        href={child.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        // Estilos mejorados para visibilidad del enlace: más oscuro, negrita, subrayado persistente
                        className="text-blue-800 hover:text-blue-900 font-bold underline hover:underline transition-colors duration-200"
                      >
                        {renderTextChildren(child.children)} {/* <--- ¡CORREGIDO! Vuelve a mostrar el texto del enlace */}
                        <span className="ml-1 text-base inline-block">↗️</span> {/* Icono visual */}
                      </a>
                    );
                  }
                  // Si el enlace está mal formado (sin URL o sin texto), renderizar solo el texto si existe
                  return renderTextChildren(child.children);
                }
                // Para hijos que no son de tipo 'link' dentro de un párrafo
                return renderTextChildren([child]);
              })}
            </p>
          );
        case 'heading':
          if (block.level === 1) return <h1 key={index} className="text-3xl font-bold mb-4 text-gray-800">{renderTextChildren(block.children)}</h1>;
          if (block.level === 2) return <h2 key={index} className="text-2xl font-bold mb-3 text-gray-800">{renderTextChildren(block.children)}</h2>;
          if (block.level === 3) return <h3 key={index} className="text-xl font-bold mb-2 text-gray-800">{renderTextChildren(block.children)}</h3>;
          return null;
        case 'list': {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className={`mb-4 pl-5 ${block.format === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
              {block.children.map((listItem, liIndex) => (
                <li key={liIndex} className="mb-1 text-gray-700">
                  {renderTextChildren(listItem.children)}
                </li>
              ))}
            </ListTag>
          );
        }
        case 'image':
          if (block.image?.url) {
            return (
              <div key={index} className="my-6 flex justify-center">
                <img
                  src={getStrapiMedia(block.image.url)}
                  alt={block.image.alternativeText || 'Descripción de imagen'}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
                {block.image.caption && <p className="text-center text-gray-500 text-sm mt-2">{block.image.caption}</p>}
              </div>
            );
          }
          return null;

        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-blue-800 italic">
              {renderTextChildren(block.children)}
            </blockquote>
          );
        case 'code':
          return (
            <pre key={index} className="bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto text-sm">
              <code>{renderTextChildren(block.children)}</code>
            </pre>
          );
        default:
          console.warn("Unknown Strapi Rich Text block type:", block.type, block);
          return null;
      }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">{portfolio.Title}</h1>

        {/* Cover Image */}
        {/* Acceso a coverImage: portfolio.coverImage (es un array de un solo elemento) */}
        {portfolio.coverImage?.[0]?.url && (
          <img
            src={getStrapiMedia(portfolio.coverImage[0].url)}
            alt={`Portada de ${portfolio.Title}`}
            className="w-full h-80 md:h-96 object-cover rounded-lg mb-8 shadow-md"
          />
        )}

        {/* Render the rich text description */}
        {portfolio.description && renderStrapiDescription(portfolio.description)}

        {/* SECTION FOR EMBED CODE */}
        {portfolio.embedCode && portfolio.embedCode.trim() !== '' && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Contenido Multimedia Incrustado</h3>
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio for responsive embeds
              dangerouslySetInnerHTML={{ __html: portfolio.embedCode }}
            />
          </div>
        )}

        {/* SECTION FOR MEDIA FILES */}
        {/* Acceso a mediaFiles: portfolio.mediaFiles (es un array) */}
        {portfolio.mediaFiles?.length > 0 && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Archivos Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.mediaFiles.map((file, index) => {
                const fileUrl = file.url;
                const fileName = file.name;
                const fileExt = file.ext;
                const fileMime = file.mime;

                return (
                  <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                    {fileMime.startsWith('image/') ? (
                      <img
                        src={getStrapiMedia(fileUrl)}
                        alt={fileName}
                        className="w-full h-48 object-contain rounded-md mb-2"
                      />
                    ) : fileExt === '.pdf' ? (
                      <div className="w-full h-64">
                        <iframe
                          src={getStrapiMedia(fileUrl)}
                          width="100%"
                          height="100%"
                          title={`PDF de ${portfolio.Title} - ${fileName}`}
                          className="rounded-lg shadow-md border border-gray-200"
                        />
                      </div>
                    ) : (
                      <a
                        href={getStrapiMedia(fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-center"
                      >
                        Descargar Archivo: {fileName}
                      </a>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{fileName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-right mt-10 pt-6 border-t border-gray-200 text-gray-500 text-sm">
          <p>Publicado por: Tomás Millan Lanhozo</p>
          {portfolio.publicado && <p>Fecha: {new Date(portfolio.publicado).toLocaleDateString()}</p>}
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;