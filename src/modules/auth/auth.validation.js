import Joi from "joi";

// validation schema

const signUpSchema = Joi.object({
  firstName: Joi.string().min(2).max(15).required(),
  lastName: Joi.string().min(2).max(15).required(),
  userName: Joi.string().min(2).max(15).required(),
  email: Joi.string().required(),
  // email: Joi.string().pattern(/^[a-zA-Z0-9.]{2,}@[a-zA-Z0-9]{2,}.com/),
  password: Joi.string().min(6).required(),
  age: Joi.number(),
});

const signInSchema = Joi.object({
  email: Joi.string().pattern(/^[a-zA-Z0-9.]{2,}@[a-zA-Z0-9.]{2,}.[a-z]{2,}$/),
  password: Joi.string().min(6).required(),
});

export { signUpSchema, signInSchema };
