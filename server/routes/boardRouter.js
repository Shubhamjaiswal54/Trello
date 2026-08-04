import {
  addboard,
  getallboards,
  getboard,
  deleteboard,
} from "../controller/boardController.js";
import express from "express";
const boardRouter = express.Router();
import auth from "../middleware/auth.js";
import requireOrgAccess from "../middleware/requireOrgAccess.js";
import departmentModel from "../models/departmentModel.js";

async function orgIdFromDept(req) {
  const dept = await departmentModel.findById(req.params.departmentId);
  return dept?.orgId;
}

boardRouter.post(
  "/:departmentId/create",
  auth,
  requireOrgAccess(orgIdFromDept),
  addboard,
);
boardRouter.get(
  "/:departmentId",
  auth,
  requireOrgAccess(orgIdFromDept),
  getallboards,
);
boardRouter.get(
  "/:departmentId/:boardId",
  auth,
  requireOrgAccess(orgIdFromDept),
  getboard,
);
boardRouter.delete(
  "/:departmentId/:boardId",
  auth,
  requireOrgAccess(orgIdFromDept),
  deleteboard,
);

export default boardRouter;
