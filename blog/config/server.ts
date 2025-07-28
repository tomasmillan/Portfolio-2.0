  export default ({ env }) => ({
    // Define el host al que Strapi debe escuchar.
    // '0.0.0.0' hace que escuche en todas las interfaces de red,
    // lo cual es necesario cuando Nginx actúa como proxy.
    host: env('HOST', '0.0.0.0'),

    // Define el puerto en el que Strapi se ejecutará.
    // Nginx lo usará para reenviar las solicitudes.
    port: env.int('PORT', 1337),

    // Configuración de las claves de la aplicación para seguridad.
    // Es CRUCIAL que estas claves se carguen desde variables de entorno
    // y sean cadenas de texto aleatorias y muy largas.
    app: {
      keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']), // Proporciona valores por defecto para desarrollo si es necesario
    },

    // Define la URL pública donde Strapi será accesible.
    // Esto es VITAL cuando usas Nginx como proxy inverso,
    // ya que le dice a Strapi cómo generar URLs correctas (ej. para imágenes, APIs).
    url: env('PUBLIC_STRAPI_URL', 'https://portfolio-strapi-njtu.onrender.com'), // Valor por defecto para desarrollo
  });