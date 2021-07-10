import Conversation from '../models/conversation.js';

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ 'Attendees.label': req.userName, 'Attendees.value': req.userId  }).sort({ UpdatedAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getConversation = async (req, res) => {
    const { id } = req.params;
    try {
        const conversation = await Conversation.findById(id);
        res.status(200).json(conversation);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const postMessage  = async (req, res) => {
    const { sender, message, timestamp, type, fileName, body } = req.body;
    const { id: roomId } = req.params;
    
    const conversation = await Conversation.findById(roomId);
    conversation.Messages.push({
        senderId: req.userId,
        sender: sender,
        message: message,
        timestamp: timestamp,
        type: type,
        fileName: fileName,
        body: body
    });
    conversation.UpdatedAt = timestamp;

    const updatedConversation = await Conversation.findByIdAndUpdate(roomId, conversation, { new: true });

    res.json(updatedConversation);
}

export const createConversation  = async (req, res) => {
    const convo = req.body;
    const newConversation = new Conversation({ ...convo });
    try {
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
