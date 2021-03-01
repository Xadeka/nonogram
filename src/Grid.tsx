import { FunctionComponent } from "react";
import "./Grid.css";

type GridProps = {
  /**
   * A 2D array that contains a representation of each cell's state.
   *
   * TODO: Add type for accepted cell values. At the moment, this is either "filled" or "empty".
   */
  rows: string[][];
};

export const Grid: FunctionComponent<GridProps> = ({ rows }) => {
  const rowCount = rows.length;
  // Our column count is dictated by the largest row.
  // This creates an array of the rows' length values, then finds the maximum.
  const columnCount = Math.max(...rows.map((row) => row.length));

  return (
    <table
      role="grid"
      className="nonogram-grid"
      style={{
        // Set CSS variables for a dynamically sized grid.
        ["--nonogram-grid-rows" as any]: rowCount,
        ["--nonogram-grid-columns" as any]: columnCount,
        // Note: Casting the variable keys as any to avoid type error on React.CSSProperties.
        // https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
      }}
    >
      {rows.map((row, rowIndex) => {
        return (
          // TODO: Investigate a better key for rows and cells.
          <tr key={rowIndex} className="nonogram-grid-row">
            {row.map((cellValue, cellIndex) => (
              <td key={cellIndex} className="nonogram-grid-cell">
                {/* Display the cell state but only for screen readers. */}
                <span className="sr-only">{cellValue}</span>
              </td>
            ))}
          </tr>
        );
      })}
    </table>
  );
};
