import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "first name too shorter"],
      maxLength: [15, "first name too longer"],
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "last name too shorter"],
      maxLength: [15, "last name too longer"],
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "userName too shorter"],
      maxLength: [15, "userName too longer"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: [true, "email required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password required,"],
      trim: true,
      minLength: [6, "min length 6 characters"],
    },
    age: Number,
    profileImg: {
      type: Object,
      default: {},
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: false,
    },
    logoutAt: Date,
    changePasswordAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 7);
});

userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 7);
  }
});
const userModel = model("user", userSchema);

export default userModel;
