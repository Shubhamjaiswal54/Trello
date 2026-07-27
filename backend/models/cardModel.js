import mongoose from "mongoose";
const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    x: {
      type: Number,
      default: 0,
    },

    y: {
      type: Number,
      default: 0,
    },

    z: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "todo", "completed"],
      default: "pending",
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
  },

  { timestamps: true },
);

const cardModel = mongoose.model("Card", cardSchema);
export default cardModel;
