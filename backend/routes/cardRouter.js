import {createCard , getBoardCards , getCard , updateCard , changeStatus , updatePosition , deleteCard} from "../controller/cardController.js";
import express from "express";
import auth from "../middleware/auth.js";

const cardRouter = express.Router();

cardRouter.get("/:cardId", auth, getCard);
cardRouter.get("/:boardId/getallcards", auth, getBoardCards);

cardRouter.post("/:boardId/create", auth, createCard);

cardRouter.patch("/:cardId", auth, updateCard);
cardRouter.put("/:cardId", auth, changeStatus);

cardRouter.delete("/:cardId", auth, deleteCard);

export default cardRouter;
