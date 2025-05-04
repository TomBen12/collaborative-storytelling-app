import * as storyModel from "../models/storyModel.js";
import * as contributorModel from "../models/contributorModel.js";

export const create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author_id = req.user.userId;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required." });
    }

    const story = await storyModel.createStory(title, content, author_id);
    res.status(201).json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const getAll = async (req, res) => {
  try {
    const stories = await storyModel.getAllStories();
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await storyModel.getStoryById(id);
    if (!story) return res.status(404).json({ message: "Story not found." });
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const story = await storyModel.getStoryById(id);

    if (!story) return res.status(404).json({ message: "Story not found." });

    const isContributor = await contributorModel.isContributor(
      id,
      req.user.userId
    );

    if (story.author_id !== req.user.userId && !isContributor) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit." });
    }

    if (!title && !content) {
      return res.status(400).json({
        message:
          "Please provide at least one field to update (title or content).",
      });
    }

    const newTitle = title || story.title;
    const newContent = content || story.content;

    const updatedStory = await storyModel.updateStory(id, newTitle, newContent);
    res.json(updatedStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await storyModel.getStoryById(id);

    if (!story) return res.status(404).json({ message: "Story not found." });
    if (story.author_id !== req.user.userId)
      return res.status(403).json({ message: "You are not the author." });

    const deletedStory = await storyModel.deleteStory(id);
    res.json(deletedStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};
