import User from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name _id email');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUsersBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const users = await User.find({ _id: { $in: searchQuery.split(',')} });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
