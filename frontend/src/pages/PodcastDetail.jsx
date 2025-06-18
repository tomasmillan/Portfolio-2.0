import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPodcastBySlug } from '../services/api';

function PodcastDetail() {
    const { slug } = useParams();
    const [podcast, setPodcast] = useState(null);
    const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL || "https://portfolio-20-production-96a6.up.railway.app/api";

    useEffect(() => {
        console.log("Slug from useParams:", slug);
        const fetchPodcast = async () => {
            try {
                const data = await getPodcastBySlug(slug);
                setPodcast(data);
            } catch (error) {
                console.error("Error fetching podcast:", error);
            }
        };
        fetchPodcast();
    }, [slug]);

    if (!podcast) {
        return <div>Cargando... <span className="loading loading-ring loading-lg"></span></div>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">{podcast.title}</h1>
            {podcast.coverImage && podcast.coverImage[0] && (
                <img
                    src={`${strapiBaseUrl}${podcast.coverImage[0].url}`}
                    alt={`Portada de ${podcast.title}`}
                    className="w-full h-64 object-cover mb-4 rounded"
                />
            )}
            {podcast.description && podcast.description[0] && podcast.description[0].children && podcast.description[0].children[0] && (
                <p>{podcast.description[0].children[0].text}</p>
            )}
            {podcast.audioFile && podcast.audioFile[0] && (
                <audio controls className="w-full mt-4">
                    <source src={`${strapiBaseUrl}${podcast.audioFile[0].url}`} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            )}
        </div>
    );
}

export default PodcastDetail;