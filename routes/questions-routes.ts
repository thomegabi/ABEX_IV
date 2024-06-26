import express from 'express';
import * as questionController from '../controllers/questions-controllers'

const router = express.Router();

router.get('/home/fillform/questions', questionController.getQuestions);

export default router;