import express from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  likeComment,
  unLikeComment,
  updateComment,
} from "./comment.controller.js";
import validation from "../../middleware/validation.js";
import { protectRoutes } from "../auth/auth.controller.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./comment.validation.js";
const commentRouter = express.Router({ mergeParams: true });

commentRouter
  .route("/")
  .post(protectRoutes, validation(createCommentSchema), createComment)
  .get(protectRoutes, getAllComments);

commentRouter
  .route("/:id")
  .put(protectRoutes, validation(updateCommentSchema), updateComment)
  .delete(protectRoutes, deleteComment);
commentRouter.patch("/like", protectRoutes, likeComment);
commentRouter.patch("/unlike", protectRoutes, unLikeComment);
export default commentRouter;
