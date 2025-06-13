import React from "react";
import { useEffect, useState } from "react";
import { getPodcasts } from "../services/api";
import { Link } from "react-router-dom";
const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

function Podcast() {
  const [podcast, setPodcast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPodcasts();
        console.log(data);
        setPodcast(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        <h1>Error Fetching data ${error}</h1>;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Podcasts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcast.map((podcast) => (
          <div key={podcast.id} className="bg-white p-4 shadow-md rounded">
            <Link to={`/podcast/${podcast.slug}`}>
              {podcast.coverImage &&
                podcast.coverImage[0] && ( // Validación adicional
                  <img
                    src={`${strapiBaseUrl}${podcast.coverImage[0].url}`} // Acceso correcto a la URL
                    alt={`Portada de ${podcast.title}`}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
              <h2 className="text-xl font-semibold">{podcast.title}</h2>
              {podcast.description &&
                podcast.description[0] &&
                podcast.description[0].children &&
                podcast.description[0].children[0] && (
                  <p>
                    {podcast.description[0].children[0].text.substring(0, 50)}
                    ...
                  </p>
                )}
              <p className="text-gray-600">
                Publicado por: Tomas Millan Lanhozo.
              </p>
              <p className="text-gray-600">{podcast.publicado}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Podcast;
