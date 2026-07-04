import { useEffect, useMemo, useState } from "react";

import { fetchReportSourceData } from "../api/reportsApi";
import BudgetComparisonTable from "../components/reports/BudgetComparisonTable";
import BudgetVsActualChart from "../components/reports/BudgetVsActualChart";
import CategoryPieChart from "../components/reports/CategoryPieChart";
import MonthlyTrendChart from "../components/reports/MonthlyTrendChart";
import SummaryCards from "../components/reports/SummaryCards";
import { getCurrentMonthKey, monthKeyToLabel } from "../utils/moneyUtils";
import { buildMonthlyReport } from "../utils/reportUtils";
import { PieChart, BarChart3, CalendarRange, Receipt, Inbox } from "lucide-react";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusBanner,
  TextField,
  EmptyState,
} from "../design-system/components";

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
    <div className="page">
      <PageHeader
        eyebrow="Ledger"
        title="Reports"
        subtitle={`Viewing ${monthKeyToLabel(monthKey)}`}
        action={
          <TextField
            type="month"
            value={monthKey}
            onChange={(event) => setMonthKey(event.target.value)}
            onClick={(event) => event.currentTarget.showPicker?.()}
          />
        }
      />

      <StatusBanner error={error} />

      {loading ? (
        <Card padding="40px" style={{ textAlign: "center", color: "var(--muted)" }}>
          Loading reports…
        </Card>
      ) : (
        <>
          <SummaryCards summary={report.summary} />

          {!hasMonthActivity ? (
            <Card padding="28px 30px">
              <EmptyState icon={<Inbox />}>
                No activity for {report.monthLabel}.
              </EmptyState>
            </Card>
          ) : (
            <div className="section-stack">
              <div className="chart-grid">
                <Card padding="28px 30px">
                  <SectionHeader
                    icon={<PieChart />}
                    title="Spending by category"
                    subtitle="Where your money went this month."
                  />
                  <CategoryPieChart data={report.spendingByCategory} />
                </Card>

                <Card padding="28px 30px">
                  <SectionHeader
                    icon={<BarChart3 />}
                    title="Budget vs actual"
                    subtitle="Compare planned limits with real spending."
                  />
                  <BudgetVsActualChart data={report.budgetComparison} />
                </Card>
              </div>

              <Card padding="28px 30px">
                <SectionHeader
                  icon={<CalendarRange />}
                  title="Monthly trend"
                  subtitle="Income and expenses over the last 6 months."
                />
                <MonthlyTrendChart data={report.trend} />
              </Card>

              <Card padding="28px 30px">
                <SectionHeader
                  icon={<Receipt />}
                  title="Budget breakdown"
                  subtitle="Remaining balance and progress for each category."
                />
                <BudgetComparisonTable data={report.budgetComparison} />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
