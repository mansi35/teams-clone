import express from 'express'
import { getEvents, createEvent } from '../controllers/events.js'

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);

export default router;