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

export const getForms = (req: Request, res: Response, next: NextFunction): void => {
  const formsString = FORM_TEST.map(form => `ID: ${form.id}, Name: ${form.name}, Description: ${form.description}`).join('<br>');
  const htmlContent = `
    <html>
      <body>
        ${formsString}<button onclick="window.location.href='/home/forms/questions';">Perguntas</button>
        <br><br>
        <button onclick="window.location.href='/home';">Voltar ao Início</button>
      </body>
    </html>
  `;
  res.send(htmlContent);
};

export const createForm = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'form-creation.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
}

// Métodos setters
export const fillForm = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return next(new HttpError("Invalid Input detected, verify your data", 422));
  }

  const { name, description } = req.body;

  const createdForm: Form = {
    id: uuidv4(),
    name,
    description
  };

  FORM_TEST.push(createdForm);
  console.log(`Name: ${name}, Description: ${description}`);

  res.redirect(`/home/forms/creation?formId=${createdForm.id}`);
};