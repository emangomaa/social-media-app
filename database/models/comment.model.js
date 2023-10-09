import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    comment: String,
    likeUsers: [Types.ObjectId],
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

const commentModel = model("comment", commentSchema);
export default commentModel;
