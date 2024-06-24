import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { v4 as uuidv4 } from 'uuid';
import path from "path";


interface Form{
  id: string ,
  name: string,
  description: string,
}

const FORM_TEST:  Form[] = [
{
  id: 'f1',
  name: 'test',
  description: 'formulario_teste'
}
];

export const getForms = (req: Request, res: Response,  next: NextFunction): void => {
  const formsString = FORM_TEST.map(user => `ID: ${user.id}, Name: ${user.name}, Description: ${user.description}`).join('<br>');
  res.send(`<html><body>${formsString}</body></html>`);
};

export const createForm = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'form-creation.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
}

export const fillForm = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new HttpError("Invalid Input detected, verify your data", 422);
  }

  const {name, description} = req.body;

  const createdForm: Form = {
    id: uuidv4(),
    name,
    description
  };

  FORM_TEST.push(createdForm);
  console.log(`Name: ${name}, Description: ${description}`);
  res.status(201).send('Formulário cadastrado com sucesso!');
}