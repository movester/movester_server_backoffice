const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const redis = require('redis');
const router = require('../routes/index');

const port = process.env.PORT || 8000;
const redisPort = process.env.PORT || 6379;

// eslint-disable-next-line no-unused-vars
const client = redis.createClient(redisPort);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(helmet());
app.use('/', router);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Dev Server listening on port ${port}!`));
