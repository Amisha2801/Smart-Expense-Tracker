/**
 * @startingPoint section="Core" subtitle="Budget/envelope spend bar, flips to --neg when over" viewport="700x100"
 */
export interface ProgressBarProps {
  value: number;
  max: number;
  /** Track fill color, typically the category color. */
  color?: string;
  /** Color used automatically when value exceeds max. */
  overColor?: string;
  height?: number;
}
