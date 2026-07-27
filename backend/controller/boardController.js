import boardModel from "../models/boardModel.js";

const addboard = async (req, res) => {
  try {
    const { name } = req.body;
    const { departmentId } = req.params;

    const board = await boardModel.create({
      name,
      departmentId,
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

export { addboard };