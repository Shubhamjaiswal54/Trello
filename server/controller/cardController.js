import { randomUUID } from "node:crypto";
import Card from "../models/cardModel.js";
import Department from "../models/departmentModel.js";

// All handlers require loadBoard + requireOrgAccess, which set req.board.

const POSITIONS = ["", "A", "B", "C"];

export const getBoardCards = async (req, res) => {
  const [cards, department] = await Promise.all([
    Card.find({ boardId: req.board._id }).sort({ createdAt: 1 }),
    Department.findById(req.board.departmentId).select("name"),
  ]);
  res.status(200).json({
    organization: { _id: req.org._id, name: req.org.name },
    department,
    board: { _id: req.board._id, name: req.board.name },
    cards,
  });
};

export const createCard = async (req, res) => {
  const text = req.body.text?.trim();
  const pos = req.body.pos ?? "";
  const uuid = req.body.uuid || randomUUID();

  if (!text) {
    return res.status(400).json({ message: "Card text is required" });
  }
  if (!POSITIONS.includes(pos)) {
    return res.status(400).json({ message: "Invalid card position" });
  }

  const card = await Card.create({
    uuid,
    text,
    pos,
    boardId: req.board._id,
    orgId: req.board.orgId,
  });

  res.status(201).json(card);
};

// Only text and pos are editable; everything else is fixed at creation.
export const updateCard = async (req, res) => {
  const update = {};

  if (req.body.text !== undefined) {
    const text = String(req.body.text).trim();
    if (!text) {
      return res.status(400).json({ message: "Card text can't be empty" });
    }
    update.text = text;
  }
  if (req.body.pos !== undefined) {
    if (!POSITIONS.includes(req.body.pos)) {
      return res.status(400).json({ message: "Invalid card position" });
    }
    update.pos = req.body.pos;
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const card = await Card.findOneAndUpdate(
    { uuid: req.params.carduuid, boardId: req.board._id },
    { $set: update },
    { returnDocument: "after", runValidators: true },
  );

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }
  res.status(200).json(card);
};

export const deleteCard = async (req, res) => {
  const card = await Card.findOneAndDelete({
    uuid: req.params.carduuid,
    boardId: req.board._id,
  });

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }
  res.status(200).json({ message: "Card deleted successfully" });
};
