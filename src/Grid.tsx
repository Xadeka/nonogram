import { useState, useEffect } from "react";
import "./Grid.css";

type GridProps = {
  /**
   * A 2D array that contains a representation of each cell's state.
   *
   * TODO: Add type for accepted cell values. At the moment, this is either "filled" or "empty".
   */
  rows: string[][];
  onCellChange: (
    position: { column: number; row: number },
    value: string
  ) => void;
};

/**
 * An object containing 0-indexed `column` and `row` values.
 */
type GridPosition = {
  column: number;
  row: number;
};

const getCellId = ({ column, row }: GridPosition) => `cell-${column}-${row}`;

export const Grid = ({ rows, onCellChange }: GridProps) => {
  const [focusedPosition, setFocusedPosition] = useState<GridPosition>({
    // Initial focus will be the first (top left) cell.
    column: 0,
    row: 0,
  });

  // When active cell changes:
  // - Update the roving tab index. Next cell gets 1; Previous cell gets -1.
  // - Change focus to the next cell.
  // Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
  useEffect(() => {
    let elementReceivingFocus = document.getElementById(
      getCellId(focusedPosition)
    );

    if (elementReceivingFocus !== null) {
      elementReceivingFocus.tabIndex = 0;
      elementReceivingFocus.focus();
    }

    // During effect clean up, the last element receiving focus will lose focus.
    // Creating new variable for clarity.
    let elementLosingFocus = elementReceivingFocus;

    return () => {
      if (elementLosingFocus !== null) {
        elementLosingFocus.tabIndex = -1;
      }
    };
  }, [focusedPosition]);

  // Calculate height and width for convience in handleCellKeyDown.
  let height = rows.length;
  let width = Math.max(...rows.map((row) => row.length));

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

  // This handles interaction with the cell/button.
  // It will toggle between "empty" and "filled" at the moment.
  let onCellClick = (currentValue: string) => {
    let nextValue = "empty";

    if (currentValue === "filled") {
      nextValue = "empty";
    } else if (currentValue === "empty") {
      nextValue = "filled";
    }

    onCellChange(focusedPosition, nextValue);
  };

  return (
    <table
      role="grid"
      className="nonogram-grid"
      onKeyDown={(e) => handleNavigationKeyDown(e.key)}
    >
      <tbody>
        {rows.map((row, rowIndex) => {
          return (
            // TODO: Investigate a better key for rows and cells.
            <tr key={rowIndex} role="row">
              {row.map((cellValue, columnIndex) => (
                <td key={columnIndex} role="gridcell" style={{ lineHeight: 0 }}>
                  <button
                    id={getCellId({ column: columnIndex, row: rowIndex })}
                    className="rounded border border-green-500 h-5 w-5 p-0"
                    onClick={(e) => onCellClick(cellValue)}
                    // Default -1 and will be updated once this element has focus.
                    tabIndex={-1}
                    // The button pressed state will represent "filled".
                    // Since we will be controlling these values in state,
                    //   we will set the aria attribute ourselves.
                    aria-pressed={cellValue === "filled"}
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
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
