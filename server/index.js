import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../server/config/db.js";

import boardRouter from "./routes/boardRouter.js";
import organizationRouter from "./routes/organizationRouter.js";
import userRouter from "./routes/userRouter.js";
import cardRouter from "./routes/cardRouter.js";
import departmentRouter from "./routes/departmentRouter.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const JWTSECRET = process.env.JWT_SECRET;

// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:5173",
//   }),
// );



app.use("/api/boards", boardRouter);
app.use("/api/organizations", organizationRouter);
app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);
app.use('/api/departments', departmentRouter);

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
