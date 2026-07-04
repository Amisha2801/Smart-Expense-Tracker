/**
 * @startingPoint section="Core" subtitle="KPI tile — income/spent/net-worth style stat" viewport="700x140"
 */
export interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  tone?: 'positive' | 'negative' | 'neutral';
  caption?: string;
}
