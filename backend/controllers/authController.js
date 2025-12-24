import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createToken from "../utils/tokenCreate.js";

dotenv.config();

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Fields must not be empty" });
    }

    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exist" });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username",
      [email, username, password_hash]
    );

    const token = createToken(result.rows[0]);

    res.status(201).json({ message: result.rows[0], token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Fields must not be empty" });
    }

    const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userData.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = createToken(userData.rows[0]);

    const isMatch = await bcrypt.compare(
      password,
      userData.rows[0].password_hash
    );

    if (isMatch) {
      const user = userData.rows[0];
      delete user.password_hash;

      return res.status(200).json({ message: "Login successful", token, user });
    } else {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isAuth = async (req, res) => {
  try {
    const userQuery = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userQuery.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  register,
  login,
  isAuth,
};
