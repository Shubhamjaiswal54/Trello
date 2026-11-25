import express from "express";
import {
  addmember,
  removeMember,
  getallme,
  addorganization,
  removeOrganization,
  getall,
  getorganization,
} from "../controller/organizationController.js";
import auth from "../middleware/auth.js";
import requireOrgAccess, {
  orgFromParam,
} from "../middleware/requireOrgAccess.js";

const organizationRouter = express.Router();
const orgMember = requireOrgAccess(orgFromParam);

organizationRouter.post("/create", auth, addorganization);
organizationRouter.get("/allorganizations", auth, getall);
organizationRouter.get("/allorganizations/me", auth, getallme);

organizationRouter.get("/:organizationId", auth, orgMember, getorganization);
organizationRouter.delete("/:organizationId", auth, orgMember, removeOrganization);
organizationRouter.post("/:organizationId/members", auth, orgMember, addmember);
organizationRouter.delete(
  "/:organizationId/:memberId",
  auth,
  orgMember,
  removeMember,
);

export default organizationRouter;
