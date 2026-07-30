import  {addDepartment , removeDepartment , getDepartment} from "../controller/departmentController.js";
import express from "express";
const departmentRouter = express.Router();
import auth from "../middleware/auth.js";

departmentRouter.post("/:organizationId/create", auth, addDepartment);
departmentRouter.get("/:organizationId", auth, getDepartment);
departmentRouter.delete("/:organizationId/:departmentId", auth, removeDepartment);

export default departmentRouter;
