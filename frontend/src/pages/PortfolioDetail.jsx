// src/components/PortfolioDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Importa Link si no lo tienes
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Añade estado para errores

  // Definir la URL base para imágenes relativas (aunque Cloudinary debería dar absolutas)
  const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null); // Resetear error al iniciar la carga
      try {
        const data = await getPortfolioBySlug(slug);
        if (data) {
          setPortfolio(data);
          // Puedes añadir logs aquí para depurar la estructura de los datos
          console.log("Datos de portfolio aplanados:", data);
          console.log(
            "Tipo de description:",
            typeof data.description,
            data.description
          );
          console.log("Media files:", data.mediaFiles);
        } else {
          setError("Proyecto no encontrado."); // Setear error si no hay datos
        }
      } catch (err) {
        console.error("Error fetching portfolio detail:", err);
        setError("Error al cargar el proyecto. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) return <p className="text-center p-4">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>; // Mostrar error si existe
  if (!portfolio)
    return <p className="text-center p-4">Proyecto no encontrado.</p>;

  // Desestructurar las propiedades del portfolio
  // IMPORTANTE: Usa los nombres EXACTOS de tus campos en Strapi (ej. Title con 'T' mayúscula)
  const {
    Title, // Asumiendo que el título es 'Title' en Strapi
    description, // Este es el campo Rich Text
    // Si tienes un campo de contenido principal adicional llamado 'content' en Strapi,
    // puedes desestructurarlo aquí:
    // content,
    coverImage,
    mediaFiles,
    embedCode,
    // Puedes añadir más campos aquí como 'createdAt', 'author', etc.
  } = portfolio;

  // Función para renderizar el contenido de Rich Text
  const renderRichText = (blocks) => {
    if (!blocks) return null;

    // Si es un string (ej. si cambiaste el campo a "Long text" en Strapi)
    if (typeof blocks === "string") {
      return (
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blocks }}
        />
      );
    }

    // Si es un array de bloques (formato de Rich Text de Strapi)
    if (Array.isArray(blocks)) {
      // Simplemente concatenamos el texto de los bloques para mostrarlo como texto plano
      // Si quieres renderizado HTML completo, necesitarías una librería como '@strapi/blocks-react-renderer'
      // o procesar los bloques para generar JSX/HTML.
      const plainText = blocks
        .map((block) => {
          if (block.type === "paragraph" && block.children) {
            return block.children.map((child) => child.text).join("");
          }
          // Puedes añadir más tipos de bloques aquí (heading, list, etc.)
          return "";
        })
        .filter(Boolean)
        .join("\n\n"); // Separar párrafos con dos saltos de línea

      return (
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {plainText}
        </p>
      );
    }

    return null; // En caso de tipo de dato inesperado
  };

  // Función para obtener la URL absoluta de un archivo
  const getAbsoluteUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path; // Ya es una URL absoluta (ej. de Cloudinary)
    }
    return `${strapiBaseUrl}${path}`; // Es una URL relativa, concatenar con la base de Strapi
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{Title}</h1> {/* Usa 'Title' */}
      {coverImage?.url && (
        <img
          src={getAbsoluteUrl(coverImage.url)} // Asegura que la URL sea absoluta
          alt={coverImage.alternativeText || "Imagen principal"}
          className="w-full h-auto rounded-xl mb-6 shadow-md"
        />
      )}
      {/* Renderizar la descripción (Rich Text) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Descripción</h2>
        {renderRichText(description)}
      </div>
      {embedCode && (
        <div className="w-full my-8">
          <h2 className="text-xl font-semibold mb-2">Contenido Incrustado</h2>
          <div
            className="relative w-full overflow-hidden rounded-lg shadow-md"
            style={{ paddingBottom: "56.25%" }} // Proporción 16:9 para videos
          >
            <div
              className="absolute top-0 left-0 w-full h-full"
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          </div>
        </div>
      )}
      {mediaFiles?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Archivos Multimedia Adicionales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaFiles.map((file) => {
              const fileUrl = getAbsoluteUrl(file.url);
              const isPdf =
                file.mime?.includes("application/pdf") || file.ext === ".pdf";

              return (
                <div
                  key={file.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="font-semibold mb-2 text-gray-800">
                    {file.alternativeText || file.name || "Archivo"}
                  </p>
                  {isPdf ? (
                    <div className="flex flex-col items-center">
                      <p className="text-red-500 mb-2">
                        Previsualización de PDF no disponible directamente.
                        Abrir en nueva pestaña.
                      </p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
                      >
                        Ver PDF
                      </a>
                    </div>
                  ) : (
                    fileUrl && (
                      <img
                        src={fileUrl}
                        alt={file.alternativeText || "Imagen adicional"}
                        className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"
                      />
                    )
                  )}
                  {!isPdf &&
                    fileUrl && ( // Solo para imágenes
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
                      >
                        Ver Imagen
                      </a>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioDetail;
