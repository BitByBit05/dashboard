import { register, checkExisting, getPassword, getUserByEmail } from "./user.model.js";
import bcrypt from "bcrypt";
import { conf } from "../config/config.js";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  const { email, password, role } = req.body;

  if (await checkExisting(email)) {
    return res.status(409).json({ error: "User Already Exists !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const params = [email, hashedPassword, role];
  console.log("JWT_SECRET:", conf.jwtSecret);
  try {
    const { rows } = await register(params);
    const id = rows[0].id;
    console.log(`id: ${id}`);
    const accessToken = jwt.sign(
      {
        sub: id,
        email: email,
      },
      conf.jwtSecret,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      },
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 1000,
      })
      .json("Registration successfull");
  } catch (error) {
    console.error("Full error:", error); // This is the key
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: error });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(409).json({ error: "no user found!" });
    }

    const passwordStored = user.password_hash || user.password;
    if (await bcrypt.compare(password, passwordStored)) {
      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
        },
        conf.jwtSecret,
        {
          expiresIn: "1h",
          algorithm: "HS256",
        },
      );

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 1000,
        })
        .json({ message: "logged in" });
    }
    return res.status(409).json({ error: "wrong password" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function registerForm(req, res) {
  res.render("user/register", { title: "Register" });
}

async function loginForm(req, res) {
  res.render("user/login", { title: "Login" });
}

async function logoutUser(req, res) {
  res.clearCookie("accessToken", { path: "/" });
  res.redirect("/users/register");
}

export default { registerUser, loginUser, registerForm, logoutUser, loginForm };
