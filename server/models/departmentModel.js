import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

departmentSchema.index({ orgId: 1, name: 1 }, { unique: true });

const departmentModel = mongoose.model("Department", departmentSchema);
export default departmentModel;
