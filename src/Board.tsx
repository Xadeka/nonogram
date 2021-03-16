import { useState } from "react";
import { useGrid } from "./useGrid";
import { createBoardState, getCellTestId } from "./utils";

type BoardProps = {
  /**
   * The height of the grid.
   */
  height: number;
  /**
   * The width of the grid.
   */
  width: number;
  /**
   * The initial state of the board.
   */
  initialState?: BoardState;
  controlsConfig?: GridControlsConfig;
};

const getCellId = ({ row, column }: GridPosition) => `cell-${row}-${column}`;

export const Board = ({
  height,
  width,
  initialState,
  controlsConfig,
}: BoardProps) => {
  const {
    focusedPosition,
    setFocusedPosition,
    onKeyDown,
    onFocus,
    onBlur,
  } = useGrid({
    height,
    width,
    getCellId,
    config: controlsConfig,
  });
  const [boardState, setBoardState] = useState<BoardState>(
    initialState ?? createBoardState(height, width)
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
    <table
      role="grid"
      className="bg-gray-300 rounded-md p-0.5 block"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <tbody>
        {[...Array(height)].map((_ignored, rowIndex) => {
          return (
            // TODO: Investigate a better key for rows and cells.
            <tr key={rowIndex} role="row">
              {[...Array(width)].map((_ignored, columnIndex) => {
                const cellPosition = {
                  row: rowIndex,
                  column: columnIndex,
                };

                const cellId = getCellId(cellPosition);
                const cellValue = boardState[rowIndex][columnIndex];
                const pressed = cellValue === "filled";

                return (
                  <td key={columnIndex} role="gridcell" className="p-0.5">
                    <button
                      id={cellId}
                      className={`block h-7 w-7 ${
                        pressed ? "bg-gray-900" : "bg-gray-50"
                      } rounded focus:outline-none focus:ring-4 focus:ring-red-500 focus:z-10 relative`}
                      onClick={(e) => onCellClick(cellPosition, cellValue)}
                      // tabIndex is determined by what cell is currently focused.
                      // The focused cell will have 1 while all others will have -1.
                      // Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
                      tabIndex={cellId === focusedCellId ? 1 : -1}
                      // The button pressed state will represent "filled".
                      // Since we will be controlling these values in state,
                      //   we will set the aria attribute ourselves.
                      aria-pressed={pressed}
                      data-testid={getCellTestId(cellPosition)}
                    >
                      {/*
                       * TODO: What would be an accessible name for the cell buttons?
                       *       Would aria-label be better?
                       * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#basic_buttons
                       */}
                      <span className="sr-only">TODO</span>
                    </button>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
