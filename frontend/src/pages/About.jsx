import React from "react";
import { Link } from "react-router-dom";

export const About = () => {
  // Define the path to your image.
  // Make sure to place your photo (e.g., 'your-photo.jpg')
  // inside the 'public/images/' folder of your React project.
  const myPhoto = "/images/perfilcv.jpg"; // <--- CHANGE THIS TO YOUR ACTUAL IMAGE PATH

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center"> {/* Added flex flex-col items-center for centering */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center"> {/* Adjusted mb-4 to mb-8 for more space */}
          Sobre mí
        </h1>

        {/* Image Section */}
        <div className="mb-8 flex justify-center"> {/* Added div for centering the image */}
          <img
            src={myPhoto}
            alt="Foto de Tomas Millan Lanhozo" // Good alt text for accessibility
            className="w-60 h-60 rounded-full object-cover shadow-lg border-4 border-blue-500" // Styled as a circular image
          />
        </div>

        <p className="text-lg text-gray-600 mb-8 text-center md:text-left">
          Soy <strong>Tomas Millan Lanhozo</strong>, diseñador frontend y
          publicista con pasión por crear experiencias digitales modernas,
          funcionales y con identidad propia.
        </p>

        <div className="text-gray-700 text-base leading-relaxed text-center md:text-left">
          <p className="mb-4">
            Me especializo en diseño web, desarrollo frontend con React y
            campañas de marketing digital centradas en el usuario. Disfruto
            combinar estética, estrategia y tecnología para ayudar a marcas y
            emprendedores a destacar en el mundo digital.
          </p>
          <p className="mb-4">
            También tengo experiencia en e-commerce, SEO y creación de contenido
            para redes sociales. Actualmente estoy enfocado en desarrollar
            proyectos propios y colaborar con equipos que valoren la creatividad
            y el impacto.
          </p>
          <p className="mb-8">
            Fuera del trabajo, me apasiona la cocina, la hospitalidad y viajar,
            lo que también me inspira a diseñar soluciones simples y humanas.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-white mt-4"> {/* Added mt-4 for spacing */}
          <span className="bg-gray-800 px-3 py-1 rounded-full">
            Diseño Ux/UI
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">React.js</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">
            Marketing Digital
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">SEO</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">E-commerce</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Figma</span>
        </div>
      </div>
    </div>
  );
};