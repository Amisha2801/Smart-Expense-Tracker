/**
 * @startingPoint section="Core" subtitle="Sidebar nav row, active = solid ink fill" viewport="700x100"
 */
export interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
