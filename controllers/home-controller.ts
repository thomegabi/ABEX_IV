import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import path from "path";


export const showSignUpPage = (req: Request, res: Response, next: NextFunction): void => {
  res.sendFile(path.join(__dirname, '../public', 'homePage.html'), (err) => {
    if (err) {
      next(new HttpError('File not found', 404));
    }
  });
};