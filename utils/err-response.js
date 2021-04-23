const { MONGO_DUPLICATE_ERROR_CODE } = require('./constants');
const BadRequestError = require('../errors/bad-request-error');
const DuplicateError = require('../errors/duplicate-error');
const InternalError = require('../errors/internal-error');

const errorResponse = (err) => {
  if (err.statusCode) {
    throw err;
  }
  if (err.name === 'ValidationError') {
    throw new BadRequestError('Введены не корректные данные!');
  }
  if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
    throw new DuplicateError('Такой пользователь уже зарегистрирован!');
  }
  throw new InternalError('На сервере произошла ошибка!');
};

module.exports = { errorResponse };
