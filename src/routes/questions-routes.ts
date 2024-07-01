import express from 'express';
import * as questionController from '../controllers/questions-controllers'

const router = express.Router();

router.get('/home/allQuestions', questionController.getQuestions);
router.get('/home/forms/creation', questionController.setQuestions);
router.get('/home/forms/questions', questionController.getQuestionsByFormId)

router.post('/home/forms/questionUpload', questionController.createQuestion)

export default router;