import { EmptyState, ProgressBar } from "../../design-system/components";
import { formatCents } from "../../utils/moneyUtils";
import { Receipt } from "lucide-react";

function BudgetComparisonTable({ data }) {
  if (data.length === 0) {
    return (
      <EmptyState icon={<Receipt />}>
        No budget breakdown for this month.
      </EmptyState>
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget</th>
            <th>Spent</th>
            <th>Remaining</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isOverBudget = row.percentUsed > 100;

            return (
              <tr key={row.categoryId}>
                <td>
                  <span className="ds-table__category">
                    <span
                      className="ds-table__dot"
                      style={{ background: row.color }}
                    />
                    {row.name}
                  </span>
                </td>
                <td>{formatCents(row.allocatedCents)}</td>
                <td>{formatCents(row.spentCents)}</td>
                <td className={row.remainingCents < 0 ? "ds-table__negative" : ""}>
                  {formatCents(row.remainingCents)}
                </td>
                <td>
                  <ProgressBar
                    value={row.spentCents}
                    max={row.allocatedCents || row.spentCents}
                    color={row.color}
                    height={8}
                  />
                  <span
                    className={
                      isOverBudget
                        ? "ds-table__progress-label ds-table__negative"
                        : "ds-table__progress-label"
                    }
                  >
                    {row.percentUsed.toFixed(0)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BudgetComparisonTable;
