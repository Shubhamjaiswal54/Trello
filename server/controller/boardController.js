import boardModel from "../models/boardModel.js";
import cardModel from "../models/cardModel.js";

// All handlers require loadDepartment + requireOrgAccess, which set req.department.

const addboard = async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ message: "Board name is required" });
  }

  const board = await boardModel.create({
    name,
    departmentId: req.department._id,
    orgId: req.department.orgId,
  });

  res.status(201).json({ board });
};

const deleteboard = async (req, res) => {
  const board = await boardModel.findOneAndDelete({
    _id: req.params.boardId,
    departmentId: req.department._id,
  });

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  await cardModel.deleteMany({ boardId: board._id });

  res.status(200).json({ message: "Board deleted successfully" });
};

const getallboards = async (req, res) => {
  const boards = await boardModel
    .find({ departmentId: req.department._id })
    .sort({ createdAt: -1 });
  res.status(200).json({
    organization: { _id: req.org._id, name: req.org.name },
    department: { _id: req.department._id, name: req.department.name },
    boards,
  });
};

const getboard = async (req, res) => {
  const board = await boardModel.findOne({
    _id: req.params.boardId,
    departmentId: req.department._id,
  });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  res.status(200).json({ board });
};

export { addboard, getallboards, getboard, deleteboard };
