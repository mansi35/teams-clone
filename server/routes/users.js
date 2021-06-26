import express from 'express';

import { getUsers, getUsersBySearch } from '../controllers/users.js';

const router = express.Router();
router.get('/', getUsers);
router.get('/search', getUsersBySearch);

export default router;