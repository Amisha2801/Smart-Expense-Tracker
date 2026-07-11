import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { StatCard } from "../../design-system/components";
import { formatCents } from "../../utils/moneyUtils";

function SummaryCards({ summary }) {
  return (
    <section className="stat-grid">
      <StatCard
        icon={<ArrowDownLeft />}
        label="Total income"
        value={formatCents(summary.totalIncomeCents)}
        tone="positive"
      />

      <StatCard
        icon={<ArrowUpRight />}
        label="Total expenses"
        value={formatCents(summary.totalExpensesCents)}
        tone="negative"
      />

      <StatCard
        icon={<Scale />}
        label="Net"
        value={formatCents(summary.netCents)}
        tone={summary.netCents < 0 ? "negative" : "positive"}
      />
    </section>
  );
}

export default SummaryCards;
