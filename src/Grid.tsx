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

export const Grid = ({ rows, onCellChange }: GridProps) => {
  let handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
    if (e.code === "ArrowUp") {
      // Get the previous row.
      // First try the next sibling relative to the current row.
      let currentRow = e.currentTarget.parentElement;
      let nextRow = currentRow?.previousElementSibling;

      // If we don't have a row, we have reached the top of the grid.
      // Wrap around to the bottom.
      if (!nextRow) {
        // Get the parent with all the rows.
        let tbodyParent = currentRow?.parentElement;
        // Set the next row to the first row.
        nextRow = tbodyParent?.lastElementChild;
      }

      // Get the next cell.
      // Get the cellIndex of the current cell. It will be the same as the one in the next row.
      let currentIndex = e.currentTarget.cellIndex;

      let nextCell = nextRow?.children[currentIndex];

      // If there is a next cell, then we'll focus within it.
      if (nextCell) {
        // Move roving tabindex to next cell.
        e.currentTarget.tabIndex = -1;
        (nextCell as HTMLElement).tabIndex = 0;

        // Focus the first element.
        (nextCell.firstElementChild as HTMLElement)?.focus();
      }
    } else if (e.code === "ArrowDown") {
      // Get the next row.
      // First try the next sibling relative to the current row.
      let currentRow = e.currentTarget.parentElement;
      let nextRow = currentRow?.nextElementSibling;

      // If we don't have a row, we have reached the bottom of the grid.
      // Wrap around to the top.
      if (!nextRow) {
        // Get the parent with all the rows.
        let tbodyParent = currentRow?.parentElement;
        // Set the next row to the first row.
        nextRow = tbodyParent?.firstElementChild;
      }

      // Get the next cell.
      // Get the cellIndex of the current cell. It will be the same as the one in the next row.
      let currentIndex = e.currentTarget.cellIndex;

      let nextCell = nextRow?.children[currentIndex];

      // If there is a next cell, then we'll focus within it.
      if (nextCell) {
        // Move roving tabindex to next cell.
        e.currentTarget.tabIndex = -1;
        (nextCell as HTMLElement).tabIndex = 0;

        // Focus the first element.
        (nextCell.firstElementChild as HTMLElement)?.focus();
      }
    } else if (e.code === "ArrowLeft") {
      // Get the next cell.
      let nextCell = e.currentTarget.previousElementSibling;

      // If there isn't a nextCell, we reached the start of the row.
      if (!nextCell) {
        nextCell = e.currentTarget.parentElement?.lastElementChild ?? null;
      }

      // If there is a next cell, then we'll focus within it.
      if (nextCell) {
        // Move roving tabindex to next cell.
        e.currentTarget.tabIndex = -1;
        (nextCell as HTMLElement).tabIndex = 0;

        // Focus the first element.
        (nextCell.firstElementChild as HTMLElement)?.focus();
      }
    } else if (e.code === "ArrowRight") {
      // Get the next cell.
      let nextCell = e.currentTarget.nextElementSibling;

      // If there isn't a nextCell, we reached the end of the row.
      if (!nextCell) {
        nextCell = e.currentTarget.parentElement?.firstElementChild ?? null;
      }

      // If there is a next cell, then we'll focus within it.
      if (nextCell) {
        // Move roving tabindex to next cell.
        e.currentTarget.tabIndex = -1;
        (nextCell as HTMLElement).tabIndex = 0;

        // Focus the first element.
        (nextCell.firstElementChild as HTMLElement)?.focus();
      }
    }
  };

  return (
    <table role="grid" className="nonogram-grid">
      <tbody>
        {rows.map((row, rowIndex) => {
          return (
            // TODO: Investigate a better key for rows and cells.
            <tr key={rowIndex} role="row">
              {row.map((cellValue, columnIndex) => (
                <td
                  key={columnIndex}
                  role="gridcell"
                  style={{ lineHeight: 0 }}
                  onKeyDown={handleKeyDown}
                  tabIndex={-1}
                >
                  <button
                    className="rounded border border-green-500 h-5 w-5 p-0"
                    // The button pressed state will represent "filled".
                    // Since we will be controlling these values in state,
                    //   we will set the aria attribute ourselves.
                    aria-pressed={cellValue === "filled"}
                    onClick={(e) => {
                      let nextValue = "empty";

                      if (cellValue === "filled") {
                        nextValue = "empty";
                      } else if (cellValue === "empty") {
                        nextValue = "filled";
                      }

                      onCellChange(
                        { column: columnIndex, row: rowIndex },
                        nextValue
                      );
                    }}
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
