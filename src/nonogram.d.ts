/**
 * An object containing 0-indexed `column` and `row` values.
 */
interface GridPosition {
  column: number;
  row: number;
}
interface GridControlsConfig {
  up: string;
  left: string;
  down: string;
  right: string;
}
