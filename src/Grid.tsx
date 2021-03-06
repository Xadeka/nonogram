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
  return (
    <table role="grid" className="nonogram-grid">
      <tbody>
        {rows.map((row, rowIndex) => {
          return (
            // TODO: Investigate a better key for rows and cells.
            <tr key={rowIndex} role="row">
              {row.map((cellValue, columnIndex) => (
                <td key={columnIndex} role="gridcell" style={{ lineHeight: 0 }}>
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
