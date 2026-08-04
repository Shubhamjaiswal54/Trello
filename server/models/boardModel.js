import mongoose from "mongoose";
const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
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

const boardModel = mongoose.model("Board", boardSchema);
export default boardModel;
