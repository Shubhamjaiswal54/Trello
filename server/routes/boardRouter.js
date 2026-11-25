import express from "express";
import {
  addboard,
  getallboards,
  getboard,
  deleteboard,
} from "../controller/boardController.js";
import auth from "../middleware/auth.js";
import requireOrgAccess from "../middleware/requireOrgAccess.js";
import departmentModel from "../models/departmentModel.js";

const boardRouter = express.Router();

async function orgIdFromDept(req) {
  const department = await departmentModel.findById(req.params.departmentId);
  req.department = department;
  return department?.orgId;
}

boardRouter.use("/:departmentId", auth, requireOrgAccess(orgIdFromDept));

boardRouter.post("/:departmentId/create", addboard);
boardRouter.get("/:departmentId", getallboards);
boardRouter.get("/:departmentId/:boardId", getboard);
boardRouter.delete("/:departmentId/:boardId", deleteboard);

export default boardRouter;
