const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const MovieModel = require('../models/movie');
const { errorResponse } = require('../utils/err-response');

const getMovies = (req, res, next) => MovieModel.find({ owner: req.user._id })
  .then((movies) => {
    console.log(req.user._id);
    res.send(movies);
  })
  .catch((err) => {
    errorResponse(err);
  })
  .catch(next);

const createMovie = (req, res, next) => MovieModel.create({ ...req.body, owner: req.user._id })
  .then((movie) => {
    res.send(movie);
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
        return movie.remove()
          .then(() => res.send({ message: 'Фильм удален!' }));
      }
      throw new ForbiddenError('Нельзя удалить чужой фильм!');
    })
    .catch((err) => {
      errorResponse(err);
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
