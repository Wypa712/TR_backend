import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionsRoutes from "./routes/transactionRoutes.js";
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionsRoutes);

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
