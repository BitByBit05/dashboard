import { register, checkExisting, getPassword } from "./user.model.js";
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
  if (await checkExisting(email)) {
    const passwordStored = await getPassword(email);
    if (await bcrypt.compare(password, passwordStored)) {
      res.status(201).json({ message: "logged in" });
      return;
    }
    res.status(409).json({ message: "wrong password" });
    return;
  }
  res.status(409).json({ message: "no user found!" });
  return;
}

export default { registerUser, loginUser };
