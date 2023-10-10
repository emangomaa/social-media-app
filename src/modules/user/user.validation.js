import Joi from "joi";

const updateUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  firstName: Joi.string().min(2).max(15),
  lastName: Joi.string().min(2).max(15),
  userName: Joi.string().min(2).max(15),
});

const getOneUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const changePasswordSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  password: Joi.string().min(6).required(),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().pattern(/^[a-zA-Z0-9.]{2,}@[a-zA-Z0-9.]{2,}.[a-z]{2,}$/),
});
const resetPasswordSchema = Joi.object({
  code: Joi.number().max(6).required(),
  password: Joi.string().min(6).required(),
  rePassword: Joi.any().equal(Joi.ref("password")).required(),
});
export {
  updateUserSchema,
  getOneUserSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
