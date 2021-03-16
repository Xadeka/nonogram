/**
 * An object containing 0-indexed `row` and `column` values.
 */
interface GridPosition {
  row: number;
  column: number;
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
