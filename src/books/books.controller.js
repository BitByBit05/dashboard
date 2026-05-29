import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "./books.model.js";

// GET /books  — list all (with optional ?search=)
async function index(req, res, next) {
  try {
    const search = req.query.search?.trim() || "";
    const books = await getAllBooks(search);
    res.render("books/index", { books, search, title: "Book Library" });
  } catch (err) {
    next(err);
  }
}

// GET /books/:id  — single book detail
async function show(req, res, next) {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).render("error", { message: "Book not found", code: 404 });
    res.render("books/detail", { book, title: book.title });
  } catch (err) {
    next(err);
  }
}

// GET /books/new  — show create form
function newForm(req, res) {
  res.render("books/form", {
    book: null,
    title: "Add New Book",
    action: "/books",
    method: "POST",
  });
}

// POST /books  — create book
async function create(req, res, next) {
  try {
    await createBook(req.body);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
}

// GET /books/:id/edit  — show edit form
async function editForm(req, res, next) {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).render("error", { message: "Book not found", code: 404 });
    res.render("books/form", {
      book,
      title: `Edit: ${book.title}`,
      action: `/books/${book.id}?_method=PUT`,
      method: "POST",
    });
  } catch (err) {
    next(err);
  }
}

// PUT /books/:id  — update book
async function update(req, res, next) {
  try {
    const updated = await updateBook(req.params.id, req.body);
    if (!updated) return res.status(404).render("error", { message: "Book not found", code: 404 });
    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

// DELETE /books/:id  — delete book
async function destroy(req, res, next) {
  try {
    await deleteBook(req.params.id);
    res.redirect("/books");
  } catch (err) {
    next(err);
  }
}

export default { index, show, newForm, create, editForm, update, destroy };
