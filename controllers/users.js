const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const { generateSign, SALT_ROUNDS } = require('../utils/jwt');
const UserModel = require('../models/user');
const { errorResponse } = require('../utils/err-response');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError('Не передано одно из полей!');
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => UserModel.create({ email, password: hash, name }))
    .then(() => {
      res.send({ message: 'Успешная регистрация!' });
    })
    .catch((err) => {
      errorResponse(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передано одно из полей!');
  }
  UserModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Не верно введен email или пароль!');
    })
    .then((user) => ({
      user,
      isPasswordEqual: bcrypt.compareSync(password, user.password),
    }))
    .then(({ user, isPasswordEqual }) => {
      if (!isPasswordEqual) {
        throw new UnauthorizedError('Не верно введен email или пароль!');
      }
      const token = generateSign({ _id: user._id });
      return res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => UserModel.findById(req.user._id)
  .orFail(() => {
    throw new NotFoundError('Пользователь не найден!');
  })
  .then((user) => res.send(user))
  .catch(next);

const updateProfile = (req, res, next) => UserModel.findByIdAndUpdate(req.user._id, req.body,
  { new: true, runValidators: true })
  .orFail(() => {
    throw new NotFoundError('Пользователь не найден!');
  })
  .then((user) => res.send(user))
  .catch((err) => {
    errorResponse(err);
  })
  .catch(next);

module.exports = {
  getUser,
  createUser,
  login,
  updateProfile,
};
