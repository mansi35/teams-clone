import User from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name _id');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const user = await User.findById(_id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
