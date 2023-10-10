import Joi from "joi";

const createCommentSchema = Joi.object({
  comment: Joi.string().min(1).required(),
  postId: Joi.string().hex().length(24).required(),
});
const updateCommentSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
  id: Joi.string().hex().length(24).required(),
  comment: Joi.string().min(3),
});
export { createCommentSchema, updateCommentSchema };
