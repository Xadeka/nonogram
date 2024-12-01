import { useState } from "react";
import { useGrid } from "./useGrid";
import { Grid } from "./Grid";
import { createBoardState, getCellTestId } from "./utils";

const getCellId = ({ row, column }: GridPosition) => `cell-${row}-${column}`;

interface BoardProps {
  /**
   * The clues (or hints) that appear above columns and to the side of rows.
   */
  clues: BoardClues;
  /**
   * The initial state of the board.
   */
  initialState?: BoardState;
  controlsConfig?: GridControlsConfig;
}

export const Board = ({ clues, initialState, controlsConfig }: BoardProps) => {
  let height = clues.row.length;
  let width = clues.column.length;
  const { focusedPosition, setFocusedPosition, onKeyDown, onFocus, onBlur } =
    useGrid({
      height,
      width,
      getCellId,
      config: controlsConfig,
    });
  const [boardState, setBoardState] = useState<BoardState>(
    initialState ?? createBoardState(height, width),
  );

  // This handles interaction with the cell/button.
  // It will toggle between "empty" and "filled" at the moment.
  let onCellClick = (cellPosition: GridPosition, currentValue?: string) => {
    let nextValue: CellValue;

    if (!currentValue) {
      nextValue = "filled";
    }

    setFocusedPosition(cellPosition);
    setBoardState({
      ...boardState,
      [cellPosition.row]: {
        ...boardState[cellPosition.row],
        [cellPosition.column]: nextValue,
      },
    });
  };

  let focusedCellId = getCellId(focusedPosition);

  return (
    // TODO: Investigate a better key for rows and cells.
    <Grid onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur}>
      {/* Column headers go in their own row */}
      <Grid.Row>
        <Grid.CornerCell />
        {[...Array(width)].map((_ignored, columnIndex) => {
          return (
            <Grid.Header
              key={columnIndex}
              scope="col"
              clues={clues.column[columnIndex]}
              testId={`columnheader:${columnIndex}`}
            />
          );
        })}
      </Grid.Row>
      {[...Array(height)].map((_ignored, rowIndex) => {
        return (
          <Grid.Row key={rowIndex}>
            {/* The cell rows will contain their own header */}
            <Grid.Header
              scope="row"
              clues={clues.row[rowIndex]}
              testId={`rowheader:${rowIndex}`}
            />
            {[...Array(width)].map((_ignored, columnIndex) => {
              let cellPosition = { row: rowIndex, column: columnIndex };
              let cellId = getCellId(cellPosition);
              let cellValue = boardState[rowIndex][columnIndex];

              return (
                <Grid.Cell
                  key={columnIndex}
                  id={cellId}
                  value={cellValue}
                  onClick={(e) => onCellClick(cellPosition, cellValue)}
                  // tabIndex is determined by what cell is currently focused.
                  // The focused cell will have 1 while all others will have -1.
                  // Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
                  tabIndex={cellId === focusedCellId ? 1 : -1}
                  testId={getCellTestId(cellPosition)}
                />
              );
            })}
          </Grid.Row>
        );
      })}
    </Grid>
  );
};
