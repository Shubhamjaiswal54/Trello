import boardModel from "../models/boardModel.js";
import departmentModel from "../models/departmentModel.js";

const addboard = async (req, res) => {
  try {
    const { name } = req.body;
    const { departmentId } = req.params;

    const department = await departmentModel.findById(departmentId);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    const board = await boardModel.create({
      name,
      departmentId:department._id,
      orgId: department.orgId,
    });

    res.status(201).json({
      success: true,
      board,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteboard = async (req, res) => {
  const { departmentId, boardId } = req.params;

  try {
    const board = await boardModel.findByIdAndDelete(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json({
      message: "board deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getallboards = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const board = await boardModel.find({ departmentId });
    console.log(departmentId);
    console.log(departmentId);
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getboard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await boardModel.findById(boardId);
    console.log(boardId);
    console.log(board);
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addboard, getallboards, getboard, deleteboard };
