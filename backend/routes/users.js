const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
// const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

// Не смог корректно импортировать,решил продублировать (ошибка лезла Warning: Accessing non-existent property 'userValidationSchema' of module exports inside circular dependency)
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

const userAvatarValidationSchema = {
  body: Joi.object({
    avatar: Joi.string().custom(linkValidator).required().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
};

const userInfoValidationSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).required().default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).required().default('Исследователь'),
  }),
};

router.get('/me', getCurrentUser);
router.get('/', celebrate(userValidationSchema), getUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().regex(/^[a-f\d]{24}$/i),
  }),
}), getUser);
router.patch('/me', celebrate(userInfoValidationSchema), updateUser);
router.patch('/me/avatar', celebrate(userAvatarValidationSchema), updateAvatar);

module.exports = router;
