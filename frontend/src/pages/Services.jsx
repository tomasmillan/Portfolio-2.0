import React from "react";
function Services() {
  const services = [
    {
      title: "Landing Pages",
      image: "/images/landing.jpg",
      description:
        "Diseño de páginas enfocadas en conversión para lanzamientos, campañas o productos.",
    },
    {
      title: "Diseño Web Estratégico",
      image: "/images/web.jpg",
      description:
        "Sitios web modernos con identidad visual, navegación clara y optimización técnica.",
    },
    {
      title: "SEO & Performance",
      image: "/images/seo.jpg",
      description:
        "Auditoría, mejoras técnicas, estructura y posicionamiento en buscadores.",
    },
    {
      title: "Contenido para Redes",
      image: "/images/social.jpg",
      description:
        "Diseño de carouseles, portadas y branding visual para Instagram, TikTok y más.",
    },
  ];

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
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Services;
