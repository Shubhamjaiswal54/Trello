import {
  addDepartment,
  removeDepartment,
  getDepartment,
} from "../controller/departmentController.js";
import express from "express";
const departmentRouter = express.Router();
import auth from "../middleware/auth.js";
import requireOrgAccess from "../middleware/requireOrgAccess.js";

departmentRouter.post(
  "/:organizationId/create",
  auth,
  requireOrgAccess((req) => req.params.organizationId),
  addDepartment,
);
departmentRouter.get(
  "/:organizationId",
  auth,
  requireOrgAccess( (req) => req.params.organizationId),
  getDepartment,
);
departmentRouter.delete(
  "/:organizationId/:departmentId",
  auth,
  requireOrgAccess((req) => req.params.organizationId),
  removeDepartment,
);

export default departmentRouter;
