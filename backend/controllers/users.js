const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const EmailError = require('../errors/EmailError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;

const NO_ERROR = 200;

const getUsers = (req, res, next) => User.find({}).then((users) => res.status(NO_ERROR).send(users))
  .catch(
    (err) => {
      next(err);
    },
  );

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (user) {
        res.status(NO_ERROR).send(user);
      } else {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch(
      (err) => {
        if (err.name === 'CastError') {
          return next(new ValidationError('Ошибка валидации запроса'));
        }
        return next(err);
      },
    );
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      user.password = undefined;
      res.send({ user });
    })
    .catch(
      (err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Ошибка валидации запроса'));
        } if (err.code === 11000) {
          return next(new EmailError('Пользователь с таким email уже существует'));
        }
        return next(err);
      },
    );
};

const updateUser = (req, res, next) => {
  // обновим имя найденного по _id пользователя
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Невалидный идентификатор пользователя.'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Невалидный идентификатор пользователя.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  User.find({ email }).select('+password')
    .then((userData) => {
      if (!userData[0]) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, userData[0].password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return next(new UnauthorizedError('Что-то не так с почтой или паролем'));
          }
          const jwtToken = jwt.sign({ _id: userData[0]._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
          // аутентификация успешна
          return res.send({ token: jwtToken });
        })
        .catch(
          (err) => {
            next(err);
          },
        );
    });
};

const getCurrentUser = (req, res, next) => {
  const {
    _id,
  } = req.user;
  User.findById({ _id })
    .then((userData) => {
      if (userData) {
        res.status(200).send({ userData });
      } else {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch(
      (err) => {
        next(err);
      },
    );
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
