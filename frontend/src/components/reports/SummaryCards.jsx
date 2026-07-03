import { formatCents } from "../../utils/moneyUtils";

function SummaryCards({ summary }) {
  return (
    <section className="summary-grid reports-summary-grid">
      <div className="summary-card green-card">
        <div className="card-icon">💰</div>
        <div className="summary-card-content">
          <h3>Total Income</h3>
          <p>{formatCents(summary.totalIncomeCents)}</p>
        </div>
      </div>

      <div className="summary-card purple-card">
        <div className="card-icon">💳</div>
        <div className="summary-card-content">
          <h3>Total Expenses</h3>
          <p>{formatCents(summary.totalExpensesCents)}</p>
        </div>
      </div>

      <div className="summary-card orange-card">
        <div className="card-icon">📊</div>
        <div className="summary-card-content">
          <h3>Net</h3>
          <p
            className={
              summary.netCents < 0 ? "summary-net-negative" : undefined
            }
          >
            {formatCents(summary.netCents)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;
