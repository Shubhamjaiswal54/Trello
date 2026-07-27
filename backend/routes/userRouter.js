import {loginUser, signupUser } from "../controller/userController.js";
import express from "express";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", signupUser);
export default userRouter;
