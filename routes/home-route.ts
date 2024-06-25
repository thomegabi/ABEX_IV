import express from 'express';
import * as homeController from '../controllers/home-controller';

const router = express.Router();

router.get('/home', homeController.showSignUpPage);


export default router;