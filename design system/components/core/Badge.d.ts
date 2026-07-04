/**
 * @startingPoint section="Core" subtitle="Status pill — Cleared/Pending/Over" viewport="700x100"
 */
export interface BadgeProps {
  tone?: 'positive' | 'neutral' | 'negative';
  children: React.ReactNode;
}
