import express from 'express'
import { getEvents, createEvents } from '../controllers/events.js'

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvents);

export default router;