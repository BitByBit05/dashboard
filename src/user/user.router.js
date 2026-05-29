import ctrl from "./user.controller.js";
import express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({
    register: "/register",
    login: "/login",
  });
});

userRouter.post("/register", ctrl.registerUser);
userRouter.post("/login", ctrl.loginUser);

export default userRouter;
