import React, { useState, useEffect } from "react";
import "./Grid.css";

/**
 * An object map of cell IDs and cell values.
 */
export type GridState = {
  [cellId: string]: string | undefined;
};

type GridProps = {
  /**
   * The height of the grid.
   */
  height: number;
  /**
   * The width of the grid.
   */
  width: number;
  // TODO: Should this state be managed here?
  // Consider a `defaultState` if we need to initalize it.
  // But maybe the component should handle state internally.
  /**
   * The current state of the grid.
   */
  state: GridState;
  /**
   * Handler for cell state changes.
   * @param cellId The ID of the cell.
   * @param value The value that the cell should change to.
   */
  onCellChange: (cellId: string, value?: string) => void;
};

function useGrid<T extends HTMLElement>({
  height,
  width,
  getCellId,
}: {
  height: number;
  width: number;
  getCellId: (position: GridPosition) => string;
}) {
  const [gridHasFocus, setGridHasFocus] = useState(false);
  const [focusedPosition, setFocusedPosition] = useState<GridPosition>({
    // Initial focus will be the first (top left) cell.
    column: 0,
    row: 0,
  });

  // Compute the focused cell's ID so that the useEffect below
  // doesn't care if getCellId's reference changes.
  let focusedCellId = getCellId(focusedPosition);

  // When active cell changes, focus that element.
  useEffect(() => {
    // Don't focus children if the component hasn't been focused first.
    if (!gridHasFocus) {
      return;
    }

    let elementReceivingFocus = document.getElementById(focusedCellId);

    if (elementReceivingFocus !== null) {
      elementReceivingFocus.focus();
    }
  }, [gridHasFocus, focusedCellId]);

  // This handles keyboard input to move to the next cell.
  // It will wrap around to the opposite side if we reached the end of the current row or column.
  let handleNavigationKeyDown = (key: string) => {
    // Move down or right
    // This will wrap to the start if we reach the end.
    const moveNext = (index: number, length: number) => {
      if (index < length - 1) {
        return index + 1;
      } else {
        return 0;
      }
    };

    // Move up or left
    // This will wrap to the end if we reach the start.
    const movePrevious = (index: number, length: number) => {
      if (index > 0) {
        return index - 1;
      } else {
        return length - 1;
      }
    };

    // Update column and row to their next value.
    // Default to their current postiion.
    let column = focusedPosition.column;
    let row = focusedPosition.row;

    switch (key) {
      case "ArrowUp":
        row = movePrevious(row, height);
        break;
      case "ArrowRight":
        column = moveNext(column, width);
        break;
      case "ArrowDown":
        row = moveNext(row, height);
        break;
      case "ArrowLeft":
        column = movePrevious(column, width);
        break;
      default:
        break;
    }

    setFocusedPosition({ column, row });
  };

  return {
    focusedPosition,
    setFocusedPosition,
    // Prevent key interactions if the grid does not have focus.
    onKeyDown: gridHasFocus
      ? (e: React.KeyboardEvent<T>) => handleNavigationKeyDown(e.key)
      : undefined,
    onFocus: (e: React.FocusEvent<T>) => setGridHasFocus(true),
    onBlur: (e: React.FocusEvent<T>) => setGridHasFocus(false),
  };
}

const getCellId = ({ column, row }: GridPosition) => `cell-${column}-${row}`;

export const Grid = ({ height, width, state, onCellChange }: GridProps) => {
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
  });

  // This handles interaction with the cell/button.
  // It will toggle between "empty" and "filled" at the moment.
  let onCellClick = (cellPosition: GridPosition, currentValue?: string) => {
    let nextValue;

    if (!currentValue) {
      nextValue = "filled";
    }

    setFocusedPosition(cellPosition);
    onCellChange(getCellId(cellPosition), nextValue);
  };

  let focusedCellId = getCellId(focusedPosition);

  return (
    <table
      role="grid"
      className="nonogram-grid"
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
                  column: columnIndex,
                  row: rowIndex,
                };
                const cellId = getCellId(cellPosition);

                const cellValue = state[cellId];

                return (
                  <td
                    key={columnIndex}
                    role="gridcell"
                    style={{ lineHeight: 0 }}
                  >
                    <button
                      id={cellId}
                      className="rounded border border-green-500 h-5 w-5 p-0"
                      onClick={(e) => onCellClick(cellPosition, cellValue)}
                      // tabIndex is determined by what cell is currently focused.
                      // The focused cell will have 1 while all others will have -1.
                      // Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
                      tabIndex={cellId === focusedCellId ? 1 : -1}
                      // The button pressed state will represent "filled".
                      // Since we will be controlling these values in state,
                      //   we will set the aria attribute ourselves.
                      aria-pressed={cellValue === "filled"}
                      data-testid={`${columnIndex}:${rowIndex}`}
                    >
                      {/*
                       * This is the accessible name for the button.
                       * Using the button's content instead of aria-label.
                       * If there isn't CSS on the page, we will still have labels on the buttons.
                       * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#basic_buttons
                       */}
                      <span className="sr-only">{`${columnIndex}:${rowIndex}`}</span>
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
