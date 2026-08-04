import mongoose from "mongoose";
const cardSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },

    pos: {
      type: String,
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
      index: true,
    },
  },

  { timestamps: true },
);

const cardModel = mongoose.model("Card", cardSchema);
export default cardModel;
