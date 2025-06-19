/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la redirección
const strapiBaseUrl =
  import.meta.env.VITE_STRAPI_API_URL ||
  "https://portfolio-20-production-96a6.up.railway.app";
function Contact() {
  const navigate = useNavigate(); // Hook para la navegación
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    pais: "",
    mensaje: "",
  });
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' o 'error'
  // Efecto para la redirección automática en caso de éxito
  useEffect(() => {
    if (modalType === "success" && showModal) {
      const timer = setTimeout(() => {
        setShowModal(false); // Oculta el modal
        navigate("/"); // Redirige a la página de inicio
      }, 5000); // 5 segundos
      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta o el estado cambia
    }
  }, [modalType, showModal, navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false); // Asegurarse de que el modal no esté visible antes de enviar
    try {
      const res = await fetch(`${strapiBaseUrl}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
        }),
      });
      if (res.ok) {
        setModalMessage(
          "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
        );
        setModalType("success");
        setShowModal(true);
        setFormData({ nombre: "", email: "", pais: "", mensaje: "" }); // Limpia el formulario
      } else {
        const errorData = await res.json();
        console.error("Error details:", errorData);
        setModalMessage(
          "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo."
        );
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setModalMessage("Error de conexión. No pudimos llegar al servidor.");
      setModalType("error");
      setShowModal(true);
    }
  };
  const handleTryAgain = () => {
    setShowModal(false); // Oculta el modal de error para permitir reintento // No reseteamos el formulario aquí, para que el usuario pueda corregir y reintentar
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
           {" "}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
               {" "}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    ¿Charlamos?        {" "}
        </h1>
               {" "}
        <p className="text-center text-gray-500 mb-8 max-w-lg mx-auto">
                    Si alguna idea te está rondando la cabeza, dejámela por acá.{" "}
          <br />           Suelo responder en cuanto termino el café.        {" "}
        </p>
                {/* Iconos de redes sociales */}       {" "}
        <div className="flex justify-center gap-6 mb-8 text-gray-600">
                   {" "}
          <a
            href="https://www.youtube.com/@MyTomol"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-400"
          >
                       {" "}
            <svg
              className="h-[42px]"
              viewBox="0 0 40 29"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
                           {" "}
              <path
                d="M39.4555 5.17846C38.9976 3.47767 37.6566 2.13667 35.9558 1.67876C32.8486 0.828369 20.4198 0.828369 20.4198 0.828369C20.4198 0.828369 7.99099 0.828369 4.88379 1.64606C3.21571 2.10396 1.842 3.47767 1.38409 5.17846C0.566406 8.28567 0.566406 14.729 0.566406 14.729C0.566406 14.729 0.566406 21.2051 1.38409 24.2796C1.842 25.9804 3.183 27.3214 4.88379 27.7793C8.0237 28.6297 20.4198 28.6297 20.4198 28.6297C20.4198 28.6297 32.8486 28.6297 35.9558 27.812C37.6566 27.3541 38.9976 26.0131 39.4555 24.3123C40.2732 21.2051 40.2732 14.7618 40.2732 14.7618C40.2732 14.7618 40.3059 8.28567 39.4555 5.17846Z"
                fill="currentColor"
              />
                           {" "}
              <path
                d="M16.4609 8.77612V20.6816L26.7966 14.7289L16.4609 8.77612Z"
                fill="white"
              />
                         {" "}
            </svg>
                     {" "}
          </a>
                   {" "}
          <a
            href="https://www.linkedin.com/in/tomasmillanlanhozo/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-400"
          >
                       {" "}
            <svg
              className="h-[42px]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
                           {" "}
              <path d="M19 0H5C2.24 0 0 2.24 0 5V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19V5C24 2.24 21.76 0 19 0ZM7 20H4V9H7V20ZM5.5 7.5C4.4 7.5 3.5 6.6 3.5 5.5C3.5 4.4 4.4 3.5 5.5 3.5C6.6 3.5 7.5 4.4 7.5 5.5C7.5 6.6 6.6 7.5 5.5 7.5ZM20 20H17V14C17 12.9 16.1 12 15 12C13.9 12 13 12.9 13 14V20H10V9H13V10.5C13.75 9.5 15 9 16.5 9C18.98 9 20 10.92 20 13.5V20Z" />
                         {" "}
            </svg>
                     {" "}
          </a>
                   {" "}
          <a
            href="https://github.com/tomasmillan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-400"
          >
                       {" "}
            <svg
              className="h-[42px]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
                           {" "}
              <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5C0 17.78 3.44 22.21 8.21 23.67C8.82 23.78 9.05 23.42 9.05 23.12C9.05 22.86 9.04 22.11 9.03 21.17C5.67 21.91 4.97 19.6 4.97 19.6C4.42 18.19 3.63 17.84 3.63 17.84C2.55 17.16 3.72 17.18 3.72 17.18C4.91 17.26 5.54 18.41 5.54 18.41C6.63 20.2 8.34 19.68 9.05 19.37C9.15 18.6 9.44 18.09 9.77 17.77C7.13 17.44 4.38 16.41 4.38 11.69C4.38 10.39 4.86 9.33 5.62 8.5C5.51 8.17 5.1 6.92 5.72 5.19C5.72 5.19 6.68 4.86 9 6.48C9.91 6.24 10.91 6.12 11.91 6.12C12.91 6.12 13.91 6.24 14.82 6.48C17.14 4.86 18.1 5.19 18.1 5.19C18.72 6.92 18.31 8.17 18.2 8.5C18.96 9.33 19.44 10.39 19.44 11.69C19.44 16.42 16.69 17.44 14.05 17.76C14.46 18.15 14.82 18.87 14.82 19.94C14.82 21.41 14.81 22.65 14.81 23.12C14.81 23.42 15.04 23.79 15.66 23.67C20.42 22.21 23.86 17.78 23.86 12.5C24 5.87 18.63 0.5 12 0.5Z" />
                         {" "}
            </svg>
                     {" "}
          </a>
                 {" "}
        </div>
                {/* Formulario de contacto */}       {" "}
        <form className="space-y-6" onSubmit={handleSubmit}>
                   {" "}
          <div>
                       {" "}
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-gray-700"
            >
                            Nombre            {" "}
            </label>
                       {" "}
            <input
              type="text"
              id="nombre"
              name="nombre"
              autoComplete="name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
            />
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
                            Correo Electrónico            {" "}
            </label>
                       {" "}
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="correo@ejemplo.com"
              value={formData.email || ""}
              onChange={handleChange}
            />
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <label
              htmlFor="pais"
              className="block text-sm font-semibold text-gray-700"
            >
                            País            {" "}
            </label>
                       {" "}
            <input
              type="text"
              id="pais"
              name="pais"
              autoComplete="pais"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Argentina"
              value={formData.pais || ""}
              onChange={handleChange}
            />
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <label
              htmlFor="mensaje"
              className="block text-sm font-semibold text-gray-700"
            >
                            Mensaje            {" "}
            </label>
                       {" "}
            <textarea
              id="mensaje"
              name="mensaje"
              rows="4"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Contame en qué estás pensando..."
              value={formData.mensaje || ""}
              onChange={handleChange}
            ></textarea>
                     {" "}
          </div>
                   {" "}
          <div className="text-center">
                       {" "}
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-600 transition shadow-md"
            >
                            Enviar mensaje            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </form>
             {" "}
      </div>
            {/* Modal personalizado */}     {" "}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                   {" "}
          <div
            className={`bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full transform transition-all duration-300 ease-out 
              ${
              modalType === "success"
                ? "border-t-4 border-green-500"
                : "border-t-4 border-red-500"
            }`}
          >
                       {" "}
            <div className="text-5xl mb-4">
                            {modalType === "success" ? "✅" : "❌"}           {" "}
            </div>
                       {" "}
            <h3
              className={`text-xl font-semibold mb-3 ${
                modalType === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
                            {modalMessage}           {" "}
            </h3>
                       {" "}
            {modalType === "success" ? (
              <p className="text-gray-600 text-sm">
                                Serás redirigido en 5 segundos...              {" "}
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-5 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transition shadow-md"
              >
                                Intentar de Nuevo              {" "}
              </button>
            )}
            {" "}
          </div>
          {" "}
        </div>
      )}
      {" "}
    </div>
  );
}
export default Contact;
