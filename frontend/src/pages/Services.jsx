import React, { useState } from "react";

function Services() {
  // Enhanced services data with specific details
  const services = [
    {
      title: "Landing Pages",
      image: "/images/landing.png",
      description:
        "Diseño de páginas enfocadas en conversión para lanzamientos, campañas o productos.",
      details: [
        "Investigación de mercado y público objetivo",
        "Diseño UX/UI centrado en el usuario",
        "Optimización de la tasa de conversión (CRO)",
        "Integración con formularios y herramientas de marketing",
        "Diseño responsive para todos los dispositivos",
      ],
    },
    {
      title: "Diseño Web Estratégico",
      image: "/images/web.png",
      description:
        "Sitios web modernos con identidad visual, navegación clara y optimización técnica.",
      details: [
        "Arquitectura de la información y wireframing",
        "Desarrollo de identidad visual y branding",
        "Implementación de CMS (ej. Strapi)",
        "Optimización de rendimiento y accesibilidad",
        "Mantenimiento y soporte técnico",
      ],
    },
    {
      title: "SEO & Performance",
      image: "/images/seo.png",
      description:
        "Auditoría, mejoras técnicas, estructura y posicionamiento en buscadores.",
      details: [
        "Auditoría SEO técnica y de contenido",
        "Investigación de palabras clave",
        "Optimización On-Page y Off-Page",
        "Análisis de la competencia",
        "Mejora de la velocidad de carga (Core Web Vitals)",
      ],
    },
    {
      title: "Contenido para Redes",
      image: "/images/social.jpg",
      description:
        "Diseño de carouseles, portadas y branding visual para Instagram, TikTok y más.",
      details: [
        "Creación de plantillas personalizadas",
        "Diseño de gráficos y videos cortos",
        "Estrategia de contenido visual",
        "Adaptación a formatos específicos de cada red",
        "Asesoramiento en branding digital",
      ],
    },
  ];

  // State to manage which service card is currently hovered.
  // null means no card is hovered.
  // The index of the hovered card will be stored.
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Servicios</h2>
        <p className="text-center max-w-2xl mx-auto text-gray-600 mb-12">
          Ofrezco soluciones de diseño, estrategia y contenido digital pensadas
          para potenciar la presencia online de tu marca.
        </p>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative group" // Added 'group' class for Tailwind hover utility
              onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Clear hovered index on mouse leave
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>

              {/* Collapsible Details Section */}
              <div
                className={`
                  absolute bottom-0 left-0 w-full bg-blue-600 text-white p-5 
                  transition-all duration-300 ease-in-out
                  ${hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                  group-hover:translate-y-0 group-hover:opacity-100
                `}
                // Added a min-height or padding-bottom to ensure it pushes the card content up
                // and for consistent sizing when open, adjust as needed
                style={{ minHeight: '100%'}} // This makes it full height of the card
              >
                <h4 className="font-semibold mb-2">Servicios específicos:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {service.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;