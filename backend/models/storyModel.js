import pool from "../db/dbConnect.js";

export const createStory = async (title, content, author_id) => {
  const result = await pool.query(
    "INSERT INTO Stories (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, author_id]
  );
  return result.rows[0];
};

export const getAllStories = async () => {
  const result = await pool.query(
    "SELECT * FROM Stories ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getStoryById = async (id) => {
  const result = await pool.query("SELECT * FROM Stories WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateStory = async (id, title, content) => {
  const result = await pool.query(
    "UPDATE Stories SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [title, content, id]
  );
  return result.rows[0];
};

export const deleteStory = async (id) => {
  const result = await pool.query(
    "DELETE FROM Stories WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
