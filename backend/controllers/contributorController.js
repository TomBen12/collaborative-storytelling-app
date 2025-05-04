import * as contributorModel from "../models/contributorModel.js";
import * as storyModel from "../models/storyModel.js";

export const add = async (req, res) => {
  try {
    const { story_id, user_id } = req.body;
    const story = await storyModel.getStoryById(story_id);

    if (!story) return res.status(404).json({ message: "Story not found." });
    if (story.author_id !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Only author can add contributors." });

    const contributor = await contributorModel.addContributor(
      story_id,
      user_id
    );
    res.status(201).json(contributor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const get = async (req, res) => {
  try {
    const { story_id } = req.params;

    const contributors = await contributorModel.getContributorsByStory(
      story_id
    );
    res.json(contributors);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const contributor = await contributorModel.removeContributor(id);
    if (!contributor)
      return res.status(404).json({ message: "Contributor not found." });

    res.json(contributor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const getAllContributors = async (req, res) => {
  try {
    const contributors = await contributorModel.getAllContributorsForUser(
      req.user.userId
    );
    res.json(contributors);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};