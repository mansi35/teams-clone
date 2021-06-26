import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials." });
        
        const token = jwt.sign({ name: existingUser.name, email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist." });
        }
        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords don't match." });
        const encryptedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: encryptedPassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ name: result.name, email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: result, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const microsoftSignin = async (req, res) => {
    const { email, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        
        res.status(200).json({ result: existingUser });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export const microsoftSignup = async (req, res) => {
    const { email, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return microsoftSignin(req, res);
        }
        const result = await User.create({ email: email, name: name });
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}
