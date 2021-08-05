const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
// const { JWT_SECRET } = require('../configs');

// Подключим классы ошибок
const Error400 = require('../errors/Error400');
const Error500 = require('../errors/Error500');
const Error404 = require('../errors/Error404');
const Error409 = require('../errors/Error409');
const Error401 = require('../errors/Error401');

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error400('Email или пароль отсутствует'));
  }

  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new Error401('Неверный логин или пароль'));
      }

      bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            return next(new Error401('Неверный логин или пароль'));
          }

          jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' }, (err, token) => {
            if (err) {
              return next(new Error500('Ошибка на сервере'));
            }

            return res.send({ token });
          });
        })
        .catch(() => { next(new Error500('Ошибка на сервере')); });
    })
    .catch(() => { next(new Error500('Ошибка на сервере')); });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!email || !password) {
    return next(new Error400('Email или пароль отсутствует'));
  }

  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return next(new Error409('Пользователь с таким email уже есть в системе'));
      }

      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email, password: hash, name, about, avatar,
          })
            .then(({
              // eslint-disable-next-line no-shadow
              _id, name, about, avatar,
            }) => {
              res.status(200).send({
                _id, email, name, about, avatar,
              });
            })
            .catch(() => { next(new Error500('Ошибка на сервере')); });
        })
        .catch(() => { next(new Error500('Ошибка на сервере')); });
    })

    .catch(() => { next(new Error500('Ошибка на сервере')); });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => { next(new Error500('Ошибка на сервере')); });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => { next(new Error500('Ошибка на сервере')); });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error404('Пользователя нет в базе'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new Error404('Пользователь с указанным _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new Error500('Ошибка на сервере'));
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new Error404('Пользователь с указанным _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(new Error500('Ошибка на сервере'));
      }
    });
};
