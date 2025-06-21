import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolioBySlug(slug);
        if (!data) {
          setError("No se encontró el proyecto.");
        } else {
          setPortfolio(data);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Hubo un problema al cargar el proyecto.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const { title, content, coverImage, mediaFiles } = portfolio;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {coverImage?.url && (
        <img
          src={coverImage.url}
          alt={coverImage.alternativeText || "Imagen principal"}
          className="w-full h-auto rounded-xl mb-6"
        />
      )}

      {content && (
        <div
          className="prose prose-lg mb-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {mediaFiles?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {mediaFiles.map((file) => (
            <img
              key={file.id}
              src={file.url}
              alt={file.alternativeText || "Imagen"}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PortfolioDetail;
