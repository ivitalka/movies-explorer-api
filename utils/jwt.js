const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

const generateSign = (payload) => jwt.sign({ payload },
  NODE_ENV === 'production' ? JWT_SECRET : 'very_secret',
  { expiresIn: '7d' });

module.exports = { generateSign, JWT_SECRET, SALT_ROUNDS };
