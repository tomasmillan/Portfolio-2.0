import { parse } from 'pg-connection-string';

const { host, database, user, password, port } = parse(process.env.DATABASE_URL || '');

export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host,
      port: Number(port),
      database,
      user,
      password,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
});
