import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { randomUUID } from "crypto";
import path from "path";


interface Pergunta {
  id: string;
  description: string;
  type: string;
  mandatory: boolean;
  //form_id: string;
}

let PERGUNTAS: Pergunta[] = [
  {
    id: 'q1',
    description: 'Qual é o seu nome?',
    type: 'descritiva',
    mandatory: true,
   // form_id: 'f1'
  },
  {
    id: 'q2',
    description: 'Qual é a sua idade?',
    type: 'descritiva',
    mandatory: true,
   // form_id: 'f1'
  },
];

export const getQuestions = (req: Request, res: Response, next: NextFunction): void => {
  const questionsString = PERGUNTAS.map(pergunta => `ID: ${pergunta.id}, Description: ${pergunta.description}, Type: ${pergunta.type}, Required: ${pergunta.mandatory}`).join('<br>');
  const htmlContent = `
    <html>
      <body>
        ${questionsString}
        <br><br>
        <button onclick="window.location.href='/home';">Voltar ao Início</button>
      </body>
    </html>
  `;
  res.send(htmlContent);
};

export const setQuestions = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'question-creation.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
}
 
export const createQuestion = (/*form_idt: string, */req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new HttpError("Invalid Input detected, verify your data", 422);
  }

  const { description, type, mandatory } = req.body;

  const newQuestion: Pergunta = {
    id: randomUUID(),
    description,
    type,
    mandatory: true,
    //form_id: form_idt
  };

  PERGUNTAS.push(newQuestion);
  console.log(`Question Created: ${description}`);
  res.status(201).send('Pergunta cadastrada com sucesso!');
};
