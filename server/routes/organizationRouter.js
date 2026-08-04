import {addmember, removeMember , addorganization, removeOrganization, getall,getorganization} from "../controller/organizationController.js";
import express from "express";
const organizationRouter = express.Router();
import auth from "../middleware/auth.js";

organizationRouter.post("/create",auth, addorganization);
organizationRouter.get("/allorganizations",auth, getall);
organizationRouter.delete("/:organizationId",auth, removeOrganization);

organizationRouter.get("/:organizationId",auth, getorganization);
organizationRouter.post("/:organizationId/members", auth, addmember);
organizationRouter.delete("/:organizationId/:memberId", auth, removeMember);

export default organizationRouter;
