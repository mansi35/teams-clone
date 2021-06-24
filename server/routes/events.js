import express from 'express'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/events.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getEvents);
router.post('/', auth, createEvent);
router.patch('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default router;