import EventSchedule from '../models/eventSchedule.js'

export const getEvents = async (req, res) => {
    try {
        const eventSchedules = await EventSchedule.find();
        console.log(eventSchedules);
        res.status(200).json(eventSchedules);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createEvents = async (req, res) => {
    const event = req.body;
    const newEvent = new EventSchedule(event);
    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}