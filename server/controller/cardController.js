import Card from "../models/cardModel.js";
import Board from "../models/boardModel.js";

// POST /api/boards/:boardId/cards
export const createCard = async (req, res) => {
  try {
    const { uuid, text, pos, boardId } = req.body.movedItem;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const card = await Card.create({
      uuid,
      text,
      pos,
      boardId,
      orgId: board.orgId,
    });

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/boards/:boardId/cards
export const getBoardCards = async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await Card.find({ boardId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/cards/:cardId
export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/cards/:cardId
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/cards/:cardId/status
export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/cards/update/:uuid
export const updatePosition = async (req, res) => {
  try {
    const { carduuid, boardId } = req.params;
    const { pos } = req.body;

    const card = await Card.findOneAndUpdate(
      { uuid: carduuid, boardId: boardId },
      { $set: { pos: pos } },
      {
        returnDocument: true,
      },
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/cards/:cardId
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
