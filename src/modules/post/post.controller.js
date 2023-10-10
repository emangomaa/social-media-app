import errorHandler from "../../middleware/errorHandler.js";
import AppError from "../../utils/AppError.js";
import postModel from "../../../database/models/post.model.js";
import { deleteOne, getOne } from "../../utils/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";
// ***************************create post**************************
const createPost = errorHandler(async (req, res, next) => {
  console.log(req.files);
  let imgArr = [];
  if (req.files.postImages) {
    for (const file of req.files.postImages) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/postImages",
        }
      );
      imgArr.push({ secure_url, public_id });
    }
  }
  req.body.postImages = imgArr;

  if (req.files.postVideo) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.postVideo[0].path,
      {
        folder: "social-app/postVideos",
      }
    );
    req.body.postVideo = { secure_url, public_id };
  }
  req.body.user = req.user._id;
  let post = new postModel(req.body);
  await post.save();
  res.json({ message: "success", post });
});
// *************************get all posts**********************
const getAllPosts = errorHandler(async (req, res, next) => {
  let APIFeature = new APIFeatures(
    postModel
      .find({ postStatus: "public" })
      .populate("user", "userName profileImg active -_id")
      .populate("comment", "comment"),
    req.query
  )
    .Pagination()
    .Sort()
    .Filter()
    .Fields()
    .Search();
  let posts = await APIFeature.mongooseQuery;

  res.json({ message: "success", page: APIFeature.page, posts });
});

// *************************update post*************************
const updatePost = errorHandler(async (req, res, next) => {
  console.log(req.files);
  let { id } = req.params;
  let imgArr = [];
  if (req.files.postImages) {
    for (const file of req.files.postImages) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "social-app/postImages",
        }
      );
      imgArr.push({ secure_url, public_id });
    }
  }
  req.body.postImages = imgArr;

  if (req.files.postVideo) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.postVideo[0].path,
      {
        folder: "social-app/postVideos",
      }
    );
    req.body.postVideo = { secure_url, public_id };
  }
  let post = await postModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!post) return next(new AppError("post Not Found!", 404));
  res.json({ message: "success", post });
});

// ******************************delete post****************************
const deletePost = deleteOne(postModel);

// *************************get post by id************************
const getPostById = getOne(postModel);
// *************************get posts for one user ********************
const getUserPosts = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let posts = await postModel.find({ user: id });
  if (posts.length < 0) return next(new AppError("Not Found!", 404));
  res.json({ message: "success", posts });
});
// ***************************change post state *******************
const changePostState = errorHandler(async (req, res, next) => {
  let { postId, postStatus } = req.body;
  let post = await postModel.findByIdAndUpdate(
    postId,
    { postStatus },
    {
      new: true,
    }
  );
  if (!post) return next(new AppError("post Not Found!", 404));
  res.json({ message: "success", post });
});
// ***********************like post **********************************
const likePost = errorHandler(async (req, res, next) => {
  let { postId } = req.body;
  let post = await postModel.findById(postId);
  if (!post) return next(new AppError("post Not Found!", 404));
  if (post.likeUsers.includes(req.user._id))
    return next(new AppError("fail", 409));
  post.likeUsers.push(req.user._id);
  await post.save();
  res.json({ message: "success", post });
});
const unLikePost = errorHandler(async (req, res, next) => {});
export {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unLikePost,
  changePostState,
};
