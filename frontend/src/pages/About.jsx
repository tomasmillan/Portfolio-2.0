import React from 'react'
import { Link } from 'react-router-dom'


export const About = () => {
  return (
     <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Sobre mí</h1>
        <p className="text-lg text-gray-600 mb-8">
          Soy <strong>Tomas Millan Lanhozo</strong>, diseñador frontend y publicista con pasión por
          crear experiencias digitales modernas, funcionales y con identidad propia.
        </p>

        <div className="text-gray-700 text-base leading-relaxed">
          <p className="mb-4">
            Me especializo en diseño web, desarrollo frontend con React y campañas de marketing
            digital centradas en el usuario. Disfruto combinar estética, estrategia y tecnología para
            ayudar a marcas y emprendedores a destacar en el mundo digital.
          </p>
          <p className="mb-4">
            También tengo experiencia en e-commerce, SEO y creación de contenido para redes sociales.
            Actualmente estoy enfocado en desarrollar proyectos propios y colaborar con equipos que
            valoren la creatividad y el impacto.
          </p>
          <p className="mb-8">
            Fuera del trabajo, me apasiona la cocina, la hospitalidad y viajar, lo que también me
            inspira a diseñar soluciones simples y humanas.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-white">
          <span className="bg-gray-800 px-3 py-1 rounded-full">Diseño Web</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">React.js</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">Marketing Digital</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">SEO</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">E-commerce</span>
        </div>
      </div>
    </div>
  )
}
