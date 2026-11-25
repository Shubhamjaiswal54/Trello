import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const BCRYPT_PREFIX = /^\$2[aby]\$/;

const signToken = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

const signupUser = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: "Enter a valid email" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  if (await userModel.exists({ email })) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists" });
  }

  const user = await userModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

const loginUser = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({ email }).select("+password");

  let isMatch = false;
  if (user) {
    if (BCRYPT_PREFIX.test(user.password)) {
      isMatch = await bcrypt.compare(password, user.password);
    } else if (password === user.password) {
      // Accounts created before hashing was introduced: upgrade on first login.
      isMatch = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ token: signToken(user), user: publicUser(user) });
};

const getMe = async (req, res) => {
  const user = await userModel.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user: publicUser(user) });
};

export { loginUser, signupUser, getMe };
