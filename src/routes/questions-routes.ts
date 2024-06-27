import express from 'express';
import * as questionController from '../controllers/questions-controllers'

const router = express.Router();

router.get('/home/forms/questions', questionController.getQuestions);
router.get('/home/forms/creation', questionController.setQuestions);

router.post('/home/forms/questionUpload', questionController.createQuestion)

export default router;