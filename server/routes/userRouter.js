import express from "express";
import { loginUser, signupUser, getMe } from "../controller/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", signupUser);
userRouter.get("/me", auth, getMe);

export default userRouter;
