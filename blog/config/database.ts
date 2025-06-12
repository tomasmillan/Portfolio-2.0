// path: ./config/database.ts (o .js)

// Si no tienes 'pg-connection-string' instalado, en tu terminal (en la carpeta 'blog'):
// npm install pg-connection-string
import { parse } from 'pg-connection-string'; 

export default ({ env }) => {
  // Strapi intentará leer la variable de entorno 'DATABASE_URL'
  // Cuando despliegues en Render, Render inyectará automáticamente
  // la URL de tu base de datos en esta variable de entorno.
  const config = parse(env('DATABASE_URL') as string); 

  return {
    connection: {
      client: 'postgres',
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: {
        rejectUnauthorized: false // Esto a menudo es necesario para que funcione con Render
      },
    },
  };
};