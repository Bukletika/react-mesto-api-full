const express = require('express');
const { celebrate, Joi } = require('celebrate');
const corsMiddleware = require('./cors');

const app = express();
const mongoose = require('mongoose');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { errors } = require('celebrate');
const { linkTest } = require('./constatns');
const auth = require('./middlewares/auth');

// Подключим классы ошибок
const Error404 = require('./errors/Error404');

const {
  login, createUser,
} = require('./controllers/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDb has starded...')) /* eslint-disable-line no-console */
  .catch((e) => console.log(e)); /* eslint-disable-line no-console */

app.use(corsMiddleware);

app.use('/', express.json());

app.use(requestLogger); // Подключаем логгер запросов

// Роуты, не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkTest),
  }),
}), createUser);

// Авторизация
app.use(auth);

// Роуты, которым авторизация нужна
app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new Error404('Ресурс не найден'));
});

// Обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use('*', require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line no-console */
});
