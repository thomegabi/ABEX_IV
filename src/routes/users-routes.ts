import express from 'express';
import { check } from 'express-validator';
import * as usersController from '../controllers/users-controller';

const router = express.Router();

router.get('/', usersController.showSignUpPage);
router.get('/users', usersController.getUsers);
router.get('/signIn', usersController.signIn);
router.get('/signUp', usersController.signUpUser);

router.post('/signup', [
  check('email').not().isEmpty().isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
], usersController.signup);

router.post('/login', [
  check('email').not().isEmpty().isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
], usersController.login);

export default router;
