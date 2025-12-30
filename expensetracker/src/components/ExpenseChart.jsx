import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f97316", // orange
  "#ef4444", // red
  "#0ea5e9", // blue
  "#a855f7", // purple
];

function ExpenseChart({ expenses }) {
  // Safety check
  if (!expenses || expenses.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#6b7280" }}>
        No data available
      </p>
    );
  }

  // Convert expenses → category-wise totals
  const dataMap = {};

  expenses.forEach((item) => {
    const category = item.category;
    const amount = Number(item.amount);

    if (!dataMap[category]) {
      dataMap[category] = 0;
    }
    dataMap[category] += amount;
  });

  const chartData = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
  }));

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: "12px" }}>
        Category-wise Expenses
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default ExpenseChart;
