import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as formController from '../controllers/form-controllers';
import HttpError from '../models/http-error';
import { v4 as uuidv4 } from 'uuid';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => '12345'),
}));

describe('Form Controller', () => {
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
    };
    next = jest.fn();
  });

  describe('getForms', () => {
    it('should return a list of forms', () => {
      formController.getForms(req as Request, res as unknown as Response, next);

      const expectedHtml = `
        <html>
          <body>
            ID: f1, Name: test, Description: formulario_teste
            <br><br>
            <button onclick="window.location.href='/home';">Voltar ao Início</button>
          </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const receivedHtml = (res.send as jest.Mock).mock.calls[0][0].replace(/\s+/g, ' ').trim();
      expect(receivedHtml).toBe(expectedHtml.trim());
    });
  });

  describe('createForm', () => {
    it('should send the form creation HTML file', () => {
      formController.createForm(req as Request, res as Response, next);

      expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('form-creation.html'), expect.any(Function));
    });

    it('should call next with an error if file not found', () => {
      (res.sendFile as jest.Mock).mockImplementationOnce((path, cb) => cb(new Error('File not found')));
      formController.createForm(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new HttpError('File not found', 404));
    });
  });

  describe('fillForm', () => {
    it('should create a form and return success message', () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });
      req.body = { name: 'Test Form', description: 'This is a test form.' };

      formController.fillForm(req as Request, res as unknown as Response, next);

      const expectedHtml = `
        <html>
          <body>
            Formulário Test Form: This is a test form.<br><br> Cadastrádo com sucesso!
            <br><br>
            <button onclick="window.location.href='/home/fillform/questions';">Next</button>
            <button onclick="window.location.href='/home';">Return</button>
          </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const receivedHtml = (res.send as jest.Mock).mock.calls[0][0].replace(/\s+/g, ' ').trim();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(receivedHtml).toBe(expectedHtml.trim());
    });

    it('should handle validation errors', () => {
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: 'Invalid Input' }]),
      };
      (validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);
    
      try {
        formController.fillForm(req as Request, res as Response, next);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.message).toBe('Invalid Input detected, verify your data');
        expect(error.code).toBe(422);
      }
    
      expect(validationResult).toHaveBeenCalled();
    });
  });
});
