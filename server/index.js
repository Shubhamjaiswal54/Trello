import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import boardRouter from "./routes/boardRouter.js";
import organizationRouter from "./routes/organizationRouter.js";
import userRouter from "./routes/userRouter.js";
import cardRouter from "./routes/cardRouter.js";
import departmentRouter from "./routes/departmentRouter.js";
import errorHandler from "./middleware/errorHandler.js";

for (const key of ["MONGO_DB_URI", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_URL.split(",").map((url) => url.trim()) }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/boards", boardRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/users", userRouter);
app.use("/api/cards", cardRouter);
app.use("/api/departments", departmentRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

await connectDB();
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
