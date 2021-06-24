import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    roomId: String,
    senderId: String,
    sender: String,
    message: String,
    timestamp: {
        type: Date,
        default: new Date()
    }
});

export default mongoose.model('Message', messageSchema);
