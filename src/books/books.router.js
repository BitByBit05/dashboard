import express from "express";
const router = express.Router();
import ctrl from "./books.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Support PUT/DELETE from HTML forms via ?_method=
import methodOverride from "method-override";
router.use(methodOverride("_method"));

router.get("/", ctrl.index); // List all books
router.get("/new", verifyToken, ctrl.newForm); // Show create form  ← must be BEFORE /:id
router.get("/:id", ctrl.show); // Show single book
router.post("/", verifyToken, ctrl.create); // Create book
router.get("/:id/edit", verifyToken, ctrl.editForm); // Show edit form
router.put("/:id", verifyToken, ctrl.update); // Update book
router.delete("/:id", verifyToken, ctrl.destroy); // Delete book

export default router;
