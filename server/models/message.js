import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    senderId: String,
    sender: String,
    message: String,
    timestamp: {
        type: Date,
        default: new Date()
    }
});

export default messageSchema;
