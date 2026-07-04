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
import { CalendarRange } from "lucide-react";

const AXIS_TICK = { fontSize: 12, fill: "#8a857a", fontFamily: "'Hanken Grotesk', sans-serif" };
const LEGEND_STYLE = { fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "#57534a" };

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
      <EmptyState icon={<CalendarRange />}>
        No activity in the last 6 months.
      </EmptyState>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d5" />
        <XAxis dataKey="label" tick={AXIS_TICK} />
        <YAxis
          tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
          tick={AXIS_TICK}
        />
        <Tooltip content={<TrendTooltip />} />
        <Legend wrapperStyle={LEGEND_STYLE} />
        <Bar dataKey="Income" fill="#3f6f4f" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Expenses" fill="#c26a3d" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTrendChart;
