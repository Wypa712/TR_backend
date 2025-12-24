import React, { useState, useEffect } from "react";
import transactionService from "../api/services/transactionService";

export default function AddTransactionModal({ onTransactionAdded }) {
  const [amount, setAmount] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount: Number(amount),
      type: isExpense ? "expense" : "income",
      category,
      date,
      description,
    };

    try {
      await transactionService.createTransactions(payload);

      document.getElementById("add_modal").close();

      if (onTransactionAdded) onTransactionAdded();

      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при создании:", error);
    }
  };

  return (
    <dialog id="add_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Добавить транзакцию</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <span
                className={`label-text font-bold ${
                  !isExpense ? "text-success" : ""
                }`}
              >
                Доход
              </span>
              <input
                type="checkbox"
                className="toggle toggle-error"
                checked={isExpense}
                onChange={() => setIsExpense(!isExpense)}
              />
              <span
                className={`label-text font-bold ${
                  isExpense ? "text-error" : ""
                }`}
              >
                Расход
              </span>
            </label>
          </div>

          <input
            type="number"
            placeholder="Сумма"
            className="input input-bordered w-full"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="form-control w-full">
            <input
              list="category-list"
              className="input input-bordered w-full"
              placeholder="Выберите или введите категорию"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="category-list">
              <option value="Еда" />
              <option value="Транспорт" />
              <option value="Зарплата" />
              <option value="Развлечения" />
            </datalist>
          </div>

          <input
            type="date"
            className="input input-bordered w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            placeholder="Описание (необязательно)"
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-action">
            <button
              type="button"
              onClick={() => document.getElementById("add_modal").close()}
              className="btn"
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
