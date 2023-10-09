import { Schema, model, Types } from "mongoose";

const replaySchema = new Schema(
  {
    replay: String,
    likeUsers: [Types.ObjectId],
    comment: {
      type: Types.ObjectId,
      ref: "comment",
    },
    post: {
      type: Types.ObjectId,
      ref: "post",
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const replayModel = model("comment", commentSchema);
export default commentModel;
