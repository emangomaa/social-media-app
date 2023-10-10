import Joi from "joi";

const createPostSchema = Joi.object({
  title: Joi.string().min(3),
  content: Joi.string().min(3).required(),
});
const updatePostSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3),
  content: Joi.string().min(3),
});
export { createPostSchema, updatePostSchema };
