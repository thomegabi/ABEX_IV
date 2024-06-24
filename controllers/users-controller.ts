import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

interface User {
  id: string;
  email: string;
  password: string;
}

const TEST_USERS: User[] = [
  {
    id: 'u1',
    email: 'test@mail.com',
    password: 'testest'
  }
];

export const getUsers = (req: Request, res: Response, next: NextFunction): void => {
  res.json({ users: TEST_USERS });
};

export const login = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  const identified = TEST_USERS.find(u => u.email === email);

  if (!identified || identified.password !== password) {
    throw new HttpError("User not found, verify your password and email!", 401);
  }

  res.json({ message: "Logged in!" });
};

export const signup = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new HttpError("Invalid Input detected, verify your data", 422);
  }

  const { email, password } = req.body;

  if (TEST_USERS.find(u => u.email === email)) {
    throw new HttpError("This email is already in use!", 422);
  }

  const createdUser: User = {
    id: uuidv4(),
    email: email,
    password: password
  };

  TEST_USERS.push(createdUser);

  console.log(`Email: ${email}, Password: ${password}`);
  res.status(201).json({ user: createdUser });
};

export const signIn = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
};

export const signUpForm = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
};


export const result = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new HttpError("Invalid Input detected, verify your data", 422);
  }

  const { email, password } = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  res.send('Usuário cadastrado! Obrigado!');
};

export const showHomePage = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
};
