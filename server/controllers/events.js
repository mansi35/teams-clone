import EventSchedule from '../models/eventSchedule.js';

export const getEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await EventSchedule.findById(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getEventByCreatorIdDate = async (req, res) => {
    const { date: date } = req.params;
    try {
        const event = await EventSchedule.findOne(
            {$and: [
                { StartTime: new Date(date) },
                { CreatorId: req.userId }
            ]}
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getEvents = async (req, res) => {
    try {
        const eventSchedules = await EventSchedule.find({ 
            $or: [ 
                { CreatorId: req.userId }, 
                { Attendees: req.userName + ',' + req.userId }
            ]     
        }).sort({ UpdatedAt: -1 });
        res.status(200).json(eventSchedules);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createEvent  = async (req, res) => {
    const event = req.body;
    const newEvent = new EventSchedule({ ...event, CreatorId: req.userId });
    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateEvent  = async (req, res) => {
    const { id: _id } = req.params;
    const changedEvent = req.body;
    try {
        const updatedEvent = await EventSchedule.findByIdAndUpdate(_id, { ...changedEvent, _id }, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const updateEventByCreatorIdDate  = async (req, res) => {
    const { date: date } = req.params;
    const changedEvent = req.body;
    try {
        const updatedEvent = await EventSchedule.findOneAndUpdate(
            {$and: [
                { StartTime: new Date(date) },
                { CreatorId: req.userId }
            ]}, 
            { ...changedEvent }, 
            { new: true }
        );
        res.json(updatedEvent);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const deleteEvent = async (req, res) => {
    const { id: _id } = req.params;
    try {
        await EventSchedule.findByIdAndRemove(_id);
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const deleteEventByCreatorIdDate = async (req, res) => {
    const { date: date } = req.params;
    try {
        await EventSchedule.findOneAndDelete(
            {$and: [
                { StartTime: new Date(date) },
                { CreatorId: req.userId }
            ]}
        );
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


export const messageEvent  = async (req, res) => {
    const { sender, message, timestamp, type, fileName, body } = req.body;
    const { id: roomId } = req.params;
    
    const event = await EventSchedule.findById(roomId);
    event.Messages.push({
        senderId: req.userId,
        sender: sender,
        message: message,
        timestamp: timestamp,
        type: type,
        fileName: fileName,
        body: body
    });
    event.UpdatedAt = timestamp;

    const updatedEvent = await EventSchedule.findByIdAndUpdate(roomId, event, { new: true });

    res.json(updatedEvent);

}