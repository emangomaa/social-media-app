import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: String,
    content: {
      type: String,
      required: [true, "post content required"],
    },
    postImages: [Object],
    postVideo: Object,
    postStatus: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
    comment: {
      type: [Types.ObjectId],
      ref: "comment",
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    likeUsers: {
      type: [Types.ObjectId],
    },
  },
  { timestamps: true }
);

const postModel = model("post", postSchema);
export default postModel;
