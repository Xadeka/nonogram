import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Grid } from "./Grid";

afterEach(cleanup);

test("On initial grid focus, move focus to first cell", async () => {
  renderGrid(5, 5);

  let cell = screen.getByTestId("0:0");

  // Ensure that the first cell is not focused initially.
  expect(cell).not.toHaveFocus();

  // Tab to the grid which sets focus internally.
  userEvent.tab();
  expect(cell).toHaveFocus();
});

test("Clicking a cell focuses that cell", () => {
  let { getCell } = renderGrid(5, 5);

  let cell = getCell({ column: 3, row: 2 });

  expect(cell).not.toHaveFocus();
  userEvent.click(getCell({ column: 3, row: 2 }));
  expect(cell).toHaveFocus();
});

test("On grid refocus, shift focus to last focused cell", async () => {
  renderGrid(5, 5);

  let cell = screen.getByTestId("3:3");

  // Focus a paticular cell with click.
  userEvent.click(cell);
  expect(cell).toHaveFocus();

  // Tabbing away from the grid.
  userEvent.tab();
  expect(cell).not.toHaveFocus();

  // Tab cycles goes back to the grid which focuses the last cell.
  userEvent.tab();
  expect(cell).toHaveFocus();
});

test("Can use arrow keys for board navigation", () => {
  let { pressKey, getCell } = renderGrid(5, 5);

  userEvent.click(getCell({ column: 2, row: 2 }));

  pressKey("ArrowUp");
  expect(getCell({ column: 2, row: 1 })).toHaveFocus();

  pressKey("ArrowRight");
  expect(getCell({ column: 3, row: 1 })).toHaveFocus();

  pressKey("ArrowDown");
  expect(getCell({ column: 3, row: 2 })).toHaveFocus();

  pressKey("ArrowLeft");
  expect(getCell({ column: 2, row: 2 })).toHaveFocus();
});

test("When navigating against an edge of the grid, focus wraps to the opposite side", () => {
  let { pressKey, getCell } = renderGrid(5, 5);

  userEvent.click(getCell({ column: 0, row: 0 }));

  // Wrap from top to bottom...
  pressKey("ArrowUp");
  expect(getCell({ column: 0, row: 4 })).toHaveFocus();

  // ...and back to top.
  pressKey("ArrowDown");
  expect(getCell({ column: 0, row: 0 })).toHaveFocus();

  // Then to the left...
  pressKey("ArrowLeft");
  expect(getCell({ column: 4, row: 0 })).toHaveFocus();

  // ...and back to right.
  pressKey("ArrowRight");
  expect(getCell({ column: 0, row: 0 })).toHaveFocus();
});

test("Configurable keyboard navigation", () => {
  let { pressKey, getCell } = renderGrid(5, 5, {
    up: "w",
    left: "a",
    down: "s",
    right: "d",
  });

  userEvent.click(getCell({ column: 2, row: 2 }));

  pressKey("w");
  expect(getCell({ column: 2, row: 1 })).toHaveFocus();

  pressKey("d");
  expect(getCell({ column: 3, row: 1 })).toHaveFocus();

  pressKey("s");
  expect(getCell({ column: 3, row: 2 })).toHaveFocus();

  pressKey("a");
  expect(getCell({ column: 2, row: 2 })).toHaveFocus();
});

function renderGrid(
  height: number,
  width: number,
  config?: GridControlsConfig
) {
  render(<Grid height={height} width={width} controlsConfig={config} />);

  let grid = screen.getByRole("grid");

  return {
    // The grid cells have test IDs set as "columnIndex:rowIndex".
    // For example, top left cell has `data-testid="0:0"`
    getCell: (position: GridPosition) => {
      return screen.getByTestId(`${position.column}:${position.row}`);
    },
    pressKey: (key: string) => {
      fireEvent.keyDown(grid, { key });
    },
  };
}
