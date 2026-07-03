import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCents } from "../../utils/moneyUtils";

function BudgetTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const fullName = payload[0].payload.fullName;

  return (
    <div className="reports-tooltip">
      <strong>{fullName}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {formatCents(entry.value)}
        </span>
      ))}
    </div>
  );
}

function BudgetVsActualChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="reports-chart-empty">
        <div className="empty-icon">📉</div>
        <p>No budget or spending data for this month.</p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    name: row.name.length > 10 ? `${row.name.slice(0, 10)}…` : row.name,
    fullName: row.name,
    Budget: row.allocatedCents,
    Spent: row.spentCents,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<BudgetTooltip />} />
        <Legend />
        <Bar dataKey="Budget" fill="#10b981" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Spent" fill="#7c3aed" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BudgetVsActualChart;
