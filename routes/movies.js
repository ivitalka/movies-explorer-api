const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().alphanum().required(),
    director: Joi.string().alphanum().required(),
    duration: Joi.number().required(),
    year: Joi.string().alphanum().required(),
    description: Joi.string().alphanum().required(),
    image: Joi.string().uri().required(),
    trailer: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    movieId: Joi.string().alphanum(),
    nameRU: Joi.string().alphanum().required(),
    nameEN: Joi.string().alphanum().required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    Authorization: Joi.string(),
  }).unknown(true),
}), deleteMovie);

module.exports = router;
