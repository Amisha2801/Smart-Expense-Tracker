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

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const fullLabel = payload[0].payload.fullLabel;

  return (
    <div className="reports-tooltip">
      <strong>{fullLabel}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {formatCents(entry.value)}
        </span>
      ))}
    </div>
  );
}

function MonthlyTrendChart({ data }) {
  const hasActivity = data.some(
    (row) => row.incomeCents > 0 || row.expenseCents > 0
  );

  if (!hasActivity) {
    return (
      <div className="reports-chart-empty">
        <div className="empty-icon">📆</div>
        <p>No activity in the last 6 months.</p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    label: row.shortLabel,
    fullLabel: row.label,
    Income: row.incomeCents,
    Expenses: row.expenseCents,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<TrendTooltip />} />
        <Legend />
        <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Expenses" fill="#7c3aed" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTrendChart;
