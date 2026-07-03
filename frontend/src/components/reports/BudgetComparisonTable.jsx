import { formatCents } from "../../utils/moneyUtils";

function BudgetComparisonTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="reports-chart-empty">
        <div className="empty-icon">🧾</div>
        <p>No budget breakdown for this month.</p>
      </div>
    );
  }

  return (
    <div className="budget-comparison-table-wrap">
      <table className="budget-comparison-table">
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
            const barWidth = Math.min(row.percentUsed, 100);
            const isOverBudget = row.percentUsed > 100;

            return (
              <tr key={row.categoryId}>
                <td>
                  <span className="budget-table-category">
                    <span>{row.icon}</span>
                    {row.name}
                  </span>
                </td>
                <td>{formatCents(row.allocatedCents)}</td>
                <td>{formatCents(row.spentCents)}</td>
                <td className={row.remainingCents < 0 ? "over-budget-text" : ""}>
                  {formatCents(row.remainingCents)}
                </td>
                <td>
                  <div className="budget-progress-track">
                    <div
                      className={
                        isOverBudget
                          ? "budget-progress-fill over-budget"
                          : "budget-progress-fill"
                      }
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span
                    className={
                      isOverBudget
                        ? "budget-progress-label over-budget-text"
                        : "budget-progress-label"
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
