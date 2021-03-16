import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "./Board";

afterEach(cleanup);

test("On initial grid focus, move focus to first cell", () => {
  renderBoard(5, 5);

  let cell = screen.getByTestId("0:0");

  // Ensure that the first cell is not focused initially.
  expect(cell).not.toHaveFocus();

  // Tab to the grid which sets focus internally.
  userEvent.tab();
  expect(cell).toHaveFocus();
});

test("Clicking a cell focuses that cell", () => {
  let { getCell } = renderBoard(5, 5);

  let cell = getCell({ row: 2, column: 3 });

  expect(cell).not.toHaveFocus();
  userEvent.click(getCell({ row: 2, column: 3 }));
  expect(cell).toHaveFocus();
});

test("On grid refocus, shift focus to last focused cell", () => {
  renderBoard(5, 5);

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
  let { pressKey, getCell } = renderBoard(5, 5);

  userEvent.click(getCell({ row: 2, column: 2 }));

  pressKey("ArrowUp");
  expect(getCell({ row: 1, column: 2 })).toHaveFocus();

  pressKey("ArrowRight");
  expect(getCell({ row: 1, column: 3 })).toHaveFocus();

  pressKey("ArrowDown");
  expect(getCell({ row: 2, column: 3 })).toHaveFocus();

  pressKey("ArrowLeft");
  expect(getCell({ row: 2, column: 2 })).toHaveFocus();
});

test("When navigating against an edge of the grid, focus wraps to the opposite side", () => {
  let { pressKey, getCell } = renderBoard(5, 5);

  userEvent.click(getCell({ row: 0, column: 0 }));

  // Wrap from top to bottom...
  pressKey("ArrowUp");
  expect(getCell({ row: 4, column: 0 })).toHaveFocus();

  // ...and back to top.
  pressKey("ArrowDown");
  expect(getCell({ row: 0, column: 0 })).toHaveFocus();

  // Then to the left...
  pressKey("ArrowLeft");
  expect(getCell({ row: 0, column: 4 })).toHaveFocus();

  // ...and back to right.
  pressKey("ArrowRight");
  expect(getCell({ row: 0, column: 0 })).toHaveFocus();
});

test("Configurable keyboard navigation", () => {
  let { pressKey, getCell } = renderBoard(5, 5, {
    up: "w",
    left: "a",
    down: "s",
    right: "d",
  });

  userEvent.click(getCell({ row: 2, column: 2 }));

  pressKey("w");
  expect(getCell({ row: 1, column: 2 })).toHaveFocus();

  pressKey("d");
  expect(getCell({ row: 1, column: 3 })).toHaveFocus();

  pressKey("s");
  expect(getCell({ row: 2, column: 3 })).toHaveFocus();

  pressKey("a");
  expect(getCell({ row: 2, column: 2 })).toHaveFocus();
});

function renderBoard(
  height: number,
  width: number,
  config?: GridControlsConfig
) {
  render(<Board height={height} width={width} controlsConfig={config} />);

  let grid = screen.getByRole("grid");

  return {
    // The grid cells have test IDs set as "rowIndex:columnIndex".
    // For example, top middle cell of a 5x5 grid has `data-testid="0:2"`
    getCell: (position: GridPosition) => {
      return screen.getByTestId(`${position.row}:${position.column}`);
    },
    pressKey: (key: string) => {
      fireEvent.keyDown(grid, { key });
    },
  };
}
