import errorHandler from "../../middleware/errorHandler.js";
import AppError from "../../utils/AppError.js";
import commentModel from "../../../database/models/comment.model.js";
import postModel from "../../../database/models/post.model.js";
// ***************************create comment**************************
const createComment = errorHandler(async (req, res, next) => {
  let { postId, comment } = req.body;
  req.body.user = req.user._id;
  req.body.post = postId;
  let added = new commentModel({
    comment,
    user: req.user._id,
    post: postId,
  });
  await added.save();
  res.json({ message: "success", added });
});
// *************************get all comments of post**********************
const getAllComments = errorHandler(async (req, res, next) => {
  let filterObj = {};
  if (req.params && req.params.id) {
    filterObj = { post: req.params.id };
  }
  let comments = await commentModel
    .find(filterObj)
    .populate("post", "title -_id");

  res.json({ message: "success", comments });
});

// *************************update comment*************************
const updateComment = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { postId, comment } = req.body;
  let post = await postModel.findById(postId);
  if (!post) return next(new AppError("post not found", 404));

  let updateComment = await commentModel.findByIdAndUpdate(
    { _id: id, post: postId },
    { comment },
    {
      new: true,
    }
  );
  if (!updateComment) return next(new AppError("comment Not Found!", 404));
  res.json({ message: "success", updateComment });
});

// ******************************delete comment****************************
const deleteComment = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { postId } = req.body;
  let post = await postModel.findById(postId);
  if (!post) return next(new AppError("post not found", 404));

  let deleteComment = await commentModel.findByIdAndDelete({
    _id: id,
    post: postId,
  });
  if (!deleteComment) return next(new AppError("comment Not Found!", 404));
  res.json({ message: "success", deleteComment });
});

// ***********************like comment **********************************
const likeComment = errorHandler(async (req, res, next) => {
  let { postId, commentId } = req.body;
  let comment = await commentModel.find({ _id: commentId, post: postId });
  if (!comment) return next(new AppError("comment Not Found!", 404));
  if (comment.likeUsers.includes(req.user._id))
    return next(new AppError("fail", 409));
  comment.likeUsers.push(req.user._id);
  await comment.save();
  res.json({ message: "success", comment });
});

// ***********************unLike comment
const unLikeComment = errorHandler(async (req, res, next) => {});
export {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  likeComment,
  unLikeComment,
};
