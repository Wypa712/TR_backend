import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createToken from "../utils/tokenCreate.js";
import { json } from "express";

const getAllTransactons = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, type, startDate, endDate } = req.query;

    let queryText = "SELECT * FROM transactions WHERE user_id = $1";
    let queryParams = [userId];

    if (type) {
      queryParams.push(type);
      queryText += ` AND type = $${queryParams.length}`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND description ILIKE $${queryParams.length}`;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ error: "Start date cannot be after end date" });
    }

    if (startDate && endDate) {
      queryParams.push(startDate, endDate);
      queryText += ` AND transaction_date BETWEEN $${
        queryParams.length - 1
      } AND $${queryParams.length}`;
    }

    queryText += " ORDER BY transaction_date DESC, created_at DESC";

    const allTransactions = await pool.query(queryText, queryParams);

    res.status(200).json({ message: allTransactions.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;
    const userId = req.user.id;

    if (!amount || !type || !category) {
      return res.status(400).json({ error: "Fields must not be empty" });
    }

    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be income or expense" });
    }

    const create = await pool.query(
      "INSERT INTO transactions (amount, type, category, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [amount, type, category, description, userId]
    );

    res.status(200).json({ message: create.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (deleted.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or access denied" });
    }

    res
      .status(200)
      .json({ message: `transaction with id ${id} deleted succesfull` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const balans = await pool.query(
      "SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) as total_income, COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense FROM transactions WHERE user_id = $1",
      [userId]
    );

    const category = await pool.query(
      "SELECT category, COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY category ORDER BY total DESC;",
      [userId]
    );
    const { total_income, total_expense } = balans.rows[0];
    const total_balanse = total_income - total_expense;

    res.status(200).json({
      balans: total_balanse,
      income: total_income,
      expense: total_expense,
      category: category.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const transactionsRes = await pool.query(
      "SELECT COUNT(*) FROM transactions"
    );
    const usersRes = await pool.query("SELECT COUNT(*) FROM users");

    res.status(200).json({
      success: true,
      data: {
        ransactions: parseInt(transactionsRes.rows[0].count) + 150,
        users: parseInt(usersRes.rows[0].count) + 12,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getAllTransactons,
  createTransaction,
  getStats,
  deleteTransaction,
  getGlobalStats,
};
