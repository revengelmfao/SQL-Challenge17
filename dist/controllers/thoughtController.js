import { Thoughts as Thought, User } from '../models/index.js';
// Get all thoughts
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
// Get thought by ID
export const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
// Create a new thought
export const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        // Validate required fields
        if (!thoughtText || !username || !userId) {
            return res.status(400).json({
                message: 'Missing required fields: thoughtText, username, and userId are all required'
            });
        }
        // Verify the user exists before creating the thought
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: `User with ID ${userId} not found` });
        }
        // Create the thought
        const thought = await Thought.create({
            thoughtText,
            username,
        });
        // Add thought to the associated user's thoughts array
        const updatedUser = await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } }, { new: true }).populate('thoughts');
        // Return both the thought and updated user
        res.status(201).json({
            thought,
            message: 'Thought created successfully and added to user',
            user: {
                _id: updatedUser?._id,
                username: updatedUser?.username,
                thoughtCount: updatedUser?.thoughts.length
            }
        });
    }
    catch (err) {
        console.error('Error creating thought:', err);
        res.status(500).json({
            message: 'Failed to create thought',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};
// Update a thought
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true, runValidators: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
// Delete a thought
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Remove thought from user's thoughts array
        await User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
        res.json({ message: 'Thought deleted!' });
    }
    catch (err) {
        res.status(500).json(err);
    }
};
// Add reaction to thought
export const addReaction = async (req, res) => {
    try {
        // Validate required fields
        const { reactionBody, username } = req.body;
        if (!reactionBody || !username) {
            return res.status(400).json({
                message: 'Missing required fields: reactionBody and username are required'
            });
        }
        // Create a reaction with proper structure including auto-generated reactionId
        const newReaction = {
            reactionBody,
            username,
            // MongoDB will generate the reactionId automatically based on schema default
        };
        // Add the reaction to the thought's reactions array
        const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: newReaction } }, { new: true, runValidators: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json({
            message: 'Reaction added successfully',
            thought: updatedThought
        });
    }
    catch (err) {
        console.error('Error adding reaction:', err);
        res.status(500).json({
            message: 'Failed to add reaction',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};
// Remove reaction from thought
export const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
