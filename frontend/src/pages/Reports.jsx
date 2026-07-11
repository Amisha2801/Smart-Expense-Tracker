import { useEffect, useMemo, useState } from "react";

import { fetchReportSourceData } from "../api/reportsApi";
import BudgetComparisonTable from "../components/reports/BudgetComparisonTable";
import BudgetVsActualChart from "../components/reports/BudgetVsActualChart";
import CategoryPieChart from "../components/reports/CategoryPieChart";
import MonthlyTrendChart from "../components/reports/MonthlyTrendChart";
import SummaryCards from "../components/reports/SummaryCards";
import { getCurrentMonthKey, monthKeyToLabel } from "../utils/moneyUtils";
import { buildMonthlyReport } from "../utils/reportUtils";
import {
  PieChart, BarChart3, CalendarRange, Receipt, Inbox,
  ShoppingCart, Utensils, Car, House, Zap, Repeat,
  ShoppingBag, Clapperboard, Briefcase, Laptop, Gift, Tags, Store,
} from "lucide-react";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusBanner,
  MonthYearPicker,
  EmptyState,
} from "../design-system/components";
import { formatCents } from "../utils/moneyUtils";

function guessIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("grocer") || n.includes("whole foods") || n.includes("trader") || n.includes("market")) return ShoppingCart;
  if (n.includes("din") || n.includes("restaurant") || n.includes("cafe") || n.includes("chipotle") || n.includes("mcdonald") || n.includes("pizza")) return Utensils;
  if (n.includes("gas") || n.includes("shell") || n.includes("fuel") || n.includes("uber") || n.includes("lyft") || n.includes("transit")) return Car;
  if (n.includes("rent") || n.includes("landlord") || n.includes("mortgage") || n.includes("home")) return House;
  if (n.includes("electric") || n.includes("water") || n.includes("hydro") || n.includes("util")) return Zap;
  if (n.includes("netflix") || n.includes("spotify") || n.includes("disney") || n.includes("hulu") || n.includes("subscri")) return Repeat;
  if (n.includes("amazon") || n.includes("ebay") || n.includes("shop") || n.includes("target") || n.includes("walmart")) return ShoppingBag;
  if (n.includes("movie") || n.includes("theater") || n.includes("fun") || n.includes("game") || n.includes("entertain")) return Clapperboard;
  if (n.includes("salary") || n.includes("paycheck") || n.includes("employer") || n.includes("inc.") || n.includes("corp")) return Briefcase;
  if (n.includes("freelance") || n.includes("consulting") || n.includes("contract")) return Laptop;
  if (n.includes("gift") || n.includes("bonus") || n.includes("refund")) return Gift;
  return Store;
}

function TopMerchants({ transactions, categories }) {
  const merchantTotals = useMemo(() => {
    const map = {};
    transactions
      .filter(tx => tx.type === "expense" && tx.payee)
      .forEach(tx => {
        const key = tx.payee;
        if (!map[key]) {
          map[key] = { payee: tx.payee, total: 0, categoryId: tx.category_id };
        }
        map[key].total += tx.amount_cents;
      });
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [transactions]);

  if (merchantTotals.length === 0) return null;

  return (
    <Card padding="0">
      <div className="top-merchants-header">
        <SectionHeader
          icon={<Store />}
          title="Top merchants"
          subtitle="Biggest spend by payee this month."
        />
      </div>
      <div className="top-merchants-grid">
        {merchantTotals.map(({ payee, total, categoryId }) => {
          const cat = categories.find(c => c.id === categoryId);
          const Icon = guessIcon(payee);
          return (
            <div key={payee} className="top-merchant-row">
              <span
                className="top-merchant-row__icon"
                style={{ color: cat?.color || "var(--ink2)" }}
              >
                <Icon size={16} />
              </span>
              <span className="top-merchant-row__name">{payee}</span>
              <span className="top-merchant-row__amount figs">{formatCents(total)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

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
          <MonthYearPicker
            value={monthKey}
            onChange={(event) => setMonthKey(event.target.value)}
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

              <TopMerchants transactions={transactions} categories={categories} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
