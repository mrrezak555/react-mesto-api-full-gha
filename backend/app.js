require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { router } = require('./routes/index');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const INTERNAL_ERROR = 500;

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
//  app.use(express.static(path.join((__dirname, 'public'))))
app.use(requestLogger);
app.use(express.json());
app.use(errors());
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = INTERNAL_ERROR, message } = err;
  if (statusCode === INTERNAL_ERROR) {
    return res.status(INTERNAL_ERROR).send({ message: 'на сервере произошла ошибка' });
  }
  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  //  console.log(`App listening on port ${PORT}`);
});
