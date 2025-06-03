import React from "react";

function Testimonies() {
  const testimonios = [
    {
      id: 1,
      nombre: "Lucía Fernández",
      rol: "Fundadora de VerdeCo",
      mensaje:
        "Trabajar con Tomás fue un placer. Captó exactamente lo que necesitábamos para nuestra tienda online y lo plasmó con mucha creatividad y profesionalismo.",
    },
    {
      id: 2,
      nombre: "Martín Rossi",
      rol: "CEO de Agencia Bruma",
      mensaje:
        "Responsable, resolutivo y con muy buen ojo para el diseño. Recomiendo a Tomás para cualquier proyecto digital que requiera impacto visual y funcionalidad.",
    },
    {
      id: 3,
      nombre: "Romina Gómez",
      rol: "Creadora de Healthy Romi",
      mensaje:
        "Me ayudó a lanzar mi marca desde cero, con una web hermosa y un sistema de contenido automatizado. Me sentí acompañada en todo el proceso.",
    },
  ];
  return (
    <div className="container mx-auto px-4 bg-gray-200 min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Testimonios</h1>
      <p className="text-center text-gray-600 mb-10">
        Lo que dicen quienes trabajaron conmigo
      </p>
      <div className="flex flex-wrap justify-evenly items-stretch">
        {testimonios.map((testimonio) => (
          <div
            key={testimonio.id}
            className="bg-gray-100 p-6 m-2 mb-4 w-80 shadow-md rounded flex flex-col justify-between"
          >
            <p className="text-gray-800 italic mb-4">“{testimonio.mensaje}”</p>
            <div className="border-t border-gray-300 pt-3">
              <h3 className="text-lg font-semibold">{testimonio.nombre}</h3>
              <p className="text-sm text-gray-600">{testimonio.rol}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonies;
