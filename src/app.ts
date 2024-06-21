import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import usersRoutes from '../routes/users-routes'
import HttpError from 'models/http-error';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/users', usersRoutes);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email } = req.body;
  console.log(`Nome: ${name}, Email: ${email}`);
  res.send('Formulário recebido! Obrigado!');
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
