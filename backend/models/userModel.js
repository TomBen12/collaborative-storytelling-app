import pool from "../db/dbConnect.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const createUser = async (username, email, password_hash) => {
  return pool.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
    [username, email, password_hash]
  );
};
