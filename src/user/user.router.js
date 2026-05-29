import ctrl from "./user.controller.js";
import express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({
    register: "/register",
    login: "/login",
  });
});

userRouter.get("/register", ctrl.registerForm);
userRouter.post("/register", ctrl.registerUser);
userRouter.get("/login", ctrl.loginForm);
userRouter.post("/login", ctrl.loginUser);
userRouter.get("/logout", ctrl.logoutUser);

export default userRouter;
