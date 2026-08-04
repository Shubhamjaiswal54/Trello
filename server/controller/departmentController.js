import mongoose from "mongoose";
import departmentModel from "../models/departmentModel.js";

const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const { organizationId } = req.params;

    const department = await departmentModel.create({
      name,
      organizationId,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const department = await departmentModel.findByIdAndDelete(departmentId);
    res.status(200).json({
      message: "Department deleted successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const departments = await departmentModel.find({ orgId: organizationId });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {addDepartment , removeDepartment , getDepartment};
