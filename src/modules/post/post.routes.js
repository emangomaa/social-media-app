import express from "express";
import {
  changePostState,
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  likePost,
  unLikePost,
  updatePost,
} from "./post.controller.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";
import validation from "../../middleware/validation.js";
import uploadFileOnCloud from "../../middleware/uploadFiles.js";
import { protectRoutes } from "../auth/auth.controller.js";
import commentRouter from "../comment/comment.routes.js";
const postRouter = express.Router();
postRouter.use("/:id/comment", commentRouter);
postRouter
  .route("/")
  .post(
    protectRoutes,
    uploadFileOnCloud().fields([
      { name: "postImages", maxCount: 3 },
      { name: "postVideo", maxCount: 1 },
    ]),
    validation(createPostSchema),
    createPost
  )
  .get(getAllPosts);

postRouter
  .route("/:id")
  .get(getPostById)
  .put(
    protectRoutes,
    uploadFileOnCloud().fields([
      { name: "postImages", maxCount: 3 },
      { name: "postVideo", maxCount: 1 },
    ]),
    validation(updatePostSchema),
    updatePost
  )
  .delete(protectRoutes, deletePost);
postRouter.patch("/like", protectRoutes, likePost);
postRouter.patch("/unlike", protectRoutes, unLikePost);
postRouter.patch("/", protectRoutes, changePostState);
// postRouter.get("/posts/:id")
export default postRouter;
