import pool from "../config/db.js";

export async function register(params) {
  const query = `
    INSERT INTO users (email, password_hash, role) 
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  const response = await pool.query(query, params);
  return response;
}

export async function checkExisting(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows.length > 0;
}

export async function getPassword(email) {
  const query = `SELECT password FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0].password;
}

export async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}
