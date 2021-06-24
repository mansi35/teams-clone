import EventSchedule from '../models/eventSchedule.js';
import mongoose from 'mongoose';

export const getEvents = async (req, res) => {
    try {
        const eventSchedules = await EventSchedule.find();
        res.status(200).json(eventSchedules);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createEvent  = async (req, res) => {
    const event = req.body;
    const newEvent = new EventSchedule(event);
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
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No event scheduled with that id.');
    }
    const updatedEvent = await EventSchedule.findByIdAndUpdate(_id, { ...changedEvent, _id }, { new: true });
    res.json(updatedEvent);
}

export const deleteEvent = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No event scheduled with that id.');
    }

    await EventSchedule.findByIdAndRemove(_id);
    res.json({ message: 'Post deleted successfully.' });
}