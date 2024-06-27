import { Request, Response, NextFunction } from 'express';
import { getUsers, login, signup, signIn, signUpUser, showSignUpPage } from '../../controllers/users-controller';
import HttpError from '../models/http-error';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('12345'),
}));

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const TEST_USERS = [
  {
    id: 'u1',
    email: 'test@mail.com',
    password: 'testest',
    fone: 40028922,
    active: true,
  },
];

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      send: jest.fn(),
      sendFile: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('getUsers', () => {
    it('should return a list of users', () => {
      getUsers(req as Request, res as unknown as Response, next);
  
      // HTML esperado
      const expectedHtml = `
        <html>
          <body>
            ID: u1, Email: test@mail.com, Password: testest, Fone: 40028922<br><br>
            <button onclick="window.location.href='/home';">Voltar ao Início</button>
          </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const receivedHtml = (res.send as jest.Mock).mock.calls[0][0].replace(/\s+/g, ' ').trim();

      expect(receivedHtml).toBe(expectedHtml);
    });
  });
  

  describe('signIn', () => {
    it('should send the login HTML file', () => {
      signIn(req as Request, res as Response, next);

      expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('login.html'), expect.any(Function));
    });

    it('should call next with an error if file not found', () => {
      (res.sendFile as jest.Mock).mockImplementationOnce((path, cb) => cb(new Error('File not found')));
      signIn(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new HttpError('File not found', 404));
    });
  });

  describe('signUpUser', () => {
    it('should send the signup HTML file', () => {
      signUpUser(req as Request, res as Response, next);

      expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('signup.html'), expect.any(Function));
    });

    it('should call next with an error if file not found', () => {
      (res.sendFile as jest.Mock).mockImplementationOnce((path, cb) => cb(new Error('File not found')));
      signUpUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new HttpError('File not found', 404));
    });
  });

  describe('showSignUpPage', () => {
    it('should send the index HTML file', () => {
      showSignUpPage(req as Request, res as Response, next);

      expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('index.html'), expect.any(Function));
    });

    it('should call next with an error if file not found', () => {
      (res.sendFile as jest.Mock).mockImplementationOnce((path, cb) => cb(new Error('File not found')));
      showSignUpPage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new HttpError('File not found', 404));
    });
  });

  describe('login', () => {
    it('should return a success message when the user logs in', () => {
      req.body = { email: 'test@mail.com', password: 'testest' };

      login(req as Request, res as Response, next);

      const expectedHtml = `
        <html>
          <body>
            Logged In!
            <br><br>
            <button onclick="window.location.href='/home';">HomePage</button>
          </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const receivedHtml = (res.send as jest.Mock).mock.calls[0][0].replace(/\s+/g, ' ').trim();
      expect(receivedHtml).toBe(expectedHtml);
    });

    it('should throw an error if the user is not found', () => {
      req.body = { email: 'wrong@mail.com', password: 'testest' };

      expect(() => login(req as Request, res as Response, next)).toThrow(HttpError);
    });
  });

  describe('signup', () => {
    it('should create a new user', () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });
      req.body = { email: 'newuser@mail.com', password: 'newpassword', fone: 99006677 };

      signup(req as Request, res as unknown as Response, next);

      const expectedHtml = `
        <html>
          <body>
            Usuário cadastrado com sucesso!
            <br><br>
            <button onclick="window.location.href='/home';">HomePage</button>
          </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const receivedHtml = (res.send as jest.Mock).mock.calls[0][0].replace(/\s+/g, ' ').trim();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(receivedHtml).toBe(expectedHtml);
    });

    it('should throw an error if the email is already in use', () => {
      req.body = { email: 'test@mail.com', password: 'testest', fone: 40028922 };

      expect(() => signup(req as Request, res as Response, next)).toThrow(HttpError);
    });

    it('should handle validation errors', () => {
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid Input' }]),
      };
      (validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);
    
      try {
        signup(req as Request, res as Response, next);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.message).toBe('Invalid Input detected, verify your data');
        expect(error.code).toBe(422);
      }
    
      expect(validationResult).toHaveBeenCalled();
    });
  });
});
