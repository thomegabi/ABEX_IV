import express from 'express';
import { check } from 'express-validator';
import * as usersController from '../controllers/users-controller';

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('email').not().isEmpty().isEmail().normalizeEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

export default router;
