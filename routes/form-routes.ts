import express from 'express';
import { check } from 'express-validator';
import * as formsController from '../controllers/form-controllers';

const router = express.Router();

router.get('/forms', formsController.getForms);
router.get('/createForm', formsController.createForm);

router.post('/fillForm',formsController.fillForm);

export default router;