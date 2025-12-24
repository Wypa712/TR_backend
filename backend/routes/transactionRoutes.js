import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import transactionController from "../controllers/transactionController.js";

const router = Router();

router.get("/", authMiddleware, transactionController.getAllTransactons);

router.post("/", authMiddleware, transactionController.createTransaction);

router.delete('/:id', authMiddleware, transactionController.deleteTransaction)

router.get("/stats", authMiddleware, transactionController.getStats);


export default router;
