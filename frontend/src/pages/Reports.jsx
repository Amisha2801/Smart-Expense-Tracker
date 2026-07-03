import { useEffect, useMemo, useState } from "react";

import { fetchReportSourceData } from "../api/reportsApi";
import StatusMessage from "../components/StatusMessage";
import BudgetComparisonTable from "../components/reports/BudgetComparisonTable";
import BudgetVsActualChart from "../components/reports/BudgetVsActualChart";
import CategoryPieChart from "../components/reports/CategoryPieChart";
import MonthlyTrendChart from "../components/reports/MonthlyTrendChart";
import SummaryCards from "../components/reports/SummaryCards";
import { getCurrentMonthKey, monthKeyToLabel } from "../utils/moneyUtils";
import { buildMonthlyReport } from "../utils/reportUtils";

function Reports() {
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadReportData() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchReportSourceData(monthKey);

        if (!isActive) {
          return;
        }

        if (data.error) {
          setError(data.error);
          setTransactions([]);
          setCategories([]);
          setBudgets([]);
          return;
        }

        setTransactions(data.transactions);
        setCategories(data.categories);
        setBudgets(data.budgets);
      } catch (err) {
        console.error("Failed to load report data:", err);

        if (isActive) {
          setError("Unable to load report data.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadReportData();

    return () => {
      isActive = false;
    };
  }, [monthKey]);

  const report = useMemo(
    () =>
      buildMonthlyReport({
        transactions,
        categories,
        budgets,
        monthKey,
      }),
    [transactions, categories, budgets, monthKey]
  );

  const hasMonthActivity =
    report.summary.totalIncomeCents > 0 ||
    report.summary.totalExpensesCents > 0 ||
    report.budgetComparison.length > 0;

  return (
    <div className="dashboard-page">
      <div className="hero-title">
        <span className="sparkle">📊</span>
        <h1>Spending Reports</h1>
      </div>

      <section className="reports-controls transactions-card">
        <div className="reports-controls-centered">
          <div className="reports-controls-heading">
            <h2>Viewing {monthKeyToLabel(monthKey)}</h2>
            <p className="section-subtitle">
              Pick a month to see income, expenses, and budget progress.
            </p>
          </div>

          <label className="reports-month-picker">
            <span>Month:</span>
            <span className="reports-month-field">
              <input
                type="month"
                value={monthKey}
                onChange={(event) => setMonthKey(event.target.value)}
                onClick={(event) => event.currentTarget.showPicker?.()}
              />
              <span className="reports-month-caret" aria-hidden="true">
                ▾
              </span>
            </span>
          </label>
        </div>

        <StatusMessage error={error} />
      </section>

      {loading ? (
        <section className="transactions-card reports-loading-card">
          <p>Loading reports…</p>
        </section>
      ) : (
        <>
          <SummaryCards summary={report.summary} />

          {!hasMonthActivity ? (
            <section className="transactions-card">
              <div className="empty-state">
                <div className="empty-icon">🗂️</div>
                <p>No activity for {report.monthLabel}.</p>
              </div>
            </section>
          ) : (
            <>
              <section className="reports-chart-grid">
                <div className="reports-chart-card">
                  <div className="section-header">
                    <div className="card-icon small-icon">🥧</div>
                    <div className="section-header-text">
                      <h2>Spending by Category</h2>
                      <p className="section-subtitle">
                        Where your money went this month.
                      </p>
                    </div>
                  </div>
                  <CategoryPieChart data={report.spendingByCategory} />
                </div>

                <div className="reports-chart-card">
                  <div className="section-header">
                    <div className="card-icon small-icon">📊</div>
                    <div className="section-header-text">
                      <h2>Budget vs Actual</h2>
                      <p className="section-subtitle">
                        Compare planned limits with real spending.
                      </p>
                    </div>
                  </div>
                  <BudgetVsActualChart data={report.budgetComparison} />
                </div>
              </section>

              <section className="reports-chart-card reports-full-width">
                <div className="section-header">
                  <div className="card-icon small-icon">📆</div>
                  <div className="section-header-text">
                    <h2>Monthly Trend</h2>
                    <p className="section-subtitle">
                      Income and expenses over the last 6 months.
                    </p>
                  </div>
                </div>
                <MonthlyTrendChart data={report.trend} />
              </section>

              <section className="reports-chart-card reports-full-width">
                <div className="section-header">
                  <div className="card-icon small-icon">🧾</div>
                  <div className="section-header-text">
                    <h2>Budget Breakdown</h2>
                    <p className="section-subtitle">
                      Remaining balance and progress for each category.
                    </p>
                  </div>
                </div>
                <BudgetComparisonTable data={report.budgetComparison} />
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
