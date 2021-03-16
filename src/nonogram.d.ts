/**
 * An object containing 0-indexed `column` and `row` values.
 */
interface GridPosition {
  column: number;
  row: number;
}

type CellValue = "filled" | undefined;

/**
 * An object map of cell IDs and cell values.
 */
interface BoardState {
  [row: number]: {
    [column: number]: CellValue;
  };
}

interface GridControlsConfig {
  up: string;
  left: string;
  down: string;
  right: string;
}
