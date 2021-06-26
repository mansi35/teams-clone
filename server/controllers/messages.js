import Message from '../models/message.js';

export const getMessages = async (req, res) => {
    const { id: roomId } = req.params;
    try {
        const messages = await Message.find().where('roomId').equals(roomId).sort('timestamp', 1);
        res.status(200).json(messages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const sendMessage  = async (req, res) => {
    const message = req.body;
    const { id: roomId } = req.params;
    const newMessage = new Message({ ...message, senderId: req.userId, roomId: roomId });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}