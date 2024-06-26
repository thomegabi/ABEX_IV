import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { randomUUID } from "crypto";


interface Pergunta {
  id: string;
  description: string;
  type: string;
  mandatory: boolean;
}

let PERGUNTAS: Pergunta[] = [
  {
    id: 'q1',
    description: 'Qual é o seu nome?',
    type: 'descritiva',
    mandatory: true,
  },
  {
    id: 'q2',
    description: 'Qual é a sua idade?',
    type: 'descritiva',
    mandatory: true,
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
 
export const createQuestion = (req: Request, res: Response, next: NextFunction): void => {
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
    mandatory,
  };

  PERGUNTAS.push(newQuestion);
  console.log(`Question Created: ${description}`);
  res.status(201).send('Pergunta cadastrada com sucesso!');
};
