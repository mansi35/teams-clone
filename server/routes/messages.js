import express from 'express'
import { getMessages, sendMessage } from '../controllers/messages.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', auth, getMessages);
router.post('/:id', auth, sendMessage);

export default router;