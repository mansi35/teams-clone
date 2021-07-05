import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    senderId: String,
    sender: String,
    message: String,
    type: String,
    body: String,
    fileName: String,
    timestamp: {
        type: Date,
        default: new Date()
    }
});

export default messageSchema;
