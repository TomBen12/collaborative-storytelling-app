import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import API_URL from "../api";

interface Story {
  id: number;
  title: string;
  content: string;
  author_id: number;
}

interface Contributor {
  id: number;
  story_id: number;
  user_id: number;
}

const StoriesPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [stories, setStories] = useState<Story[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const fetchContributors = async () => {
    try {
      const res = await axios.get(
        `${API_URL}
/api/contributors/all`,
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
    if (accessToken) {
      fetchContributors();
    }
  }, [accessToken]);

  // Fetch stories
  const fetchStories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}
/api/stories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setStories(res.data);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchStories();
    }
  }, [accessToken]);

  // Create story
  const handleCreate = async () => {
    if (!title || !content) {
      alert("Title and Content required");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}
/api/stories`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setStories([res.data, ...stories]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Failed to create story", err);
      alert("Failed to create story");
    }
  };

  // Delete story
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await axios.delete(
        `${API_URL}
/api/stories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setStories(stories.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete story", err);
      alert("Failed to delete story");
    }
  };

  // Start editing
  const handleStartEdit = (story: Story) => {
    setEditingStoryId(story.id);
    setEditTitle(story.title);
    setEditContent(story.content);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingStoryId(null);
    setEditTitle("");
    setEditContent("");
  };

  // Save edit
  const handleSaveEdit = async (id: number) => {
    try {
      const res = await axios.patch(
        `${API_URL}
/api/stories/${id}`,
        { title: editTitle, content: editContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setStories(stories.map((s) => (s.id === id ? res.data : s)));
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to update story", err);
      alert("Failed to update story");
    }
  };

  return (
    <div>
      <h2>All Stories</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Create New Story</h3>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button onClick={handleCreate}>Create Story</button>
      </div>

      {stories.length === 0 && <p>No stories found.</p>}
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            {editingStoryId === story.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <br />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <br />
                <button onClick={() => handleSaveEdit(story.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <p>
                  <strong>Author ID:</strong> {story.author_id}
                </p>

                {(story.author_id === userId ||
                  contributors.some((c) => c.story_id == story.id)) && (
                  <>
                    <button onClick={() => handleStartEdit(story)}>Edit</button>
                    {story.author_id === userId && (
                      <button onClick={() => handleDelete(story.id)}>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoriesPage;
