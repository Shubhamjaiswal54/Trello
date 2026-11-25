import express from "express";
import {
  addDepartment,
  removeDepartment,
  getDepartment,
} from "../controller/departmentController.js";
import auth from "../middleware/auth.js";
import requireOrgAccess, {
  orgFromParam,
} from "../middleware/requireOrgAccess.js";

const departmentRouter = express.Router();

departmentRouter.use("/:organizationId", auth, requireOrgAccess(orgFromParam));

departmentRouter.post("/:organizationId/create", addDepartment);
departmentRouter.get("/:organizationId", getDepartment);
departmentRouter.delete("/:organizationId/:departmentId", removeDepartment);

export default departmentRouter;
