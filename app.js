const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const limiter = require('./utils/limiter');
const generalRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const { NODE_ENV, MONGO_DB } = process.env;
const { PORT = 3000 } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use('*', cors(options));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use('/', generalRouter);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
app.listen(PORT);
