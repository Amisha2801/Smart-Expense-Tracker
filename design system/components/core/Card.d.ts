/**
 * @startingPoint section="Core" subtitle="Surface container — hairline border, optional elevation" viewport="700x140"
 */
export interface CardProps {
  children: React.ReactNode;
  padding?: string;
  /** Adds the soft warm --shadow. Reserve for hero/banner cards only — most cards are hairline-only. */
  elevated?: boolean;
  style?: React.CSSProperties;
}
