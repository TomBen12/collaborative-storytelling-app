import pool from "../db/dbConnect.js";

export const addContributor = async (story_id, user_id) => {
  const result = await pool.query(
    "INSERT INTO Contributors (story_id, user_id) VALUES ($1, $2) RETURNING *",
    [story_id, user_id]
  );
  return result.rows[0];
};

export const getContributorsByStory = async (story_id) => {
  const result = await pool.query(
    "SELECT * FROM Contributors WHERE story_id = $1",
    [story_id]
  );
  return result.rows;
};

export const removeContributor = async (id) => {
  const result = await pool.query(
    "DELETE FROM Contributors WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const isContributor = async (story_id, user_id) => {
  const result = await pool.query(
    "SELECT * FROM Contributors WHERE story_id = $1 AND user_id = $2",
    [story_id, user_id]
  );
  return result.rows.length > 0;
};

export const getAllContributorsForUser = async (userId) => {
  const res = await db.query("SELECT * FROM Contributors WHERE user_id = $1", [
    userId,
  ]);
  return res.rows;
};
