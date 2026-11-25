import departmentModel from "../models/departmentModel.js";
import boardModel from "../models/boardModel.js";
import cardModel from "../models/cardModel.js";

const addDepartment = async (req, res) => {
  const name = req.body.name?.trim();
  const orgId = req.org._id;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  if (await departmentModel.exists({ name, orgId })) {
    return res.status(409).json({ message: "Department already exists" });
  }

  const department = await departmentModel.create({ name, orgId });

  res.status(201).json({
    message: "Department created successfully",
    department,
  });
};

const removeDepartment = async (req, res) => {
  const { departmentId } = req.params;

  const department = await departmentModel.findOneAndDelete({
    _id: departmentId,
    orgId: req.org._id,
  });
  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  const boardIds = await boardModel.find({ departmentId }).distinct("_id");
  await Promise.all([
    cardModel.deleteMany({ boardId: { $in: boardIds } }),
    boardModel.deleteMany({ departmentId }),
  ]);

  res.status(200).json({ message: "Department deleted successfully" });
};

const getDepartment = async (req, res) => {
  const departments = await departmentModel
    .find({ orgId: req.org._id })
    .sort({ name: 1 });
  res.status(200).json({
    organization: { _id: req.org._id, name: req.org.name },
    departments,
  });
};

export { addDepartment, removeDepartment, getDepartment };
