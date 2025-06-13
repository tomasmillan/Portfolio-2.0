// Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  // getLatestPosts,
  // getLatestPodcasts,
  getLatestPortfolios,
} from "../services/api";

function Home() {
  // const [latestPosts, setLatestPosts] = useState([]);
  // const [latestPodcasts, setLatestPodcasts] = useState([]);
  const [latestPortfolios, setLatestPortfolios] = useState([]);
  const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const posts = await getLatestPosts();
        // const podcasts = await getLatestPodcasts();
        const portfolios = await getLatestPortfolios();

        // setLatestPosts(posts);
        // setLatestPodcasts(podcasts);
        setLatestPortfolios(portfolios);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-800 md:text-5xl lg:text-6xl dark:text-white">
            Tomás Millán Lanhozo
          </h1>
          <p className="mb-8 text-2xl font-semibold text-gray-500 lg:text-3xl sm:px-16 xl:px-48 dark:text-gray-400">
            Publicista - Desarrollador Frontend - Marketing digital
          </p>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Donde la creatividad se encuentra con el código.
            <br /> Construyo experiencias digitales que inspiran.
          </p>
          <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
            <Link
              to="/portfolio"
              className="bg-blue-600 text-white hover:text-white border border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-200 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Ir al Portfolio
            </Link>
            <Link
              to="/contact"
              className="border border-blue-600 text-blue-600 bg-white hover:text-blue-700 hover:bg-neutral-50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:hover:text-blue-500 dark:text-white dark:bg-blue-500 dark:focus:ring-blue-800"
            >
              Contactame
            </Link>
          </div>
        </div>
      </section>
      <h1 className="text-3xl font-bold m-4 text-center ">
        Bienvenido a mi sitio
      </h1>
      {/* <section className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Últimos Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestPosts.map((post) => (
            <div key={post.id} className="bg-gray-100 p-4 shadow-md rounded">
              <Link to={`/blog/${post.slug}`}>
                {post.coverImage && ( // Modificación aquí
                  <img
                    src={`${strapiBaseUrl}${post.coverImage.url}`} // Modificación aquí
                    alt={`Portada de ${post.Title}`}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                <h2 className="text-xl font-semibold">{post.Title}</h2>
                {post.content && <p>{post.content.substring(0, 50)}...</p>}
              </Link>
            </div>
          ))}
        </div>
        <Link to="/blog" className="text-blue-500 mt-4 block hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
          Ver todos los posts
        </Link>
      </section>

      <section className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Últimos Podcasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestPodcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white p-4 shadow-md rounded">
              <Link to={`/podcast/${podcast.slug}`}>
                {podcast.coverImage && podcast.coverImage[0] && (
                  <img
                    src={`${strapiBaseUrl}${podcast.coverImage[0].url}`}
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
              </Link>
            </div>
          ))}
        </div>
        <Link to="/podcast" className="text-blue-500 mt-4 block hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
          Ver todos los podcasts
        </Link>
      </section> */}

      <section className="mb-8 text-center">
        <h2 className="text-2xl font-semibold m-4">Últimos Proyectos</h2>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap -mx-2">
            {" "}
            {/* Added negative margins for spacing */}
            {latestPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" // Adjusted for 4 columns on large screens, added padding
              >
                <Link
                  to={`/portfolio/${portfolio.slug}`}
                  className="bg-white rounded-lg shadow h-full flex flex-col overflow-hidden transform transition duration-300 hover:scale-105" // Added hover effect
                >
                  {portfolio.coverImage?.[0]?.url && (
                    <img
                      src={`${strapiBaseUrl}${portfolio.coverImage[0].url}`}
                      alt={`Portada de ${portfolio.Title}`}
                      className="w-full h-48 object-cover rounded-t-lg" // Increased image height
                    />
                  )}
                  <div className="p-4 flex-grow flex flex-col">
                    {" "}
                    {/* Added flex-grow for consistent height */}
                    <h3 className="text-xl font-semibold mb-2">
                      {portfolio.Title}
                    </h3>
                    {portfolio.description?.[0]?.children?.[0]?.text && (
                      <p className="text-gray-600 text-sm flex-grow">
                        {" "}
                        {/* Added flex-grow */}
                        {portfolio.description[0].children[0].text.substring(
                          0,
                          100
                        )}
                        ... {/* Increased substring length */}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/portfolio"
          className="inline-block mt-6 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300" // Added transition
        >
          Ver todos los proyectos
        </Link>
      </section>

      <section className="bg-gray-200 py-6">
        <div className="text-center max-w-screen-lg mx-auto">
          <span className="font-semibold text-gray-700 uppercase block">
            Me podés encontrar en:
          </span>
          <div className="flex justify-center items-center gap-6 mt-6">
            <a
              href="https://www.youtube.com/@MyTomol"
              className="hover:text-red-600"
            >
              {/* YouTube icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 24.402344 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.402344 16.898438 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.902344 40.5 17.898438 41 24.5 41 C 31.101563 41 37.097656 40.5 40.597656 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C 45.5 33 46 29.402344 46.097656 24.902344 C 46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C 44.699219 12.101563 42.800781 10.5 40.597656 10 C 37.097656 9.5 31 9 24.402344 9 Z M 24.402344 11 C 31.601563 11 37.398438 11.597656 40.199219 12.097656 C 41.699219 12.5 42.898438 13.5 43.097656 14.800781 C 43.699219 18 44.097656 21.402344 44.097656 24.902344 C 44 29.199219 43.5 32.699219 43.097656 35.199219 C 42.800781 37.097656 40.800781 37.699219 40.199219 37.902344 C 36.597656 38.601563 30.597656 39.097656 24.597656 39.097656 C 18.597656 39.097656 12.5 38.699219 9 37.902344 C 7.5 37.5 6.300781 36.5 6.101563 35.199219 C 5.300781 32.398438 5 28.699219 5 25 C 5 20.398438 5.402344 17 5.800781 14.902344 C 6.101563 13 8.199219 12.398438 8.699219 12.199219 C 12 11.5 18.101563 11 24.402344 11 Z M 19 17 L 19 33 L 33 25 Z M 21 20.402344 L 29 25 L 21 29.597656 Z"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/tomasmillanlanhozo/"
              className="hover:text-blue-700"
            >
              {/* LinkedIn icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 80 80"
              >
                <path d="M 15 9 C 12.25 9 10 11.25 10 14 L 10 64 C 10 66.75 12.25 69 15 69 L 65 69 C 67.75 69 70 66.75 70 64 L 70 14 C 70 11.25 67.75 9 65 9 Z M 15 11 L 65 11 C 66.667969 11 68 12.332031 68 14 L 68 64 C 68 65.667969 66.667969 67 65 67 L 15 67 C 13.332031 67 12 65.667969 12 64 L 12 14 C 12 12.332031 13.332031 11 15 11 Z M 23.902344 16.984375 C 20.601563 16.984375 17.90625 19.679688 17.90625 22.972656 C 17.90625 26.269531 20.601563 28.964844 23.902344 28.964844 C 27.195313 28.964844 29.886719 26.269531 29.886719 22.972656 C 29.886719 19.679688 27.195313 16.984375 23.902344 16.984375 Z M 36 17 C 35.449219 17 35 17.449219 35 18 C 35 18.550781 35.449219 19 36 19 C 36.550781 19 37 18.550781 37 18 C 37 17.449219 36.550781 17 36 17 Z M 40 17 C 39.449219 17 39 17.449219 39 18 C 39 18.550781 39.449219 19 40 19 C 40.550781 19 41 18.550781 41 18 C 41 17.449219 40.550781 17 40 17 Z M 44 17 C 43.449219 17 43 17.449219 43 18 C 43 18.550781 43.449219 19 44 19 C 44.550781 19 45 18.550781 45 18 C 45 17.449219 44.550781 17 44 17 Z M 48 17 C 47.449219 17 47 17.449219 47 18 C 47 18.550781 47.449219 19 48 19 C 48.550781 19 49 18.550781 49 18 C 49 17.449219 48.550781 17 48 17 Z M 52 17 C 51.449219 17 51 17.449219 51 18 C 51 18.550781 51.449219 19 52 19 C 52.550781 19 53 18.550781 53 18 C 53 17.449219 52.550781 17 52 17 Z M 56 17 C 55.449219 17 55 17.449219 55 18 C 55 18.550781 55.449219 19 56 19 C 56.550781 19 57 18.550781 57 18 C 57 17.449219 56.550781 17 56 17 Z M 60 17 C 59.449219 17 59 17.449219 59 18 C 59 18.550781 59.449219 19 60 19 C 60.550781 19 61 18.550781 61 18 C 61 17.449219 60.550781 17 60 17 Z M 23.902344 18.984375 C 26.109375 18.984375 27.886719 20.761719 27.886719 22.972656 C 27.886719 25.1875 26.109375 26.964844 23.902344 26.964844 C 21.679688 26.964844 19.90625 25.1875 19.90625 22.972656 C 19.90625 20.761719 21.679688 18.984375 23.902344 18.984375 Z M 50.101563 30.058594 C 46.9375 30.058594 44.507813 31.289063 42.84375 32.867188 L 42.84375 30.746094 L 32.597656 30.746094 L 32.597656 60.421875 L 43.191406 60.421875 L 43.191406 45.734375 C 43.191406 43.992188 43.390625 42.359375 43.96875 41.308594 C 44.550781 40.253906 45.375 39.625 47.351563 39.625 C 49.246094 39.625 49.851563 40.289063 50.3125 41.453125 C 50.773438 42.621094 50.824219 44.363281 50.824219 45.960938 L 50.824219 60.421875 L 60.421875 60.421875 L 60.421875 58.421875 L 61.421875 59.421875 L 61.421875 44.242188 C 61.421875 40.441406 61.046875 36.972656 59.375 34.324219 C 57.703125 31.671875 54.675781 30.058594 50.101563 30.058594 Z M 18.59375 30.746094 L 18.59375 60.421875 L 29.203125 60.421875 L 29.203125 30.746094 Z M 50.101563 32.058594 C 54.238281 32.058594 56.371094 33.308594 57.683594 35.390625 C 58.996094 37.46875 59.421875 40.585938 59.421875 44.242188 L 59.421875 58.421875 L 52.824219 58.421875 L 52.824219 45.960938 C 52.824219 44.351563 52.84375 42.417969 52.171875 40.71875 C 51.503906 39.023438 49.871094 37.625 47.351563 37.625 C 44.851563 37.625 43.097656 38.742188 42.21875 40.34375 C 41.339844 41.941406 41.191406 43.863281 41.191406 45.734375 L 41.191406 58.421875 L 34.597656 58.421875 L 34.597656 32.746094 L 40.84375 32.746094 L 40.84375 36.527344 L 42.566406 36.527344 L 42.847656 35.996094 C 43.820313 34.15625 46.28125 32.058594 50.101563 32.058594 Z M 20.59375 32.746094 L 27.203125 32.746094 L 27.203125 58.421875 L 20.59375 58.421875 Z"></path>
              </svg>
            </a>
            <a
              href="https://github.com/tomasmillan"
              className="hover:text-gray-800"
            >
              {/* GitHub icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
