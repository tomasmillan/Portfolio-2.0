// src/components/PortfolioDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortfolioBySlug } from "../services/api";

function PortfolioDetail() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);

      try {
        const portfolioData = await getPortfolioBySlug(slug);

        if (isMounted) {
          if (portfolioData) {
            setPortfolio(portfolioData);
            console.log("--- PortfolioDetail Component Debug ---");
            console.log("1. Data received by setPortfolio:", portfolioData);
            console.log("2. Title from received data:", portfolioData.Title);
            console.log("3. EmbedCode from received data:", portfolioData.embedCode);
          } else {
            setPortfolio(null);
            setError(`No se encontró ningún proyecto con el slug: ${slug}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al obtener detalles del portfolio en PortfolioDetail:", err);
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

  // Este log se ejecuta CADA VEZ que el componente se renderiza.
  // Observa lo que muestra 'portfolio' EN TIEMPO REAL.
  console.log("--- PortfolioDetail Render Debug ---");
  console.log("Current 'portfolio' state during render:", portfolio);
  console.log("Current 'Title' during render:", portfolio?.Title);


  if (loading) {
    return <div className="text-center p-4">Cargando proyecto...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!portfolio) {
    return <div className="text-gray-700 text-center p-4">Proyecto no disponible.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center">
          {portfolio.Title || "Título no disponible por fallback"}
        </h1>

        {/* Muestra el objeto portfolio directamente para DEPURACIÓN VISUAL */}
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm my-4">
          <h3>DEBUG: Objeto 'portfolio' actualmente en el estado del componente (en el DOM):</h3>
          {JSON.stringify(portfolio, null, 2)}
        </pre>

        {/* Solo mostramos el embedCode si existe, para simplificar */}
        {portfolio.embedCode && portfolio.embedCode.trim() !== "" && (
          <div className="mt-8 border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Contenido Multimedia Incrustado (DEBUG)
            </h3>
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
              dangerouslySetInnerHTML={{ __html: portfolio.embedCode }}
            />
          </div>
        )}

        <div className="text-right mt-10 pt-6 border-t border-gray-200 text-gray-500 text-sm">
          <p>Publicado por: Tomas Millan Lanhozo</p>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;