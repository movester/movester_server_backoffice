const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('./routes');
require('dotenv').config();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use('/api', router);
app.use('/uploads', express.static('uploads'));

let users = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
];

app.get('/users/:id', (req, res) => {
  const id = +req.params.id;
  if (Number.isNaN(id)) return res.status(400).end();
  const user = users.find(user => user.id === id);
  if (!user) return res.status(404).end();
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).end();
  if (users.find(user => user.name === name)) return res.status(409).end();
  const id = users.length + 1;
  const user = { id, name };
  users = [...users, user];
  res.status(201).json(user);
});
module.exports = app;
