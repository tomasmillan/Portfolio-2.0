// src/components/PortfolioDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const data = await getPortfolioBySlug(slug);
      setPortfolio(data);
      setLoading(false);
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;
  if (!portfolio) return <p>Proyecto no encontrado.</p>;

  const {
    title,
    description,
    content,
    coverImage,
    mediaFiles,
    embedCode,
  } = portfolio;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <p className="text-gray-600 text-lg mb-6">{description}</p>

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

      {embedCode && (
        <div
          className="w-full my-8"
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      )}

      {mediaFiles?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {mediaFiles.map((file) => (
            <img
              key={file.id}
              src={file.url}
              alt={file.alternativeText || "Imagen adicional"}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PortfolioDetail;
