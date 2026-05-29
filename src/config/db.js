import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "elib",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  // Keep a pool of up to 10 clients; idle ones are released after 30 s
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

// Verify connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("Failed to connect to PostgreSQL:", err.message);
  } else {
    console.log("Connected to PostgreSQL");
    release();
  }
});

export default pool;
