import errorHandler from "../../middleware/errorHandler.js";
import AppError from "../../utils/AppError.js";
import postModel from "../../../database/models/post.model.js";
import replayModel from "../../../database/models/replay.model.js";
// ***************************create comment**************************
const createReplay = errorHandler(async (req, res, next) => {
  let { postId, commentId, replay } = req.body;
  req.body.user = req.user._id;
  req.body.post = postId;
  req.body.comment = commentId;
  let added = new replayModel({
    replay,
    user: req.user._id,
    post: postId,
    comment: commentId,
  });
  await added.save();
  res.json({ message: "success", added });
});
// *************************get all comments of post**********************
const getAllReplays = errorHandler(async (req, res, next) => {
  let filterObj = {};
  if (req.params && req.params.id) {
    filterObj = { comment: req.params.id };
  }
  let replays = await replayModel
    .find(filterObj)
    .populate("comment", "userName profileImg -_id");

  res.json({ message: "success", replays });
});

// *************************update comment*************************
const updateReplay = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { postId, commentId, replay } = req.body;
  let post = await postModel.findById(postId);
  if (!post) return next(new AppError("post not found", 404));
  let comment = await commentModel.findById(commentId);
  if (!comment) return next(new AppError("comment not found", 404));

  let updateReplay = await replayModel.findByIdAndUpdate(
    { _id: id, post: postId, comment: commentId },
    { replay },
    {
      new: true,
    }
  );
  if (!updateReplay) return next(new AppError("replay Not Found!", 404));
  res.json({ message: "success", updateReplay });
});

// ******************************delete comment****************************
const deleteReplay = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { postId, commentId } = req.body;
  let post = await postModel.findById(postId);
  if (!post) return next(new AppError("post not found", 404));
  let comment = await commentModel.findById(postId);
  if (!comment) return next(new AppError("comment not found", 404));

  let deleteReplay = await replayModel.findByIdAndDelete({
    _id: id,
    post: postId,
    comment: commentId,
  });
  if (!deleteReplay) return next(new AppError("Replay Not Found!", 404));
  res.json({ message: "success", deleteReplay });
});

// ***********************like comment **********************************
const likeReplay = errorHandler(async (req, res, next) => {
  let { postId, commentId, replayId } = req.body;
  let replay = await replayModel.find({
    _id: ReplayId,
    post: postId,
    comment: commentId,
  });
  if (!replay) return next(new AppError("replay Not Found!", 404));
  if (replay.likeUsers.includes(req.user._id))
    return next(new AppError("fail", 409));
  Replay.likeUsers.push(req.user._id);
  await replay.save();
  res.json({ message: "success", replay });
});

// ***********************unLike comment
const unLikeReplay = errorHandler(async (req, res, next) => {});
export {
  createReplay,
  getAllReplays,
  updateReplay,
  deleteReplay,
  likeReplay,
  unLikeReplay,
};
