import express from 'express'
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, messageEvent } from '../controllers/events.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getEvents);
router.get('/:id', auth, getEvent);
router.post('/', auth, createEvent);
router.patch('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/eventMsg', auth, messageEvent);

export default router;