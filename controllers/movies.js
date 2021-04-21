const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const MovieModel = require('../models/movie');
const { errorResponse } = require('../utils/err-response');

const getMovies = (req, res, next) => MovieModel.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((err) => {
    errorResponse(err);
  })
  .catch(next);

const createMovie = (req, res, next) => MovieModel.create({ ...req.body, owner: req.user._id })
  .then((movie) => {
    res.status(200).send(movie);
  })
  .catch((err) => {
    errorResponse(err);
  })
  .catch(next);

const deleteMovie = (req, res, next) => {
  MovieModel.findById(req.params.movieId).select('+owner')
    .orFail(() => {
      throw new NotFoundError('Фильм не найден!');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        return MovieModel.findByIdAndRemove(movie._id)
          .then(() => res.status(200).send({ message: 'Фильм удален!' }));
      }
      throw new ForbiddenError('Нельзя удалить чужой фильм!');
    })
    .catch((err) => {
      errorResponse(err);
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
