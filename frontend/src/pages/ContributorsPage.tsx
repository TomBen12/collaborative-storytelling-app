import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import API_URL from "../api";

interface Contributor {
  id: number;
  story_id: number;
  user_id: number;
}
const ContributorsPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [storyId, setStoryId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const fetchContributors = async () => {
    try {
      if (!storyId) return;
      const res = await axios.get(
        `${API_URL}
/api/contributors/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContributors(res.data);
    } catch (err) {
      console.error("Failed to fetch contributors", err);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, [storyId]);

  const handleAdd = async () => {
    try {
      const res = await axios.post(
        `${API_URL}
/api/contributors`,
        { story_id: storyId, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setContributors([...contributors, res.data]);
      setUserId("");
    } catch (err) {
      console.error("Failed to add contributor", err);
      alert("Failed to add contributor");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await axios.delete(
        `${API_URL}
/api/contributors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setContributors(contributors.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to remove contributor", err);
      alert("Failed to remove contributor");
    }
  };

  return (
    <div>
      <h2>Contributors Manager</h2>

      <input
        placeholder="Story ID"
        value={storyId}
        onChange={(e) => setStoryId(Number(e.target.value))}
      />
      <button onClick={fetchContributors}>Load Contributors</button>

      {contributors.length === 0 && <p>No contributors.</p>}

      <ul>
        {contributors.map((contributor) => (
          <li key={contributor.id}>
            User ID: {contributor.user_id}
            <button onClick={() => handleRemove(contributor.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Add Contributor</h3>
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
      />
      <button onClick={handleAdd}>Add Contributor</button>
    </div>
  );
};

export default ContributorsPage;
