import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCents } from "../../utils/moneyUtils";

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="reports-tooltip">
      <strong>
        {item.icon} {item.name}
      </strong>
      <span>
        {formatCents(item.spentCents)} ({item.percent.toFixed(1)}%)
      </span>
    </div>
  );
}

function CategoryPieChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="reports-chart-empty">
        <div className="empty-icon">🥧</div>
        <p>No spending by category for this month.</p>
      </div>
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
