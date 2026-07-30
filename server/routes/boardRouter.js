import { addboard} from "../controller/boardController.js";
import express from "express";
const boardRouter = express.Router();
import auth from "../middleware/auth.js";

boardRouter.post("/:departmentId/create", auth, addboard);

export default boardRouter;
