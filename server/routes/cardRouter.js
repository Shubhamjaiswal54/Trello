import express from "express";
import {
  createCard,
  getBoardCards,
  updateCard,
  deleteCard,
} from "../controller/cardController.js";
import auth from "../middleware/auth.js";
import requireOrgAccess from "../middleware/requireOrgAccess.js";
import boardModel from "../models/boardModel.js";

const cardRouter = express.Router();

async function orgIdFromBoard(req) {
  const board = await boardModel.findById(req.params.boardId);
  req.board = board;
  return board?.orgId;
}

cardRouter.use("/:boardId", auth, requireOrgAccess(orgIdFromBoard));

cardRouter.get("/:boardId/getallcards", getBoardCards);
cardRouter.post("/:boardId/create", createCard);
cardRouter.patch("/:boardId/:carduuid", updateCard);
cardRouter.delete("/:boardId/:carduuid", deleteCard);

export default cardRouter;
