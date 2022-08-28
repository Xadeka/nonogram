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

/**
 * An object with row and column clues.
 * These are used to display the clues (or hints)
 * at the ends of a row or column.
 *
 * Clues for row with the value [[1, 1], [], [2]]
 * would have 3 rows.
 */
interface BoardClues {
  row: number[][];
  column: number[][];
}

interface GridControlsConfig {
  up: string;
  left: string;
  down: string;
  right: string;
}
