const Card = require('../models/card');

// Подключим классы ошибок
const Error400 = require('../errors/Error400');
const Error500 = require('../errors/Error500');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      const baseError = new Error500('');
      next(baseError);
    });
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error400('Переданы некорректные данные при создании карточки');
        next(validationError);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new Error404('Карточки не существует'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new Error403('Нельзя удалить чужую карточку');
      } else {
        Card.deleteOne({ _id: cardId })
          .then(() => res.status(200).send({ data: card }))
          .catch(() => { next(new Error500('Ошибка на сервере')); });
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (err.statusCode === 403) {
        next(err);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error400('Переданы некорректные данные'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 400) {
        next(err);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error400('Переданы некорректные данные'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 400) {
        next(err);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};
