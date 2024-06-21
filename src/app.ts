import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email } = req.body;
  console.log(`Nome: ${name}, Email: ${email}`);
  res.send('Formulário recebido! Obrigado!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
