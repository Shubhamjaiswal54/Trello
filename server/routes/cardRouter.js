import {createCard , getBoardCards , getCard , updateCard , changeStatus , updatePosition , deleteCard} from "../controller/cardController.js";
import express from "express";
import auth from "../middleware/auth.js";
import requireOrgAccess from "../middleware/requireOrgAccess.js";
import boardModel from "../models/boardModel.js";

const cardRouter = express.Router();
async function orgIdFromBoard(req) {
  const board = await departmentModel.findById( req.params.boardId);
  return board?.orgId;
}


//api/cards/:boardId/
cardRouter.get("/:boardId/getallcards", auth, requireOrgAccess(orgIdFromBoard) ,getBoardCards);
cardRouter.post("/:boardId/create", auth, requireOrgAccess(orgIdFromBoard) , createCard);
cardRouter.put("/:boardId/:carduuid", auth,  requireOrgAccess(orgIdFromBoard) ,updatePosition);


// cardRouter.get("/:boardId/:cardId", auth, getCard);
// cardRouter.put("/:boardId/:cardId", auth, changeStatus);
// cardRouter.delete("/:boardId/:cardId", auth, deleteCard);

export default cardRouter;
