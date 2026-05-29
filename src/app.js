import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./books/books.router.js";
import userRouter from "./user/user.router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── View engine ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/books", router);

// Root redirect
app.use("/users", userRouter);

// Fix 404 Handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found",
    code: 404,
    title: "404 Not Found", // Pass title here
  });
});

// Fix Global Error Handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: err.message,
    code: 500,
    title: "Internal Server Error", // Pass title here
  });
});

export default app;
