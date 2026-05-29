import pool from "../config/db.js";

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all books, optionally filtered by a search term.
 * @param {string} [search] - Optional title/author search string
 * @returns {Promise<Array>}
 */
//ternary operator
export async function getAllBooks(search = "") /* Default Parameters*/ {
  const query = search
    ? `SELECT * FROM books
       WHERE title ILIKE $1 OR author ILIKE $1
       ORDER BY created_at DESC`
    : `SELECT * FROM books ORDER BY created_at DESC`;

  const params = search ? [`%${search}%`] : [];
  const { rows } = await pool.query(query, params);
  return rows;
}

/**
 * Fetch a single book by its ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function getBookById(id) {
  const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return rows[0] || null;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new book record.
 * @param {{ title: string, author: string, genre: string, published_year: number }} data
 * @returns {Promise<Object>} The newly created row
 */
export async function createBook({ title, author, genre, published_year }) {
  const { rows } = await pool.query(
    `INSERT INTO books (title, author, genre, published_year)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, author, genre, published_year],
  );
  return rows[0];
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update an existing book by ID.
 * @param {number} id
 * @param {{ title: string, author: string, genre: string, published_year: number }} data
 * @returns {Promise<Object|null>} The updated row, or null if not found
 */
export async function updateBook(id, { title, author, genre, published_year }) {
  const { rows } = await pool.query(
    `UPDATE books
     SET title = $1, author = $2, genre = $3, published_year = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title, author, genre, published_year, id],
  );
  return rows[0] || null;
}

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete a book by ID.
 * @param {number} id
 * @returns {Promise<boolean>} True if a row was deleted
 */
export async function deleteBook(id) {
  const { rowCount } = await pool.query("DELETE FROM books WHERE id = $1", [id]);
  return rowCount > 0;
}
