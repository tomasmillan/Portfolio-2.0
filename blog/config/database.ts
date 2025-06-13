// path: ./config/database.ts
import { parse } from 'pg-connection-string'; 

export default ({ env }) => {
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
        rejectUnauthorized: false // Asegúrate de que esto siga aquí
      },
      // ¡AÑADE ESTE BLOQUE DE 'pool'!
      pool: {
        min: 2, // Mínimo de conexiones en el pool
        max: 10 // Máximo de conexiones en el pool
      },
      // Opcional: Si quieres un timeout explícito para adquirir conexiones del pool
      // acquireConnectionTimeout: 60000 // 60 segundos
    },
  };
};