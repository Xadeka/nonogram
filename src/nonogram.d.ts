/**
 * An object containing 0-indexed `column` and `row` values.
 */
interface GridPosition {
  column: number;
  row: number;
}

/**
 * An object map of cell IDs and cell values.
 */
interface GridState {
  [cellId: string]: string | undefined;
}

interface GridControlsConfig {
  up: string;
  left: string;
  down: string;
  right: string;
}
