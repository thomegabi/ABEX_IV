import { Request, Response, NextFunction } from 'express';
import { getUsers, login, signup } from '../controllers/users-controller';
import HttpError from '../models/http-error';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('12345'),
}));

const TEST_USERS = [
  {
    id: 'u1',
    email: 'test@mail.com',
    password: 'testest',
  },
];

describe('getUsers', () => {
  it('should return the list of users', () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    getUsers(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ users: TEST_USERS });
  });
});

describe('login', () => {
  it('should return a success message when the user logs in', () => {
    const req = {
      body: { email: 'test@mail.com', password: 'testest' },
    } as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    login(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ message: 'Logged in!' });
  });

  it('should throw an error if the user is not found', () => {
    const req = {
      body: { email: 'wrong@mail.com', password: 'testest' },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => login(req, res, next)).toThrow(HttpError);
  });
});

describe('signup', () => {
  it('should create a new user', () => {
    const req = {
      body: { email: 'newuser@mail.com', password: 'newpassword' },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: '12345',
        email: 'newuser@mail.com',
        password: 'newpassword',
      },
    });
  });

  it('should throw an error if the email is already in use', () => {
    const req = {
      body: { email: 'test@mail.com', password: 'testest' },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => signup(req, res, next)).toThrow(HttpError);
  });
});
