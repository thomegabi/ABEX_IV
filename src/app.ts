import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import usersRoutes from '../routes/users-routes';
import formsRoutes from '../routes/form-routes';
import homeRoutes from '../routes/home-route';
import questionsRoutes from '../routes/questions-routes';
import HttpError from 'models/http-error';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', usersRoutes, formsRoutes, homeRoutes, questionsRoutes);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
