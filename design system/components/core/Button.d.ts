/**
 * @startingPoint section="Core" subtitle="Primary/secondary/ghost buttons" viewport="700x120"
 */
export interface ButtonProps {
  /** Visual treatment. primary = solid ink fill, secondary = surface + hairline border, ghost = transparent + hairline border. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  /** Optional leading icon element (Lucide icon). */
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
