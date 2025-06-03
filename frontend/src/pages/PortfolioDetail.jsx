import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortfolioBySlug } from '../services/api';

function PortfolioDetail() {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const strapiBaseUrl = 'http://localhost:1337';

    useEffect(() => {
        console.log("Slug from useParams:", slug);
        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolioBySlug(slug);
                setPortfolio(data);
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            }
        };
        fetchPortfolio();
    }, [slug]);

    if (!portfolio) {
        return <div>Cargando... <span className="loading loading-ring loading-lg"></span></div>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">{portfolio.Title}</h1>
            {portfolio.coverImage && portfolio.coverImage[0] && (
                <img
                    src={`${strapiBaseUrl}${portfolio.coverImage[0].url}`}
                    alt={`Portada de ${portfolio.Title}`}
                    className="w-full h-64 object-cover mb-4 rounded"
                />
            )}
            {portfolio.description && portfolio.description[0] && portfolio.description[0].children && portfolio.description[0].children[0] && (
                <p>{portfolio.description[0].children[0].text}</p>
            )}
            {portfolio.mediaFiles && portfolio.mediaFiles[0] && (
                <div>
                    {portfolio.mediaFiles[0].ext === '.pdf' ? (
                        <iframe
                            src={`${strapiBaseUrl}${portfolio.mediaFiles[0].url}`}
                            width="100%"
                            height="600px"
                            title="PDF Viewer"
                        />
                    ) : (
                        <a
                            href={`${strapiBaseUrl}${portfolio.mediaFiles[0].url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver Archivo
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default PortfolioDetail;