const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkTest } = require('../constatns');
const {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkTest),
  }),
}), updateUserAvatar);

module.exports = router;
