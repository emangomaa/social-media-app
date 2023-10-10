import express from "express";
import { signIn, signUp, verifyEmail } from "./auth.controller.js";
import validation from "../../middleware/validation.js";
import { signUpSchema, signInSchema } from "./auth.validation.js";
const authRouter = express.Router();

authRouter.post("/signUp", validation(signUpSchema), signUp);
// verify email
authRouter.get("/verify/:token", verifyEmail);

authRouter.post("/signIn", validation(signInSchema), signIn);

export default authRouter;
