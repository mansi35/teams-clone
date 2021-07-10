import express from 'express'
import { getConversation, getConversations, postMessage, createConversation } from '../controllers/conversations.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getConversations);
router.get('/:id', auth, getConversation);
router.patch('/message/:id', auth, postMessage);
router.post('/conversation', auth, createConversation);

export default router;