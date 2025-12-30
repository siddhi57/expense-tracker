import React from "react";

export default function ExpenseList({ expenses }) {
  return (
    <div
      style={{ border: "1px dashed gray", padding: "20px", borderRadius: 10 }}
    >
      <h3>Expenses</h3>

      {expenses.length === 0 && <p>No expenses yet.</p>}

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id} style={{ marginBottom: 10 }}>
            <strong>{exp.title}</strong> — ₹{exp.amount}  
            <br />
            Category: {exp.category} | Date: {exp.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
