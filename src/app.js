import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { conf } from "./config/config.js";
import router from "./books/books.router.js";
import userRouter from "./user/user.router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── View engine ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Set global user context for all rendered EJS views
app.use((req, res, next) => {
  const token = req.cookies?.accessToken;
  res.locals.user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, conf.jwtSecret);
      res.locals.user = decoded;
    } catch (err) {
      res.clearCookie("accessToken");
    }
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/books", router);

// Root redirect / user auth routes
app.use("/users", userRouter);
app.use("/user", userRouter); // Support singular /user as well

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
