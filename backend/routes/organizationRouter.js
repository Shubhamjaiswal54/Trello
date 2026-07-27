import {addmember, removeMember , addorganization, removeOrganization, getorganization} from "../controller/organizationController.js";
import express from "express";
const organizationRouter = express.Router();
import auth from "../middleware/auth.js";


organizationRouter.post("/create",auth, addorganization);
organizationRouter.get("/allorganizations",auth, getorganization);
organizationRouter.delete("/:orgId",auth, removeOrganization);

organizationRouter.post("/:orgId/members", auth, addmember);
organizationRouter.delete("/:orgId/:memberId", auth, removeMember);

export default organizationRouter;
