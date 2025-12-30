import { useEffect, useState } from "react";
import api from "../api";

function ExpenseForm({ onExpenseAdded, expense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // PREFILL FOR EDIT
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date);
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      amount: Number(amount),
      category,
      date,
    };

    if (expense) {
      await api.put(`expenses/${expense.id}/`, payload);
    } else {
      await api.post("expenses/", payload);
    }

    onExpenseAdded();

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        className="form-input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="form-input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        className="form-input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Books">Books</option>
        <option value="Other">Other</option>
      </select>

      <input
        className="form-input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button className="submit-btn">
        {expense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;
