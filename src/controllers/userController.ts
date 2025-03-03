import { Request, Response } from 'express';
import { User, Thoughts } from '../models/index.js';

// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get single user by ID
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        // BONUS: Remove user's associated thoughts
        await Thoughts.deleteMany({ username: user.username });

        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Add a friend
export const addFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Remove a friend
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};