const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("../routes/index");
const redis = require("redis");

const port = process.env.PORT || 8000;
const redisPort = process.env.PORT || 6379;

const client = redis.createClient(redisPort);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// app.use(helmet());
app.use("/", router);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Dev Server listening on port ${port}!`));
