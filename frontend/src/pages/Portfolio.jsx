

import React, { useEffect, useState } from "react";
import { getPortfolio } from "../services/api";
import { Link } from "react-router-dom";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const strapiBaseUrl = "http://localhost:1337";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPortfolio();
        setPortfolio(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Portfolio</h1>
        <p className="text-lg text-gray-600 mb-12">
          Acá están algunos de mis trabajos recientes en diseño, desarrollo y branding digital.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 w-80 rounded-xl shadow hover:shadow-lg transition"
            >
              <Link to={`/portfolio/${item.slug}`}>
                {item.coverImage &&
                  item.coverImage[0] && (
                    <img
                      src={`${strapiBaseUrl}${item.coverImage[0].url}`}
                      alt={`Portada de ${item.Title}`}
                      className="w-full h-44 object-cover rounded mb-3"
                    />
                  )}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.Title}</h2>
                {item.description?.[0]?.children?.[0]?.text && (
                  <p className="text-gray-500 text-sm mb-2">
                    {item.description[0].children[0].text.substring(0, 70)}...
                  </p>
                )}
                <p className="text-gray-400 text-xs">Publicado por: Tomas Millan Lanhozo</p>
                <p className="text-gray-400 text-xs">{item.publicado}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
