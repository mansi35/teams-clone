import mongoose from 'mongoose';
import Message from './message.js';

const convSchema = mongoose.Schema({
    Subject: String,
    UpdatedAt: {
        type: Date,
        default: new Date()
    },
    Attendees: [String],
    Messages: [Message]
});

const Conversation = mongoose.model('Conversation', convSchema);
export default Conversation;
