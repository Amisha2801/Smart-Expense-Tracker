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
import { EmptyState } from "../../design-system/components";
import { formatCents } from "../../utils/moneyUtils";
import { BarChart3 } from "lucide-react";

const AXIS_TICK = { fontSize: 12, fill: "#8a857a", fontFamily: "'Hanken Grotesk', sans-serif" };
const LEGEND_STYLE = { fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "#57534a" };

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
      <EmptyState icon={<BarChart3 />}>
        No budget or spending data for this month.
      </EmptyState>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d5" />
        <XAxis dataKey="name" tick={AXIS_TICK} />
        <YAxis
          tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
          tick={AXIS_TICK}
        />
        <Tooltip content={<BudgetTooltip />} />
        <Legend wrapperStyle={LEGEND_STYLE} />
        <Bar dataKey="Budget" fill="#3f6f4f" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Spent" fill="#c26a3d" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BudgetVsActualChart;
