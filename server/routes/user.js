import express from 'express';

import { microsoftSignup, signin, signup } from '../controllers/user.js';

const router = express.Router();
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/microsoftsignup', microsoftSignup);

export default router;