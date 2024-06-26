import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import usersRoutes from './routes/users-routes';
import formsRoutes from './routes/form-routes';
import homeRoutes from './routes/home-route';
import questionsRoutes from './routes/questions-routes';
import HttpError from './models/http-error';

export const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', usersRoutes);
app.use('/', formsRoutes);
app.use('/', homeRoutes);
app.use('/', questionsRoutes);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

