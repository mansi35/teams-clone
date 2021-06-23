import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    Subject: String,
    IsAllDay: Boolean,
    StartTime: {
        type: Date,
        default: new Date()
    },
    EndTime: {
        type: Date,
        default: new Date()
    },
    Description: String,
    MeetingId: String,
});

const EventSchedule = mongoose.model('EventSchedule', eventSchema);
export default EventSchedule;