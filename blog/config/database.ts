// backend/config/database.ts
import { parse } from 'pg-connection-string';

// Desestructuras las partes de la DATABASE_URL
const { host, database, user, password, port } = parse(process.env.DATABASE_URL || '');

export default ({ env }) => ({
  // Este es el único objeto 'connection' que Strapi espera aquí
  connection: {
    client: 'postgres', // Aquí especificas el cliente
    host: host, // Aquí usas directamente el host parseado
    port: Number(port), // Aquí usas directamente el puerto parseado
    database: database,
    user: user,
    password: password,
    ssl: {
      rejectUnauthorized: false,
    },
    // No olvides tu configuración de pool que añadimos antes, es importante
    pool: {
      min: 2,
      max: 10,
    },
  },
});