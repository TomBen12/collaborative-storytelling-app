import bcrypt from "bcrypt";
import * as userModel from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(username, email, hashedPassword);

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token to client
    res.json({ accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token." });
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      const newAccessToken = generateAccessToken({ userId: user.userId });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error." });
  }
};
