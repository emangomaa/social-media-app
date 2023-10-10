import userModel from "../../../database/models/user.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import AppError from "../../utils/AppError.js";
import { getOne, deleteOne } from "../../utils/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
// import cloudinary from "../../utils/cloudinary.js";
// import codeSendEmail from "../../email/codeSendEmail.js";
// *************************get all users**********************
const getAllUsers = errorHandler(async (req, res, next) => {
  let APIFeature = new APIFeatures(userModel.find(), req.query)
    .Pagination()
    .Sort()
    .Filter()
    .Fields()
    .Search();

  let users = await APIFeature.mongooseQuery;

  res.json({ message: "success", page: APIFeature.page, users });
});
// *************************get user by id************************
const getUserById = getOne(userModel);
// *************************update user*************************
const updateUser = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let userExist = await userModel.findById(id);
  console.log(req.file);
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "social-app/user",
      }
    );
    req.body.profileImg = { URL: secure_url, public_id };
    // await cloudinary.uploader.explode(userExist.profileImg.public_id);
  }
  let user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  user && res.json({ message: "success", user });
  !user && next(new AppError("user Not Found!", 404));
});

// ******************************delete user****************************
const deleteUser = deleteOne(userModel);

// ******************************change password****************************
const changePassword = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  req.body.changePasswordAt = Date.now();
  let user = await userModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  user && res.json({ message: "success", user });
  !user && next(new AppError("user Not Found!", 404));
});
// const forgetPassword = errorHandler(async (req, res, next) => {
//   let { email } = req.body;
//   let user = await userModel.findOne({ email });
//   if (!user) return next(new AppError("user Not Found!", 404));
//   // generate random code og 6 digits
//   let code = Math.floor(Math.random() * 899999 + 100000);
//   let verifyCodeToken = jwt.sign(
//     { id: user._id, code: code },
//     process.env.EMAIL_SECRET_KEY
//   );
//   codeSendEmail({
//     email: user.email,
//     code,
//     api: `http://localhost:3000/api/v1/user/verify/${verifyCodeToken}`,
//   });
//   res.json({ message: "success" });
// });
// const resetPassword = errorHandler(async (req, res, next) => {
//   let { code, password } = req.body;
//   let { token } = req.params;
//   jwt.verify(token, process.env.EMAIL_SECRET_KEY, async (err, decoded) => {
//     if (err) return next(new AppError("Invalid Token", 400));
//     if (decoded.code === code) {
//       let user = await userModel.findByIdAndUpdate(
//         decoded.id,
//         { password },
//         { new: true }
//       );

//       res.send(`<div style="width:400px;margin:100px auto;text-align:center">
//       <h3>password reset Successfully</h3>
//       <a style="color:#3399A3;border:1px solid #3399A3;border-radius:25px;font-weight:bold;padding:8px;width:200px" href="http://localhost:3001/login">Login</a>
//     </div>`);
//     }

//     // res.json({ message: "success" });
//   });
// });
const logOut = errorHandler(async (req, res, next) => {
  req.body.logoutAt = Date.now();
  req.body.active = false;
  let user = await userModel.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
  });
  user && res.json({ message: "success", user });
  !user && next(new AppError("user Not Found!", 404));
});
563020;
export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  // forgetPassword,
  // resetPassword,
  logOut,
};
