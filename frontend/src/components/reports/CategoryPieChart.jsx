import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { EmptyState } from "../../design-system/components";
import { formatCents } from "../../utils/moneyUtils";
import { PieChart as PieChartIcon } from "lucide-react";

const LEGEND_STYLE = { fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "#57534a" };

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="reports-tooltip">
      <strong>{item.name}</strong>
      <span>
        {formatCents(item.spentCents)} ({item.percent.toFixed(1)}%)
      </span>
    </div>
  );
}

function CategoryPieChart({ data }) {
  if (data.length === 0) {
    return (
      <EmptyState icon={<PieChartIcon />}>
        No spending by category for this month.
      </EmptyState>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="spentCents"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={48}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CategoryTooltip />} />
        <Legend wrapperStyle={LEGEND_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
