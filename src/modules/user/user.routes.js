import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  changePassword,
  logOut,
  // forgetPassword,
  // resetPassword,
} from "./user.controller.js";
import { protectRoutes, allowTo } from "../auth/auth.controller.js";
import validation from "../../middleware/validation.js";
import {
  changePasswordSchema,
  // forgetPasswordSchema,
  getOneUserSchema,
  // resetPasswordSchema,
  updateUserSchema,
} from "./user.validation.js";
import uploadFileOnCloud from "../../middleware/uploadFiles.js";
const userRouter = Router();
userRouter.route("/").get(allowTo("admin"), getAllUsers);
userRouter
  .route("/:id")
  .get(protectRoutes, validation(getOneUserSchema), getUserById)
  .put(
    protectRoutes,
    uploadFileOnCloud().single("profileImg"),
    validation(updateUserSchema),
    updateUser
  )
  .delete(protectRoutes, validation(getOneUserSchema), deleteUser);
userRouter.patch(
  "/changePassword/:id",
  protectRoutes,
  validation(changePasswordSchema),
  changePassword
);
// userRouter.post(
//   "/forgetPassword",
//   validation(forgetPasswordSchema),
//   forgetPassword
// );
// userRouter.put(
//   "/verify/:token",
//   validation(resetPasswordSchema),
//   resetPassword
// );
userRouter.put("/logout", protectRoutes, logOut);
export default userRouter;
