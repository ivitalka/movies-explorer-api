const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateProfile } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
  }),
}), updateProfile);

module.exports = router;
