import AppError from "../../utils/AppError.js";
import userModel from "../../../database/models/user.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import sendEmail from "../../email/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const signUp = errorHandler(async (req, res, next) => {
  let userExist = await userModel.findOne({ email: req.body.email });
  if (userExist) return next(new AppError("User Already Exist", 400));

  let user = new userModel(req.body);
  await user.save();

  let verifyEmailToken = jwt.sign(
    { id: user._id },
    process.env.EMAIL_SECRET_KEY
  );
  sendEmail({
    email: user.email,
    name: user.userName,
    api: `http://localhost:3000/api/v1/auth/verify/${verifyEmailToken}`,
  });
  res.status(201).json({ message: "success", user });
});

const signIn = errorHandler(async (req, res, next) => {
  let userExist = await userModel.findOne({ email: req.body.email });
  if (!userExist) return next(new AppError("user not exist", 401));
  if (!userExist.verified) return next(new AppError("user not verified", 401));
  let matched = await bcrypt.compare(req.body.password, userExist.password);

  if (userExist && matched) {
    let token = jwt.sign(
      { email: userExist.email, userId: userExist._id, role: userExist.role },
      "social-app"
    );
    userExist.active = true;
    return res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password", 401));
});

const verifyEmail = errorHandler(async (req, res, next) => {
  let { token } = req.params;
  jwt.verify(token, process.env.EMAIL_SECRET_KEY, async (err, decoded) => {
    if (err) next(new AppError("Invalid Token", 400));
    let user = await userModel.findByIdAndUpdate(
      decoded.id,
      { verified: true },
      { new: true }
    );
    res.send(`<div style="width:400px;margin:100px auto;text-align:center">
      <h3>Email Verivied Successfully</h3>
      <a style="color:#3399A3;border:1px solid #3399A3;border-radius:25px;font-weight:bold;padding:8px;width:200px" href="http://localhost:3001/login">Login</a>
    </div>`);

    // res.json({ message: "success" });
  });
});
const protectRoutes = errorHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("provide token", 401));

  let decoded = jwt.verify(token, "social-app");
  console.log(decoded);
  if (!decoded.userId) return next(new AppError("invalid token", 401));

  let userExist = await userModel.findById(decoded.userId);
  if (!userExist) return next(new AppError(" user not found", 404));
  if (userExist.changePasswordAt) {
    let changePasswordTime = parseInt(
      userExist.changePasswordAt.getTime() / 1000
    );
    if (changePasswordTime > decoded.iat)
      return next(new AppError("invalid token", 401));
  }
  if (userExist.logoutAt) {
    let logoutTime = parseInt(userExist.logoutAt.getTime() / 1000);
    if (logoutTime > decoded.iat)
      return next(new AppError("invalid token", 401));
  }

  req.user = userExist;
  next();
});

const allowTo = (...roles) => {
  return errorHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("not authorized", 403));
    next();
  });
};
export { signUp, signIn, protectRoutes, allowTo, verifyEmail };
