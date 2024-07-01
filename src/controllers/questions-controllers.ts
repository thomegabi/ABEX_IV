import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { randomUUID } from "crypto";


interface Pergunta {
  id: string;
  description: string;
  type: string;
  mandatory: boolean;
  formId: string;
}

let PERGUNTAS: Pergunta[] = [
  {
    id: 'q1',
    description: 'Qual é o seu nome?',
    type: 'descritiva',
    mandatory: true,
    formId: 'f1'
  },
  {
    id: 'q2',
    description: 'Qual é a sua idade?',
    type: 'descritiva',
    mandatory: true,
    formId: 'f1'
  },
];


export const getQuestions = (req: Request, res: Response, next: NextFunction): void => {
  const questionsString = PERGUNTAS.map(pergunta => `ID: ${pergunta.id}, Description: ${pergunta.description}, Type: ${pergunta.type}, Required: ${pergunta.mandatory}, Form_id: ${pergunta.formId}`).join('<br>');
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


export const getQuestionsByFormId = (req: Request, res: Response, next: NextFunction): void => {
  const { formId } = req.query;

  if (!formId || typeof formId !== 'string') {
    return next(new HttpError('Invalid form ID', 400));
  }

  const questionsForForm = PERGUNTAS.filter(pergunta => pergunta.formId === formId);

  if (questionsForForm.length === 0) {
    return next(new HttpError('No questions found for the provided form ID', 404));
  }


  const questionsString = questionsForForm.map(pergunta => `ID: ${pergunta.id}, Description: ${pergunta.description}, Type: ${pergunta.type}, Required: ${pergunta.mandatory}, Form_id: ${pergunta.formId}`).join('<br>');
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
  const { formId } = req.query; 
  if (!formId || typeof formId !== 'string') {
    next(new HttpError('Invalid form ID', 400));
    return;
  }
  console.log(formId)
  res.render('question-creation', { formId }, (err: any, html: string) => {
    if (err) {
      console.error('Error rendering view:', err);
      return next(new HttpError('File not found', 404));
    }
    res.send(html);
  });
};
 

export const createQuestion = (req: Request, res: Response, next: NextFunction): void => {
  const { formId } = req.query;
  console.log(`Form ID from query: ${formId}`);

  if (!formId || typeof formId !== 'string') {
    return next(new HttpError('Invalid form ID', 400));
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new HttpError('Invalid Input detected, verify your data', 422);
  }

  const { description, type, mandatory } = req.body;

  const newQuestion: Pergunta = {
    id: randomUUID(),
    description,
    type,
    mandatory: Boolean(mandatory),
    formId: formId,
  };

  PERGUNTAS.push(newQuestion);
  console.log(`Question Created: ${description}, With formId: ${formId}`);
  const htmlContent = `
    <html>
      <body>
        Pergunta Cadastrada com Sucesso!
        <br><br>
        <button onclick="window.location.href='/home';">Voltar ao Início</button>
        <button onclick="window.location.href='/home/forms/creation?formId=${formId}';">Create Another</button>
      </body>
    </html>
  `;
  res.status(201).send(htmlContent);
};
