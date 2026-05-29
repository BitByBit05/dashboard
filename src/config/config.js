import { config } from "dotenv";
config();

const _conf = {
  port: process.env.PORT,
  psqlPort: process.env.PSQL_PORT,
  psqlHost: process.env.PSQL_HOST,
  psqlUser: process.env.PSQL_USER,
  psqlDatabase: process.env.PSQL_DATABASE,
  psqlPassword: process.env.PSQL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
};

export const conf = Object.freeze(_conf);
