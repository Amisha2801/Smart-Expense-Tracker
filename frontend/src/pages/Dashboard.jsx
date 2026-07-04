import { useNavigate } from "react-router-dom";
import { ReceiptText, PiggyBank, Wallet, Inbox, Plus } from "lucide-react";
import {
  PageHeader,
  StatCard,
  Card,
  SectionHeader,
  EmptyState,
  Button,
} from "../design-system/components";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <PageHeader eyebrow="Overview" title="Dashboard" />

      <div className="stat-grid">
        <StatCard icon={<ReceiptText />} label="Total expenses" value="$3,000.00" tone="negative" />
        <StatCard icon={<PiggyBank />} label="Monthly budget" value="$7,000.00" tone="neutral" />
        <StatCard icon={<Wallet />} label="Remaining budget" value="$4,000.00" tone="positive" />
      </div>

      <Card padding="28px 30px">
        <SectionHeader
          icon={<ReceiptText />}
          title="Recent transactions"
          subtitle="Your latest activity will show up here."
        />

        <EmptyState
          icon={<Inbox />}
          action={
            <Button icon={<Plus />} onClick={() => navigate("/transactions")}>
              Add expense
            </Button>
          }
        >
          No transactions available.
        </EmptyState>
      </Card>
    </div>
  );
}

export default Dashboard;
