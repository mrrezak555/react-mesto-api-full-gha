const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');

const NotFoundError = require('../errors/NotFoundError');

// Собственный валидатор для ссылок
const linkValidator = (value, helpers) => {
  // Проверка на корректность ссылки
  if (!value.match(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)) {
    return helpers.message('Некорректная ссылка');
  }

  return value;
};

const userValidationSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().custom(linkValidator).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);
router.post('/signup', celebrate(userValidationSchema), createUser);
router.use((req, res, next) => next(new NotFoundError('Проверьте корректность пути запроса')));

module.exports = {
  router,
  userValidationSchema,
};
