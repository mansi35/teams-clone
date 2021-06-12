import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    result: {
        type: Array,
        default: []
    },
    count: Number
});

const EventSchedule = mongoose.model('EventSchedule', eventSchema);
export default EventSchedule;