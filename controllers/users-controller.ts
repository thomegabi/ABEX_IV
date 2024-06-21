import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import { v4 as uuidv4 } from 'uuid';

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

  const { id, email, password } = req.body;

  const createdUser: User = {
    id: uuidv4(),
    email: email,
    password: password
  };

  if (TEST_USERS.find(u => u.email === email)) {
    throw new HttpError("This email is already in use!", 422);
  }

  TEST_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};
